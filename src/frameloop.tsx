import { useWorld } from 'koota/react'
import { useFrame } from '@react-three/fiber'
import { updateTime } from './core/systems/update-time'
import { updateKeyboardRotation } from './core/systems/update-keyboard-rotation'
import { integrateRotation } from './core/systems/integrate-rotation'
import { updateGrassUniforms } from './core/systems/update-grass-uniforms'
import { applyWind } from './core/systems/apply-wind'
import { updateSpaceUniforms } from './core/systems/update-space-uniforms'

export function Frameloop() {
  const world = useWorld()

  useFrame((state, delta) => {
    updateTime(world, state, delta)
    updateKeyboardRotation(world)
    integrateRotation(world)
    updateGrassUniforms(world)
    applyWind(world)
    updateSpaceUniforms(world)
  })

  return null
}
