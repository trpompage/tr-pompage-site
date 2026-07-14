/* Divergence du champ de vitesses (second membre de l'équation de Poisson). */

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexel;

void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).y;

  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vUv.x - uTexel.x < 0.0) { L = -C.x; }
  if (vUv.x + uTexel.x > 1.0) { R = -C.x; }
  if (vUv.y - uTexel.y < 0.0) { B = -C.y; }
  if (vUv.y + uTexel.y > 1.0) { T = -C.y; }

  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
