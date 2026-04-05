varying vec3 vWorldPos;
uniform float uTime;

#include "../../../../shaders/noise.glsl"
#include "../../../../shaders/analytic-hemisphere.glsl"

// Domain-warped nebula — offsets the sample point by another layer of noise
// to create organic, swirling cloud structures.
vec3 nebula(vec3 dir, float t) {
  vec3 p = dir * 2.5;

  // Warp field: low-freq noise displaces the sample coords
  vec3 warp = vec3(
    fbm3(p + vec3(0.0, 0.0, t * 0.015)),
    fbm3(p + vec3(5.2, 1.3, t * 0.012)),
    fbm3(p + vec3(1.7, 9.2, t * 0.018))
  );

  // Primary structure with warp applied
  float n1 = fbm5(p + warp * 1.2 + t * 0.01);
  n1 = smoothstep(0.38, 0.72, n1);

  // Secondary layer at higher frequency for wispy detail
  float n2 = fbm3(p * 3.0 + warp * 0.5 - t * 0.02);
  n2 = smoothstep(0.42, 0.78, n2) * 0.6;

  // Map density to colors that complement the hotpink/purple palette
  vec3 hotPink = vec3(0.90, 0.12, 0.45);
  vec3 deepPurple = vec3(0.30, 0.10, 0.55);
  vec3 coolBlue = vec3(0.15, 0.25, 0.65);

  vec3 col = mix(deepPurple, hotPink, n1);
  col += coolBlue * n2;

  float density = n1 + n2 * 0.5;
  return col * density * 0.28;
}

// Shooting stars — hash-driven random streaks with a bright head and fading tail.
float shootingStar(vec3 dir, float t) {
  float total = 0.0;

  for (int i = 0; i < 3; i++) {
    float offset = t * 0.4 + float(i) * 19.7;
    float cycle = floor(offset / 5.0);
    float phase = fract(offset / 5.0);

    if (phase > 0.12) continue;

    float seed = cycle * 7.13 + float(i) * 31.7;
    vec3 origin = normalize(vec3(
      sin(seed * 12.9898) * 2.0 - 1.0,
      abs(cos(seed * 78.233)) * 0.3 + 0.3,
      cos(seed * 45.164) * 2.0 - 1.0
    ));

    vec3 trail = normalize(vec3(cos(seed * 23.14), -0.25, sin(seed * 67.89)));

    float headPos = phase * 10.0;
    float dist = length(cross(dir - origin, trail));
    float along = dot(dir - origin, trail);

    float head = exp(-dist * dist * 1200.0) * exp(-abs(along - headPos) * 20.0);
    float tail = exp(-dist * dist * 600.0)
      * smoothstep(headPos, headPos - 2.0, along)
      * smoothstep(-0.2, 0.3, along);

    total += (head * 4.0 + tail) * smoothstep(0.12, 0.0, phase);
  }

  return total;
}

void main() {
  vec3 dir = normalize(vWorldPos);
  vec3 hemisphere = getAnalyticEnvironmentColor(vWorldPos);

  vec3 neb = nebula(dir, uTime);

  float breath = sin(uTime * 0.07) * 0.5 + 0.5;
  neb *= 0.75 + breath * 0.25;

  float star = shootingStar(dir, uTime);
  vec3 starColor = mix(vec3(1.0, 0.85, 0.92), vec3(1.0), star) * star;

  float horizonBand = exp(-abs(dir.y + 0.05) * 6.0);
  float horizonWave = fbm3(vec3(dir.xz * 3.0, uTime * 0.04));
  vec3 horizonGlow = vec3(0.6, 0.15, 0.35) * horizonBand * horizonWave * 0.15;

  gl_FragColor = vec4(hemisphere + neb + starColor + horizonGlow, 1.0);
}
