import { useWorld } from 'koota/react';
import { useCallback } from 'react';
import { Keyboard } from '../../core/traits';
import './touch-controls.css';

const BUTTONS = [
  { label: '▲', code: 'ArrowUp', gridArea: 'n' },
  { label: '▼', code: 'ArrowDown', gridArea: 's' },
  { label: '◀', code: 'ArrowLeft', gridArea: 'w' },
  { label: '▶', code: 'ArrowRight', gridArea: 'e' },
] as const;

export function TouchControls() {
  const world = useWorld();

  const press = useCallback(
    (code: string) => world.get(Keyboard)!.keys.add(code),
    [world]
  );
  const release = useCallback(
    (code: string) => world.get(Keyboard)!.keys.delete(code),
    [world]
  );

  return (
    <div className="touch-controls">
      {BUTTONS.map(({ label, code, gridArea }) => (
        <button
          key={code}
          className="touch-btn"
          style={{ gridArea }}
          onPointerDown={() => press(code)}
          onPointerUp={() => release(code)}
          onPointerLeave={() => release(code)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
