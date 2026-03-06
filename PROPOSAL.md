# Propuesta técnica para evolucionar Alpha-Space

## Objetivo
Pasar del prototipo visual actual a una base mantenible, escalable y fácil de extender sin perder la experiencia 3D.

## Enfoque por fases

### Fase 1 — Ordenar la arquitectura (sin cambiar la experiencia visual)
- Dividir `src/main.js` en módulos:
  - `src/core/scene.js` (scene, camera, renderer, luces)
  - `src/core/loop.js` (animate/update/render)
  - `src/input/keyboard.js` (estado y listeners de teclado)
  - `src/entities/ship.js` (creación y física básica de la nave)
  - `src/entities/station.js` (estación, ventanas, pulso)
  - `src/effects/stars.js` y `src/effects/galaxy.js`
  - `src/effects/particles.js`
- Mantener las mismas constantes visuales inicialmente para evitar regresiones.
- Añadir función `dispose()` en cada módulo para limpieza de geometrías/materiales.

### Fase 2 — Dependencias y build más robusto
- Instalar Three.js vía npm (`three`) en vez de CDN.
- Cambiar imports a módulos locales para asegurar reproducibilidad en CI/CD.
- Congelar versiones y validar build de producción.

### Fase 3 — Calidad y DX (Developer Experience)
- Añadir linting/formatting (`eslint` + `prettier`).
- Agregar scripts:
  - `npm run lint`
  - `npm run format`
  - `npm run check` (build + lint)
- Configurar reglas mínimas para evitar código muerto y variables no usadas.

### Fase 4 — Gameplay/UX incremental
- Límites de movimiento de la nave y “zona segura” alrededor de la estación.
- HUD mínimo con ayuda de controles.
- Parámetros de escena en un `config.js` para tuning rápido.
- Pausa/reanudar animación cuando la pestaña no está activa (rendimiento).

## Estructura sugerida

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
  utils/
    math.js
```

## Criterios de aceptación
- La experiencia visual se ve igual o mejor tras modularizar.
- `npm run build` sigue pasando.
- El código principal queda dividido por responsabilidad.
- README documenta ejecución, controles y arquitectura.

## Riesgos y mitigaciones
- **Riesgo:** romper animaciones al separar módulos.
  - **Mitigación:** migrar por bloques y validar visualmente cada bloque.
- **Riesgo:** diferencias por usar paquete npm en vez de CDN.
  - **Mitigación:** fijar versión de `three` y probar build/preview.

## Primer PR recomendado
1. Migrar import de Three.js a npm.
2. Extraer input + ship controller.
3. Extraer estación (ventanas/pulso).
4. Actualizar README con controles y estructura.

Con ese PR, ya queda la base lista para añadir más features sin crecer en complejidad accidental.
