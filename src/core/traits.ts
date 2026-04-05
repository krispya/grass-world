import { trait } from 'koota';
import type { World as CrashcatWorld, RigidBody } from 'crashcat';
import { type IUniform, type InstancedMesh, type Object3D, type ShaderMaterial } from 'three';

// ── Singletons (passed to createWorld) ──────────────────────────────────────

export const Time = trait({ delta: 0, elapsed: 0 });
export const Keyboard = trait(() => ({ keys: new Set<string>() }));
export const InputDirection = trait(() => ({ x: 0, y: 0 }));

// ── Physics ─────────────────────────────────────────────────────────────────

export const Physics = trait(() => null! as CrashcatWorld);
export const PhysicsBody = trait(() => null! as RigidBody);

// ── Planet (the rotating planet container) ──────────────────────────────────

export const IsPlanet = trait();
export const AngularVelocity = trait({ x: 0, y: 0 });
export const RotationConfig = trait({ acceleration: 20, friction: 5, maxSpeed: 5 });

export const Grass = trait({ bW: 0.065, bH: 0.5, joints: 5, count: 60000 });

export const GrassCulling = trait({
  mesh: () => null! as InstancedMesh,
  totalCount: 0,
  normals: () => new Float32Array(),
  matrices: () => new Float32Array(),
  visibilityThreshold: 0,
  updateInterval: 0,
  frame: 0,
});

export const GrassRimLighting = trait({
  pulseSpeed: 0.3,
  pulseMin: 0.2,
  pulseMax: 0.6,
  powerPulseSpeed: 0.15,
  powerMin: 3.0,
  powerMax: 6.0,
  orbitSpeed: 0.2,
});
export const Wind = trait({ speed: 0.5, rotStrength: 0.1, rotSwayAtten: 1.5 });

// ── View refs ───────────────────────────────────────────────────────────────

export const Ref = trait(() => null! as Object3D);
export const MaterialRef = trait(() => null! as ShaderMaterial);
export const AnalyticHemisphereUniformsRef = trait(() => null! as Record<string, IUniform>);

// ── Moon ─────────────────────────────────────────────────────────────────────

export const IsMoon = trait();
export const Orbit = trait({ radius: 9, speed: 0.3 });

// ── Space ────────────────────────────────────────────────────────────────────

export const Space = trait({
  colorBase: '#312a49',
  colorA: 'hotpink',
  colorB: '#447',
  originX: 100,
  originY: 100,
  originZ: 100,
  far: 300,
  colorSpeed: 0.3,
  alphaMin: 0.2,
  alphaMax: 0.8,
});

// ── Stars ────────────────────────────────────────────────────────────────────

export const Stars = trait({
  count: 5000,
  radius: 100,
  depth: 50,
  factor: 4,
  saturation: 0,
  fade: true,
  speed: 0.8,
  twinkleAmplitude: 0.6,
  twinkleChance: 0.3,
  colorShift: 0,
  brightnessMin: 0.7,
  brightnessMax: 1.0,
  opacity: 1.0,
  tint: '#ffffff',
  tintMin: 0.0,
  tintMax: 0.0,
});
export const StarsMaterialRef = trait(() => null! as ShaderMaterial);
