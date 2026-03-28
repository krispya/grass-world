import { useEffect } from 'react'
import { useWorld } from 'koota/react'
import { Keyboard } from '../../core/traits'

export function KeyboardCapture() {
  const world = useWorld()

  useEffect(() => {
    const { keys } = world.get(Keyboard)!

    const down = (e: KeyboardEvent) => keys.add(e.code)
    const up = (e: KeyboardEvent) => keys.delete(e.code)

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [world])

  return null
}
