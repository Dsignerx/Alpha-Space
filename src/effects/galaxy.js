import * as THREE from '../lib/three.js'
import { GALAXY } from '../config.js'

export function createGalaxy() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(GALAXY.count * 3)
  const colors = []

  for (let i = 0; i < GALAXY.count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * GALAXY.spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * GALAXY.spread
    positions[i * 3 + 2] = (Math.random() - 0.5) * GALAXY.spread

    const color = new THREE.Color(0.5 + Math.random() * 0.5, 0.2 + Math.random() * 0.4, 1)
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: GALAXY.size,
    vertexColors: true,
    transparent: true,
    opacity: GALAXY.opacity,
  })

  return new THREE.Points(geometry, material)
}
