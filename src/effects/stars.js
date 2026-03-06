import * as THREE from '../lib/three.js'
import { STARS } from '../config.js'

function createStars({ count, size, spread }) {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i += 1) {
    positions[i] = (Math.random() - 0.5) * spread
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({ size, color: 0xffffff })

  return new THREE.Points(geometry, material)
}

export function addStarLayers(scene) {
  const layers = STARS.layers.map((layer) => createStars(layer))
  layers.forEach((points) => scene.add(points))
  return layers
}
