import { useEffect, useReducer, useState } from 'react';
import { useQueryFirst, useTrait } from 'koota/react';
import { GrassCulling, IsPlanet } from '../../core/traits';

import type { Entity, TraitRecord } from 'koota';

export function GrassDebug() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('grassDebug') === '1';
  });
  const entity = useQueryFirst(IsPlanet);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.code !== 'KeyG') return;
      setEnabled((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="debug-controls">
      <button className="debug-toggle" type="button" onClick={() => setEnabled((prev) => !prev)}>
        {enabled ? 'Hide grass debug' : 'Show grass debug'}
      </button>
      {enabled && entity && <GrassDebugPanel entity={entity} />}
    </div>
  );
}

function GrassDebugPanel({ entity }: { entity: Entity }) {
  const culling = useTrait(entity, GrassCulling);
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let id: number;
    const poll = () => {
      tick();
      id = requestAnimationFrame(poll);
    };
    id = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(id);
  }, []);

  if (!culling) return <div className="debug-panel">Grass debug: waiting</div>;

  return <GrassDebugStats culling={culling} />;
}

function GrassDebugStats({ culling }: { culling: TraitRecord<typeof GrassCulling> }) {
  const visible = culling.mesh.count;
  const visiblePct = ((visible / culling.totalCount) * 100).toFixed(1);
  return (
    <div className="debug-panel">
      <div>
        Grass {visible.toLocaleString()} / {culling.totalCount.toLocaleString()} visible ({visiblePct}
        %)
      </div>
      <div>Threshold {culling.visibilityThreshold.toFixed(2)}</div>
      <div>Update every {culling.updateInterval} frames</div>
      <div>Press G to toggle</div>
    </div>
  );
}
