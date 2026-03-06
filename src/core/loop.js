export function createLoop({ scene, camera, renderer, ship, station, particles, rotatingPoints }) {
  let pulseTime = 0
  let frameId = null

  const update = () => {
    rotatingPoints.forEach((points) => {
      points.rotation.y += 0.0001
    })

    ship.update()

    pulseTime += 0.05
    station.updatePulse(pulseTime)
    particles.update(pulseTime)
  }

  const render = () => {
    renderer.render(scene, camera)
  }

  const animate = () => {
    frameId = requestAnimationFrame(animate)
    update()
    render()
  }

  return {
    start: animate,
    stop: () => {
      if (frameId) cancelAnimationFrame(frameId)
    },
  }
}
