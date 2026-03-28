import type { World } from 'koota'
import type { RootState } from '@react-three/fiber'
import { Time } from '../traits'

export function updateTime(world: World, state: RootState, delta: number) {
	world.set(Time, { delta, elapsed: state.clock.elapsedTime })
}
