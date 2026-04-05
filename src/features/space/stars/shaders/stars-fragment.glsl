uniform float uFade;
uniform float uColorShift;
uniform float uOpacity;
uniform vec3 uTint;

varying vec3 vColor;
varying float vBrightness;
varying float vTintAmount;

vec3 shiftHue(vec3 c, float shift) {
  float a = shift * 6.2831853;
  float s = sin(a);
  float co = cos(a);
  float k = (1.0 - co) / 3.0;
  return c * mat3(
    co + k, k - s * 0.57735, k + s * 0.57735,
    k + s * 0.57735, co + k, k - s * 0.57735,
    k - s * 0.57735, k + s * 0.57735, co + k
  );
}

void main() {
  float d = distance(gl_PointCoord, vec2(0.5));

  float core = exp(-d * d * 20.0);
  float glow = exp(-d * d * 4.0) * 0.4;
  float alpha = core + glow;

  if (uFade > 0.5) {
    alpha *= smoothstep(0.5, 0.3, d);
  }

  vec3 col = uColorShift != 0.0 ? shiftHue(vColor, uColorShift) : vColor;
  col = mix(col, uTint, vTintAmount);

  gl_FragColor = vec4(col * vBrightness, alpha * uOpacity);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
