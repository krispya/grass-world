// Domain-warped nebula — offsets the sample point by another layer of noise
// to create organic, swirling cloud structures.
vec3 sampleNebula(vec3 dir, float t, float opacity) {
  vec3 p = dir * 2.5;

  vec3 warp = vec3(
    fbm3(p + vec3(0.0, 0.0, t * 0.015)),
    fbm3(p + vec3(5.2, 1.3, t * 0.012)),
    fbm3(p + vec3(1.7, 9.2, t * 0.018))
  );

  float n1 = fbm5(p + warp * 1.2 + t * 0.01);
  n1 = smoothstep(0.38, 0.72, n1);

  float n2 = fbm3(p * 3.0 + warp * 0.5 - t * 0.02);
  n2 = smoothstep(0.42, 0.78, n2) * 0.6;

  vec3 hotPink = vec3(0.90, 0.12, 0.45);
  vec3 deepPurple = vec3(0.30, 0.10, 0.55);
  vec3 coolBlue = vec3(0.15, 0.25, 0.65);

  vec3 col = mix(deepPurple, hotPink, n1);
  col += coolBlue * n2;

  float density = n1 + n2 * 0.5;
  return col * density * opacity;
}

vec3 getNebulaColor(
  vec3 dir,
  float time,
  float opacity,
  float pulseMin,
  float pulseMax,
  float pulseSpeed
) {
  vec3 neb = sampleNebula(dir, time, opacity);
  float breath = sin(time * pulseSpeed) * 0.5 + 0.5;
  neb *= mix(pulseMin, pulseMax, breath);

  float horizonBand = exp(-abs(dir.y + 0.05) * 6.0);
  float horizonWave = fbm3(vec3(dir.xz * 3.0, time * 0.04));
  vec3 horizonGlow = vec3(0.6, 0.15, 0.35) * horizonBand * horizonWave * 0.15;

  return neb + horizonGlow;
}
