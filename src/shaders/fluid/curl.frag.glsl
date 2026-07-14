/* Rotationnel du champ de vitesses (pour le vorticity confinement). */

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexel;

void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
