vec2 nebulaUv(vec3 dir, float time, float driftSpeed) {
  dir = normalize(dir);
  float u = atan(dir.z, dir.x) / 6.28318530718 + 0.5;
  float v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265359 + 0.5;
  return vec2(fract(u + time * driftSpeed), v);
}

vec3 sampleNebula(vec3 dir, float time, float driftSpeed, float opacity) {
  vec2 uv = nebulaUv(dir, time, driftSpeed);
  return texture2D(uNebulaMap, uv).rgb * opacity;
}

vec3 getNebulaColor(
  vec3 dir,
  float time,
  float opacity,
  float driftSpeed,
  float pulseMin,
  float pulseMax,
  float pulseSpeed
) {
  vec3 neb = sampleNebula(dir, time, driftSpeed, opacity);
  float breath = sin(time * pulseSpeed) * 0.5 + 0.5;
  neb *= mix(pulseMin, pulseMax, breath);
  return neb;
}
