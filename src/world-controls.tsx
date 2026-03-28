import { useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyPress } from './util/use-key-press.js'

function quatDamp(current: THREE.Quaternion, target: THREE.Quaternion, lambda: number, delta: number) {
  const angle = current.angleTo(target)
  if (angle > 0) {
    const t = THREE.MathUtils.damp(0, angle, lambda, delta)
    current.slerp(target, t)
  }
}

interface WorldControlsProps {
  angularSpeed?: number
  damping?: number
  children?: ReactNode
}

export function WorldControls({ angularSpeed = 20, damping = 6, children }: WorldControlsProps) {
  const ref = useRef<THREE.Group>(null!)
  const size = useThree((state) => state.size)

  const goal = useMemo(() => new THREE.Quaternion(), [])
  const dragQuat = useMemo(() => new THREE.Quaternion(), [])
  const dragEuler = useMemo(() => new THREE.Euler(), [])

  const keys = useRef({ w: false, s: false, a: false, d: false, up: false, down: false, left: false, right: false })

  useKeyPress('ArrowUp', (p) => (keys.current.up = p))
  useKeyPress('ArrowDown', (p) => (keys.current.down = p))
  useKeyPress('ArrowLeft', (p) => (keys.current.left = p))
  useKeyPress('ArrowRight', (p) => (keys.current.right = p))
  useKeyPress('KeyW', (p) => (keys.current.w = p))
  useKeyPress('KeyS', (p) => (keys.current.s = p))
  useKeyPress('KeyA', (p) => (keys.current.a = p))
  useKeyPress('KeyD', (p) => (keys.current.d = p))

  const rotations = useMemo(() => {
    const deg = THREE.MathUtils.degToRad(angularSpeed)
    return {
      up: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deg),
      down: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -deg),
      left: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -deg),
      right: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), deg),
    }
  }, [angularSpeed])

  // Drag state stored as refs to avoid re-renders
  const dragging = useRef(false)
  const prevPointer = useRef({ x: 0, y: 0 })

  useFrame((_state, delta) => {
    if (!ref.current) return
    const current = ref.current.quaternion
    const k = keys.current

    const up = k.up || k.w
    const down = k.down || k.s
    const left = k.left || k.a
    const right = k.right || k.d

    if (up && left) {
      goal.multiplyQuaternions(rotations.up, current)
      goal.multiplyQuaternions(rotations.left, goal)
    } else if (up && right) {
      goal.multiplyQuaternions(rotations.up, current)
      goal.multiplyQuaternions(rotations.right, goal)
    } else if (down && left) {
      goal.multiplyQuaternions(rotations.down, current)
      goal.multiplyQuaternions(rotations.left, goal)
    } else if (down && right) {
      goal.multiplyQuaternions(rotations.down, current)
      goal.multiplyQuaternions(rotations.right, goal)
    } else if (up) {
      goal.multiplyQuaternions(rotations.up, current)
    } else if (down) {
      goal.multiplyQuaternions(rotations.down, current)
    } else if (left) {
      goal.multiplyQuaternions(rotations.left, current)
    } else if (right) {
      goal.multiplyQuaternions(rotations.right, current)
    }

    quatDamp(current, goal, damping, delta)
  })

  const onPointerDown = (e: any) => {
    dragging.current = true
    prevPointer.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
    ;(e.nativeEvent.target as HTMLElement)?.setPointerCapture?.(e.nativeEvent.pointerId)
    e.stopPropagation()
  }

  const onPointerMove = (e: any) => {
    if (!dragging.current || !ref.current) return
    const dx = (e.nativeEvent.clientX - prevPointer.current.x) / size.width
    const dy = (e.nativeEvent.clientY - prevPointer.current.y) / size.height
    prevPointer.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }

    if (dx !== 0 || dy !== 0) {
      dragQuat.setFromEuler(dragEuler.set(dy * Math.PI * angularSpeed * 0.05, dx * Math.PI * angularSpeed * 0.05, 0))
      goal.multiplyQuaternions(dragQuat, ref.current.quaternion)
    }
    e.stopPropagation()
  }

  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <group
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </group>
  )
}
