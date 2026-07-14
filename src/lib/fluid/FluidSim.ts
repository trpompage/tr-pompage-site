import * as THREE from "three";
import baseVert from "../../shaders/fluid/base.vert.glsl";
import advectionFrag from "../../shaders/fluid/advection.frag.glsl";
import splatFrag from "../../shaders/fluid/splat.frag.glsl";
import curlFrag from "../../shaders/fluid/curl.frag.glsl";
import vorticityFrag from "../../shaders/fluid/vorticity.frag.glsl";
import divergenceFrag from "../../shaders/fluid/divergence.frag.glsl";
import clearFrag from "../../shaders/fluid/clear.frag.glsl";
import pressureFrag from "../../shaders/fluid/pressure.frag.glsl";
import gradientFrag from "../../shaders/fluid/gradient.frag.glsl";

/** Simulation de fluide "stable fluids" sur GPU (WebGL2, ping-pong FBO) :
 *  advection semi-lagrangienne, vorticity confinement, projection de pression
 *  (Jacobi). Le champ de colorant teinté chape est composité dans le shader
 *  du hero. Dégradation invisible si les render targets flottants ne sont
 *  pas disponibles (FluidSim.create → null). */

export interface FluidQuality {
  simRes: number;
  dyeRes: number;
  pressureIterations: number;
}

export const QUALITE_PLEINE: FluidQuality = {
  simRes: 144,
  dyeRes: 512,
  pressureIterations: 20,
};

export const QUALITE_REDUITE: FluidQuality = {
  simRes: 96,
  dyeRes: 256,
  pressureIterations: 12,
};

const RT_OPTS = {
  type: THREE.HalfFloatType,
  format: THREE.RGBAFormat,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  depthBuffer: false,
  stencilBuffer: false,
} as const;

class DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  texel: THREE.Vector2;

  constructor(w: number, h: number) {
    this.read = new THREE.WebGLRenderTarget(w, h, RT_OPTS);
    this.write = new THREE.WebGLRenderTarget(w, h, RT_OPTS);
    this.texel = new THREE.Vector2(1 / w, 1 / h);
  }

  swap() {
    const t = this.read;
    this.read = this.write;
    this.write = t;
  }

  dispose() {
    this.read.dispose();
    this.write.dispose();
  }
}

function mat(fragment: string, uniforms: Record<string, THREE.IUniform>) {
  return new THREE.ShaderMaterial({
    vertexShader: baseVert,
    fragmentShader: fragment,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
}

/** WebGL2 + rendu vers textures flottantes (requis par la sim ET le
 *  post-processing half-float) — sinon dégradation invisible */
export function supportsFloatBuffers(renderer: THREE.WebGLRenderer): boolean {
  const gl = renderer.getContext();
  const isWebGL2 =
    typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
  return (
    isWebGL2 &&
    (renderer.extensions.has("EXT_color_buffer_float") ||
      renderer.extensions.has("EXT_color_buffer_half_float"))
  );
}

/** résolution FBO : dimension mini = res, l'autre suit l'aspect du canvas */
function fboSize(res: number, aspect: number): [number, number] {
  const a = Math.max(aspect, 1 / aspect);
  const max = Math.round(res * a);
  return aspect >= 1 ? [max, res] : [res, max];
}

export class FluidSim {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.Camera();
  private mesh: THREE.Mesh;

  private velocity!: DoubleFBO;
  private dye!: DoubleFBO;
  private pressure!: DoubleFBO;
  private divergence!: THREE.WebGLRenderTarget;
  private curl!: THREE.WebGLRenderTarget;
  private divergenceTexel!: THREE.Vector2;

  private quality: FluidQuality;
  private aspect = 1;

  private mAdvection: THREE.ShaderMaterial;
  private mSplat: THREE.ShaderMaterial;
  private mCurl: THREE.ShaderMaterial;
  private mVorticity: THREE.ShaderMaterial;
  private mDivergence: THREE.ShaderMaterial;
  private mClear: THREE.ShaderMaterial;
  private mPressure: THREE.ShaderMaterial;
  private mGradient: THREE.ShaderMaterial;

  /** paramètres de comportement (unités : texels/s pour la vélocité) */
  velocityDissipation = 0.25;
  dyeDissipation = 0.9;
  curlStrength = 24;
  pressureDecay = 0.8;

  /** null si WebGL2 ou les color buffers flottants manquent (dégradation invisible) */
  static create(renderer: THREE.WebGLRenderer, quality: FluidQuality): FluidSim | null {
    if (!supportsFloatBuffers(renderer)) return null;
    return new FluidSim(renderer, quality);
  }

  private constructor(renderer: THREE.WebGLRenderer, quality: FluidQuality) {
    this.renderer = renderer;
    this.quality = quality;

    this.mAdvection = mat(advectionFrag, {
      uVelocity: { value: null },
      uSource: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uDt: { value: 0 },
      uDissipation: { value: 0 },
    });
    this.mSplat = mat(splatFrag, {
      uTarget: { value: null },
      uAspect: { value: 1 },
      uColor: { value: new THREE.Vector3() },
      uPoint: { value: new THREE.Vector2() },
      uRadius: { value: 0.0025 },
    });
    this.mCurl = mat(curlFrag, {
      uVelocity: { value: null },
      uTexel: { value: new THREE.Vector2() },
    });
    this.mVorticity = mat(vorticityFrag, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uCurlStrength: { value: this.curlStrength },
      uDt: { value: 0 },
    });
    this.mDivergence = mat(divergenceFrag, {
      uVelocity: { value: null },
      uTexel: { value: new THREE.Vector2() },
    });
    this.mClear = mat(clearFrag, {
      uTexture: { value: null },
      uValue: { value: this.pressureDecay },
    });
    this.mPressure = mat(pressureFrag, {
      uPressure: { value: null },
      uDivergence: { value: null },
      uTexel: { value: new THREE.Vector2() },
    });
    this.mGradient = mat(gradientFrag, {
      uPressure: { value: null },
      uVelocity: { value: null },
      uTexel: { value: new THREE.Vector2() },
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mSplat);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);

    this.allocate();
  }

  /** texture de colorant à échantillonner dans le shader du hero */
  get texture(): THREE.Texture {
    return this.dye.read.texture;
  }

  setAspect(aspect: number) {
    if (!aspect || Math.abs(aspect - this.aspect) < 0.01) return;
    this.aspect = aspect;
    this.reallocate();
  }

  setQuality(quality: FluidQuality) {
    if (quality.simRes === this.quality.simRes && quality.dyeRes === this.quality.dyeRes) return;
    this.quality = quality;
    this.reallocate();
  }

  private allocate() {
    const [vw, vh] = fboSize(this.quality.simRes, this.aspect);
    const [dw, dh] = fboSize(this.quality.dyeRes, this.aspect);
    this.velocity = new DoubleFBO(vw, vh);
    this.pressure = new DoubleFBO(vw, vh);
    this.dye = new DoubleFBO(dw, dh);
    this.divergence = new THREE.WebGLRenderTarget(vw, vh, RT_OPTS);
    this.curl = new THREE.WebGLRenderTarget(vw, vh, RT_OPTS);
    this.divergenceTexel = new THREE.Vector2(1 / vw, 1 / vh);
  }

  private reallocate() {
    this.disposeTargets();
    this.allocate();
  }

  private pass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) {
    this.mesh.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  /** injecte vélocité + colorant au point (uv 0..1) — dx/dy en texels/s */
  splat(x: number, y: number, dx: number, dy: number, color: THREE.Color, radius = 0.0025) {
    const u = this.mSplat.uniforms;
    u.uAspect.value = this.aspect;
    u.uPoint.value.set(x, y);
    u.uRadius.value = radius;

    u.uTarget.value = this.velocity.read.texture;
    u.uColor.value.set(dx, dy, 0);
    this.pass(this.mSplat, this.velocity.write);
    this.velocity.swap();

    u.uTarget.value = this.dye.read.texture;
    u.uColor.value.set(color.r, color.g, color.b);
    this.pass(this.mSplat, this.dye.write);
    this.dye.swap();
  }

  /** une itération complète du solveur.
   *  NB : rend le framebuffer écran actif en sortie (setRenderTarget(null)) —
   *  les splats du frame doivent être injectés AVANT l'appel. */
  step(dt: number) {
    const clamped = Math.min(dt, 1 / 30);
    const texel = this.divergenceTexel;

    // rotationnel + vorticity confinement
    this.mCurl.uniforms.uVelocity.value = this.velocity.read.texture;
    this.mCurl.uniforms.uTexel.value.copy(texel);
    this.pass(this.mCurl, this.curl);

    this.mVorticity.uniforms.uVelocity.value = this.velocity.read.texture;
    this.mVorticity.uniforms.uCurl.value = this.curl.texture;
    this.mVorticity.uniforms.uTexel.value.copy(texel);
    this.mVorticity.uniforms.uCurlStrength.value = this.curlStrength;
    this.mVorticity.uniforms.uDt.value = clamped;
    this.pass(this.mVorticity, this.velocity.write);
    this.velocity.swap();

    // divergence puis pression (Jacobi)
    this.mDivergence.uniforms.uVelocity.value = this.velocity.read.texture;
    this.mDivergence.uniforms.uTexel.value.copy(texel);
    this.pass(this.mDivergence, this.divergence);

    this.mClear.uniforms.uTexture.value = this.pressure.read.texture;
    this.mClear.uniforms.uValue.value = this.pressureDecay;
    this.pass(this.mClear, this.pressure.write);
    this.pressure.swap();

    this.mPressure.uniforms.uDivergence.value = this.divergence.texture;
    this.mPressure.uniforms.uTexel.value.copy(texel);
    for (let i = 0; i < this.quality.pressureIterations; i++) {
      this.mPressure.uniforms.uPressure.value = this.pressure.read.texture;
      this.pass(this.mPressure, this.pressure.write);
      this.pressure.swap();
    }

    // projection : champ incompressible
    this.mGradient.uniforms.uPressure.value = this.pressure.read.texture;
    this.mGradient.uniforms.uVelocity.value = this.velocity.read.texture;
    this.mGradient.uniforms.uTexel.value.copy(texel);
    this.pass(this.mGradient, this.velocity.write);
    this.velocity.swap();

    // advection de la vélocité puis du colorant
    this.mAdvection.uniforms.uDt.value = clamped;
    this.mAdvection.uniforms.uTexel.value.copy(texel);
    this.mAdvection.uniforms.uVelocity.value = this.velocity.read.texture;
    this.mAdvection.uniforms.uSource.value = this.velocity.read.texture;
    this.mAdvection.uniforms.uDissipation.value = this.velocityDissipation;
    this.pass(this.mAdvection, this.velocity.write);
    this.velocity.swap();

    this.mAdvection.uniforms.uVelocity.value = this.velocity.read.texture;
    this.mAdvection.uniforms.uSource.value = this.dye.read.texture;
    this.mAdvection.uniforms.uDissipation.value = this.dyeDissipation;
    this.pass(this.mAdvection, this.dye.write);
    this.dye.swap();

    // restaure l'écran pour le rendu principal R3F qui suit
    this.renderer.setRenderTarget(null);
  }

  private disposeTargets() {
    this.velocity.dispose();
    this.dye.dispose();
    this.pressure.dispose();
    this.divergence.dispose();
    this.curl.dispose();
  }

  dispose() {
    this.disposeTargets();
    this.mesh.geometry.dispose();
    [
      this.mAdvection,
      this.mSplat,
      this.mCurl,
      this.mVorticity,
      this.mDivergence,
      this.mClear,
      this.mPressure,
      this.mGradient,
    ].forEach((m) => m.dispose());
  }
}
