/* Une itération de Jacobi pour l'équation de Poisson de la pression. */

varying vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;

void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
