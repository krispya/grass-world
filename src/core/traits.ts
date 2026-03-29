import { trait } from 'koota';
import { type Object3D, type ShaderMaterial } from 'three';

// ── Singletons (passed to createWorld) ──────────────────────────────────────

export const Time = trait({ delta: 0, elapsed: 0 });
export const Keyboard = trait(() => ({ keys: new Set<string>() }));

// ── Planet (the rotating planet container) ──────────────────────────────────

export const IsPlanet = trait();
export const AngularVelocity = trait({ x: 0, y: 0 });
export const RotationConfig = trait({ acceleration: 20, friction: 5, maxSpeed: 5 });
export const Grass = trait({ bW: 0.065, bH: 0.5, joints: 5, count: 60000 });
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

// ── Moon ─────────────────────────────────────────────────────────────────────

export const IsMoon = trait();
export const Orbit = trait({ radius: 9, speed: 0.3, angle: 0, tilt: 0.3 });

// ── Space ────────────────────────────────────────────────────────────────────

export const Space = trait({ colorSpeed: 0.1, alphaMin: 0.0, alphaMax: 0.8 });
