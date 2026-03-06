import * as THREE from '../lib/three.js'
import { CAMERA, SHIP } from '../config.js'

const followOffset = new THREE.Vector3(...CAMERA.followOffset)

export function createShip() {
  const velocity = new THREE.Vector3()

  const geometry = new THREE.SphereGeometry(SHIP.radius, 2, 32)
  const material = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    emissive: 0x112244,
    metalness: 0.6,
    roughness: 0.3,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(...SHIP.initialPosition)

  const update = (keys, camera) => {
    if (keys.left) velocity.x -= SHIP.acceleration
    if (keys.right) velocity.x += SHIP.acceleration
    if (keys.forward) velocity.z -= SHIP.acceleration
    if (keys.backward) velocity.z += SHIP.acceleration
    if (keys.up) velocity.y += SHIP.acceleration
    if (keys.down) velocity.y -= SHIP.acceleration

    velocity.multiplyScalar(SHIP.damping)
    mesh.position.add(velocity)
    mesh.rotation.z = -velocity.x * 2
    mesh.rotation.x = velocity.z * 2

    const desiredPos = mesh.position.clone().add(followOffset)
    camera.position.lerp(desiredPos, CAMERA.followSmoothFactor)
    camera.lookAt(mesh.position)
  }

  const dispose = () => {
    geometry.dispose()
    material.dispose()
  }

  return { mesh, update, dispose }
}
