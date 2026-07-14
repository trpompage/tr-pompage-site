/* Advection semi-lagrangienne : transporte une quantité (vélocité ou colorant)
   le long du champ de vitesses, avec dissipation exponentielle. */

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;

void main() {
  vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexel;
  vec4 result = texture2D(uSource, coord);
  float decay = 1.0 + uDissipation * uDt;
  gl_FragColor = result / decay;
}
