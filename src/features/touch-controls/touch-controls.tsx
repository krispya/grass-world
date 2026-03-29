import { useWorld } from 'koota/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InputDirection } from '../../core/traits';
import './touch-controls.css';

const RADIUS = 48;
const NUB_SIZE = 36;
const DEAD_ZONE = 0.1;

export function TouchControls() {
  const world = useWorld();
  const baseRef = useRef<HTMLDivElement>(null);
  const nubRef = useRef<HTMLDivElement>(null);
  const activePointer = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const base = baseRef.current;
      const nub = nubRef.current;
      if (!base || !nub) return;

      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let dx = (clientX - cx) / RADIUS;
      let dy = (clientY - cy) / RADIUS;

      // Clamp to unit circle
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 1) {
        dx /= mag;
        dy /= mag;
      }

      // Apply dead zone
      const ax = Math.abs(dx) < DEAD_ZONE ? 0 : dx;
      const ay = Math.abs(dy) < DEAD_ZONE ? 0 : dy;

      nub.style.transform = `translate(${dx * RADIUS}px, ${dy * RADIUS}px)`;

      const input = world.get(InputDirection)!;
      input.x = ax;
      input.y = -ay; // screen Y is inverted
    },
    [world]
  );

  const reset = useCallback(() => {
    activePointer.current = null;
    setIsActive(false);
    const nub = nubRef.current;
    if (nub) nub.style.transform = 'translate(0px, 0px)';

    const input = world.get(InputDirection)!;
    input.x = 0;
    input.y = 0;
  }, [world]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerId !== activePointer.current) return;
      update(e.clientX, e.clientY);
    };

    const end = (e: PointerEvent) => {
      if (e.pointerId !== activePointer.current) return;
      reset();
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [reset, update]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (activePointer.current !== null) return;
      e.preventDefault();
      activePointer.current = e.pointerId;
      setIsActive(true);
      update(e.clientX, e.clientY);
    },
    [update]
  );

  return (
    <div
      ref={baseRef}
      className="joystick-base"
      data-active={isActive}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div ref={nubRef} className="joystick-nub" style={{ width: NUB_SIZE, height: NUB_SIZE }} />
    </div>
  );
}
