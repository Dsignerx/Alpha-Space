import { createScene } from './core/scene.js'
import { createLoop } from './core/loop.js'
import { createShip } from './entities/ship.js'
import { createStation } from './entities/station.js'
import { createGalaxy } from './effects/galaxy.js'
import { createParticles } from './effects/particles.js'
import { addStarLayers } from './effects/stars.js'
import { createPlanet } from './effects/planet.js'
import { createKeyboardState } from './input/keyboard.js'

const { scene, camera, renderer, dispose: disposeScene } = createScene()

const keyboard = createKeyboardState()

const starLayers = addStarLayers(scene)
const galaxy = createGalaxy()
scene.add(galaxy)

const station = createStation()
scene.add(station.group)

const ship = createShip()
scene.add(ship.mesh)

const particles = createParticles()
station.group.add(particles.points)

const planet = createPlanet()
scene.add(planet.group)

const loop = createLoop({
  scene,
  camera,
  renderer,
  ship: {
    update: () => ship.update(keyboard.keys, camera),
  },
  station,
  particles,
  rotatingPoints: [...starLayers, galaxy],
  dynamicUpdaters: [planet.update],
})

loop.start()

window.addEventListener('beforeunload', () => {
  loop.stop()
  keyboard.dispose()
  ship.dispose()
  station.dispose()
  particles.dispose()
  planet.dispose()
  disposeScene()
})
