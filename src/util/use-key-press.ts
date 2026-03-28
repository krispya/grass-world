import { useEffect, useRef } from 'react'

export function useKeyPress(code: string, callback: (pressed: boolean) => void) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === code) callbackRef.current(true)
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === code) callbackRef.current(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [code])
}
