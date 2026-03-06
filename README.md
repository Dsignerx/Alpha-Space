# Alpha-Space

Escena 3D interactiva construida con Vite + Three.js.

## Ejecutar en local

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Controles

- `←` / `→`: mover nave en eje X
- `↑` / `↓`: mover nave en eje Z
- `w` / `s`: mover nave en eje Y

## Estructura de código

```txt
src/
  main.js
  config.js
  core/
    scene.js
    loop.js
  input/
    keyboard.js
  entities/
    ship.js
    station.js
  effects/
    stars.js
    galaxy.js
    particles.js
  lib/
    three.js
```

## Notas

- El proyecto fue modularizado para separar responsabilidades (escena, input, entidades y efectos).
- Se mantiene la experiencia visual original, pero con arquitectura preparada para crecer.
