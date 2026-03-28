import { useEffect } from 'react'
import { useActions } from 'koota/react'
import { actions } from './core/actions'

export function Startup() {
  const { spawnPlanetGroup, spawnSpaceShader } = useActions(actions)

  useEffect(() => {
    const planet = spawnPlanetGroup()
    const space = spawnSpaceShader()

    return () => {
      planet.destroy()
      space.destroy()
    }
  }, [spawnPlanetGroup, spawnSpaceShader])

  return null
}
