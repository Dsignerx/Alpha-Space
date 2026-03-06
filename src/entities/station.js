import * as THREE from '../lib/three.js'
import { STATION } from '../config.js'

export function createStation() {
  const group = new THREE.Group()

  const holoGeometry = new THREE.TorusGeometry(
    STATION.hologram.radius,
    STATION.hologram.tube,
    STATION.hologram.radialSegments,
    STATION.hologram.tubularSegments,
  )
  const holoMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: STATION.hologram.opacity,
  })
  const holoRing = new THREE.Mesh(holoGeometry, holoMaterial)
  holoRing.rotation.x = Math.PI / 2
  group.add(holoRing)

  const stationLight = new THREE.PointLight(0x66ccff, 2, 200)
  stationLight.position.set(0, 0, 0)
  group.add(stationLight)

  const windowsGroup = new THREE.Group()
  const windowMaterials = []

  for (let ring = 0; ring < STATION.windows.rings; ring += 1) {
    const zPos = STATION.windows.zStart + ring * STATION.windows.zStep

    for (let i = 0; i < STATION.windows.perRing; i += 1) {
      const angle = (i / STATION.windows.perRing) * Math.PI * 2
      const x = Math.cos(angle) * STATION.windows.radius
      const y = Math.sin(angle) * STATION.windows.radius

      const geometry = new THREE.SphereGeometry(0.1, 8, 8)
      const material = new THREE.MeshStandardMaterial({
        color: 0x66ccff,
        emissive: 0x66ccff,
        emissiveIntensity: 1.5,
      })

      const win = new THREE.Mesh(geometry, material)
      win.position.set(x, y, zPos)
      win.lookAt(x * 2, y * 2, zPos)
      windowsGroup.add(win)
      windowMaterials.push(material)
    }
  }

  group.add(windowsGroup)

  const updatePulse = (pulseTime) => {
    stationLight.intensity = 2 + Math.sin(pulseTime) * 1.5
    holoRing.material.opacity = 0.5 + Math.sin(pulseTime * 2) * 0.3

    const pulse = Math.sin(pulseTime * 3) * 0.5 + 0.5
    const hueOffset = pulseTime * 0.1

    windowMaterials.forEach((mat, i) => {
      const hue = (i / windowMaterials.length + hueOffset) % 1
      const color = new THREE.Color()
      color.setHSL(hue, 0.7, 0.5)
      mat.emissive.copy(color)
      mat.emissiveIntensity = 0.5 + pulse * 2
    })
  }

  const dispose = () => {
    holoGeometry.dispose()
    holoMaterial.dispose()
    windowsGroup.children.forEach((windowMesh) => {
      windowMesh.geometry.dispose()
    })
    windowMaterials.forEach((material) => material.dispose())
  }

  return { group, updatePulse, dispose }
}
