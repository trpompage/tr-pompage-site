precision highp float;

/* Hero "liquid 3D" — métaballs raymarchées + flaque autonivelante.
   Porté tel quel de la référence (P0 : parité). */

uniform float uTime;
uniform float uScroll;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform int uSteps;
uniform sampler2D uFluid; // colorant de la sim Navier-Stokes (P1)
uniform float uFluidOn;

#define MAXD 4
#define MAXR 5
#define POOL_Y -1.28

uniform vec3 uDrops[MAXD];
uniform vec4 uRipples[MAXR];

float smin(float a, float b, float k) {
  float h = clamp(.5 + .5 * (b - a) / k, 0., 1.);
  return mix(b, a, h) - k * h * (1. - h);
}

float poolH(vec2 xz) {
  float h = .022 * sin(xz.x * 2.6 + uTime * 1.1) + .014 * sin(xz.y * 4.2 - uTime * .8 + 1.7);
  for (int i = 0; i < MAXR; i++) {
    vec4 r = uRipples[i];
    float dt = uTime - r.w;
    if (r.z > 0. && dt > 0.) {
      float d = length(xz - r.xy);
      h += r.z * sin(11. * d - dt * 7.5) * exp(-3.2 * d) * exp(-dt * 1.5);
    }
  }
  return h;
}

float map(vec3 p) {
  float t = uTime * .55;
  float melt = uScroll;
  float shrink = 1. - melt * .5;
  float dy = -melt * 1.9;
  float d = length(p - vec3(0., .18 * sin(t * .6) - .05 + dy, 0.)) - (1.02 * shrink + .06 * sin(t * 1.3));
  d = smin(d, length(p - vec3(1.28 * sin(t), .55 * cos(t * .8) + dy, .45 * sin(t * .5))) - .6 * shrink, .85);
  d = smin(d, length(p - vec3(1.35 * cos(t * .7), .78 * sin(t * .9) + dy, .5 * cos(t * .4))) - .48 * shrink, .85);
  d = smin(d, length(p - vec3(.85 * sin(t * 1.25 + 2.), .95 * cos(t * .62) + dy, .3 * sin(t * .85))) - .4 * shrink, .8);
  d = smin(d, length(p - vec3(-.95 * cos(t * .5), -.7 + .15 * sin(t) + dy, .2)) - .52 * shrink, .75);
  d = smin(d, length(p - vec3(uMouse * 2.1, .3)) - .55 * shrink, .95);
  for (int i = 0; i < MAXD; i++) {
    vec3 dr = uDrops[i];
    if (dr.z > 0.) d = smin(d, length(p - vec3(dr.x, dr.y, 0.)) - dr.z, .5);
  }
  float pool = p.y - (POOL_Y + melt * .22 + poolH(p.xz));
  d = smin(d, pool, .55);
  return d;
}

vec3 calcN(vec3 p) {
  vec2 e = vec2(.0022, 0.);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

vec3 env(vec3 r) {
  vec3 sky = mix(vec3(.10, .09, .07), vec3(.55, .50, .40), smoothstep(-.3, .7, r.y));
  sky += vec3(1., .35, .12) * pow(max(1. - abs(r.y - .15), 0.), 9.) * .4;
  sky += vec3(1., .97, .9) * pow(max(dot(r, normalize(vec3(.55, .85, .5))), 0.), 40.) * .8;
  return sky;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  uv -= vec2(-.2, .1);
  vec3 ro = vec3(0., 0., 4.2);
  vec3 rd = normalize(vec3(uv, -1.6));
  float tD = 0., hit = -1.;
  for (int i = 0; i < 96; i++) {
    if (i >= uSteps) break;
    vec3 p = ro + rd * tD;
    float d = map(p);
    if (d < .0014) { hit = tD; break; }
    tD += d * .85;
    if (tD > 11.) break;
  }
  if (hit < 0.) {
    // pas de surface 3D touchée : composite du colorant fluide teinté chape
    if (uFluidOn > .5) {
      vec3 dye = texture2D(uFluid, gl_FragCoord.xy / uRes).rgb;
      float lum = max(dye.r, max(dye.g, dye.b));
      if (lum > .004) {
        vec3 c = dye / (1. + lum * .25); // tone map doux
        gl_FragColor = vec4(c, clamp(lum * 1.15, 0., .95));
        return;
      }
    }
    gl_FragColor = vec4(0.);
    return;
  }
  vec3 p = ro + rd * hit;
  vec3 n = calcN(p);
  vec3 albedo = vec3(.788, .714, .580);
  vec3 deep = vec3(.353, .298, .204);
  float ao = clamp(map(p + n * .28) / .28, 0., 1.);
  vec3 col = mix(deep, albedo, ao);
  col *= mix(.7, 1.08, smoothstep(-1.7, 1.4, p.y));
  vec3 L1 = normalize(vec3(.55, .85, .5));
  float dif = max(dot(n, L1), 0.);
  float fil = max(dot(n, normalize(vec3(-.6, -.2, .4))), 0.) * .25;
  col *= .26 + dif * .95 + fil;
  vec3 h = normalize(L1 - rd);
  col += vec3(1., .98, .92) * pow(max(dot(n, h), 0.), 90.) * 1.4;
  vec3 r = reflect(rd, n);
  float fre = pow(1. - max(dot(n, -rd), 0.), 3.);
  col += env(r) * fre * .55;
  col = mix(col, vec3(1., .353, .122), fre * .32);
  gl_FragColor = vec4(col, 1.);
}
