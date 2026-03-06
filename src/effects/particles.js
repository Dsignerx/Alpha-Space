import * as THREE from '../lib/three.js'
import { PARTICLES } from '../config.js'

export function createParticles() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(PARTICLES.count * 3)
  const particleSpeed = []
  const basePositions = []

  for (let i = 0; i < PARTICLES.count; i += 1) {
    const x = (Math.random() - 0.5) * PARTICLES.spread
    const y = (Math.random() - 0.5) * PARTICLES.spread
    const z = (Math.random() - 0.5) * PARTICLES.spread

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    basePositions.push({ x, y, z })
    particleSpeed.push(Math.random() * 0.01 + 0.005)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x66ccff,
    size: PARTICLES.size,
    transparent: true,
    opacity: PARTICLES.opacity,
  })

  const points = new THREE.Points(geometry, material)

  const update = (pulseTime) => {
    const attrs = points.geometry.attributes.position.array

    for (let i = 0; i < PARTICLES.count; i += 1) {
      const base = basePositions[i]
      const speed = particleSpeed[i]

      attrs[i * 3] = base.x + Math.sin(pulseTime * speed * 5 + i) * 1.5
      attrs[i * 3 + 1] = base.y + Math.cos(pulseTime * speed * 3 + i) * 1.2
      attrs[i * 3 + 2] = base.z + Math.sin(pulseTime * speed * 4 + i) * 1.5
    }

    points.geometry.attributes.position.needsUpdate = true
  }

  const dispose = () => {
    geometry.dispose()
    material.dispose()
  }

  return { points, update, dispose }
}
