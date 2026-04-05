import type { TraitRecord } from 'koota';
import { Color, Vector3, type IUniform } from 'three';
import { Space } from '../../../core/traits';
import analyticHemisphereShader from '../../../shaders/analytic-hemisphere.glsl';

export interface AnalyticEnvShader {
  uniforms: Record<string, IUniform>;
  fragmentShader: string;
}

export function createAnalyticHemisphereUniforms() {
  return {
    uHemisphereColorBase: { value: new Color() },
    uHemisphereColorA: { value: new Color() },
    uHemisphereColorB: { value: new Color() },
    uHemisphereAlpha: { value: 0 },
    uHemisphereOrigin: { value: new Vector3() },
    uHemisphereFar: { value: 0 },
    uTime: { value: 0 },
  };
}

export function syncAnalyticHemisphereUniforms(
  uniforms: ReturnType<typeof createAnalyticHemisphereUniforms>,
  space: TraitRecord<typeof Space>
) {
  uniforms.uHemisphereColorBase.value.set(space.colorBase);
  uniforms.uHemisphereColorA.value.set(space.colorA);
  uniforms.uHemisphereColorB.value.set(space.colorB);
  uniforms.uHemisphereAlpha.value = (space.alphaMax + space.alphaMin) / 2;
  uniforms.uHemisphereOrigin.value.set(space.originX, space.originY, space.originZ);
  uniforms.uHemisphereFar.value = space.far;
}

export function computeHemisphereAlpha(elapsed: number, space: TraitRecord<typeof Space>) {
  const range = (space.alphaMax - space.alphaMin) / 2;
  const mid = (space.alphaMax + space.alphaMin) / 2;
  return Math.sin(elapsed * space.colorSpeed) * range + mid;
}

export function extendStandardMaterialWithAnalyticEnv(
  shader: AnalyticEnvShader,
  uniforms: Record<string, IUniform>
) {
  Object.assign(shader.uniforms, uniforms);

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
${analyticHemisphereShader}
uniform float uAnalyticEnvIntensity;`
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    'vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;',
    `vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

vec3 analyticWorldNormal = normalize( inverseTransformDirection( normal, viewMatrix ) );
vec3 analyticReflectDir = normalize( inverseTransformDirection( reflect( -geometryViewDir, normal ), viewMatrix ) );
vec3 analyticDiffuseEnv = getAnalyticEnvironmentColor( analyticWorldNormal );
vec3 analyticSpecularEnv = getAnalyticEnvironmentColor( analyticReflectDir );
float analyticNoV = saturate( dot( normal, geometryViewDir ) );
float analyticFresnel = pow( 1.0 - analyticNoV, 5.0 );
float analyticDiffuseWeight = 0.6 * ( 1.0 - material.metalness ) * uAnalyticEnvIntensity;
float analyticSpecularWeight = 0.8 * mix( 0.5, 1.0, material.metalness ) * ( 1.0 - material.roughness * 0.5 ) * uAnalyticEnvIntensity;
outgoingLight += analyticDiffuseEnv * material.diffuseContribution * analyticDiffuseWeight;
outgoingLight += analyticSpecularEnv * material.specularColorBlended * ( 0.4 + analyticFresnel ) * analyticSpecularWeight;`
  );
}
