import * as THREE from '../lib/three.js'
import { CAMERA } from '../config.js'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000010)

  const camera = new THREE.PerspectiveCamera(
    CAMERA.fov,
    window.innerWidth / window.innerHeight,
    CAMERA.near,
    CAMERA.far,
  )
  camera.position.set(...CAMERA.initialPosition)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(15, 50, 50)
  scene.add(dirLight)

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onResize)

  return {
    scene,
    camera,
    renderer,
    dispose: () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    },
  }
}
