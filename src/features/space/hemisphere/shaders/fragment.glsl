varying vec3 vWorldPos;
uniform float uTime;
uniform float uNebulaEnabled;
uniform sampler2D uNebulaMap;
uniform float uNebulaOpacity;
uniform float uNebulaDriftSpeed;
uniform float uNebulaPulseMin;
uniform float uNebulaPulseMax;
uniform float uNebulaPulseSpeed;

#include "../../../../shaders/analytic-hemisphere.glsl"
#include "../../nebula/shaders/nebula.glsl"

void main() {
  vec3 dir = normalize(vWorldPos);
  vec3 hemisphere = getAnalyticEnvironmentColor(vWorldPos);
  vec3 color = hemisphere;

  if (uNebulaEnabled > 0.5) {
    color += getNebulaColor(
      dir,
      uTime,
      uNebulaOpacity,
      uNebulaDriftSpeed,
      uNebulaPulseMin,
      uNebulaPulseMax,
      uNebulaPulseSpeed
    );
  }

  gl_FragColor = vec4(color, 1.0);
}
