import * as THREE from '../lib/three.js'

export function createPlanet() {
  const group = new THREE.Group()

  const planetGeometry = new THREE.SphereGeometry(2.2, 32, 32)
  const planetMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b6cff,
    emissive: 0x101a55,
    emissiveIntensity: 0.7,
    roughness: 0.8,
    metalness: 0.05,
  })

  const planet = new THREE.Mesh(planetGeometry, planetMaterial)
  group.add(planet)

  const ringGeometry = new THREE.TorusGeometry(3.2, 0.08, 16, 100)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x8eb8ff,
    transparent: true,
    opacity: 0.5,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI / 2.8
  group.add(ring)

  const orbitRadius = 34
  const orbitSpeed = 0.12
  const verticalWave = 4.5

  const update = (elapsedTime) => {
    const angle = elapsedTime * orbitSpeed
    group.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle * 0.7) * verticalWave, Math.sin(angle) * orbitRadius)

    planet.rotation.y += 0.004
    ring.rotation.z += 0.0025
  }

  const dispose = () => {
    planetGeometry.dispose()
    planetMaterial.dispose()
    ringGeometry.dispose()
    ringMaterial.dispose()
  }

  return { group, update, dispose }
}
