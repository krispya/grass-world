import { trait } from 'koota';
import { type Object3D, type ShaderMaterial } from 'three';

// ── Singletons (passed to createWorld) ──────────────────────────────────────

export const Time = trait({ delta: 0, elapsed: 0 });
export const Keyboard = trait(() => ({ keys: new Set<string>() }));

// ── Planet (the rotating planet container) ──────────────────────────────────

export const IsPlanet = trait();
export const AngularVelocity = trait({ x: 0, y: 0 });
export const RotationConfig = trait({ acceleration: 20, friction: 5, maxSpeed: 5 });
export const Grass = trait({ bW: 0.065, bH: 0.5, joints: 5, count: 60000, sway: 0.5 });

// ── View refs ───────────────────────────────────────────────────────────────

export const Ref = trait(() => null! as Object3D);
export const MaterialRef = trait(() => null! as ShaderMaterial);

// ── Scene entities ──────────────────────────────────────────────────────────

export const IsSpace = trait();
