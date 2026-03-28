import type { World } from 'koota'
import { IsSpace, MaterialRef, Time } from '../traits'

export function updateSpaceUniforms(world: World) {
  const { elapsed } = world.get(Time)!

  world.query(IsSpace, MaterialRef).updateEach(([mat]) => {
    if (!mat) return
    mat.uniforms.uAlpha.value = Math.sin(elapsed * 0.1) * 0.4 + 0.4
  })
}
