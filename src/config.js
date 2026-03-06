export const CAMERA = {
  fov: 75,
  near: 0.1,
  far: 5000,
  initialPosition: [0, 4, 15],
  followOffset: [0, 2, 15],
  followSmoothFactor: 0.055,
}

export const SHIP = {
  radius: 0.6,
  acceleration: 0.053,
  damping: 0.95,
  initialPosition: [0, 0, 25],
}

export const STARS = {
  layers: [
    { count: 2000, size: 0.5, spread: 500 },
    { count: 400, size: 1.2, spread: 500 },
  ],
}

export const GALAXY = {
  count: 800,
  spread: 400,
  size: 1,
  opacity: 0.6,
}

export const STATION = {
  hologram: {
    radius: 16,
    tube: 0.1,
    radialSegments: 16,
    tubularSegments: 100,
    opacity: 0.7,
  },
  windows: {
    rings: 12,
    perRing: 10,
    radius: 2.2,
    zStart: -4,
    zStep: 1.2,
  },
}

export const PARTICLES = {
  count: 100,
  spread: 20,
  size: 0.2,
  opacity: 0.7,
}
