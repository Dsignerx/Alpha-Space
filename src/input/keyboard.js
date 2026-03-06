export function createKeyboardState() {
  const keys = {
    left: false,
    right: false,
    forward: false,
    backward: false,
    up: false,
    down: false,
  }

  const setKey = (event, isPressed) => {
    if (event.key === 'ArrowLeft') keys.left = isPressed
    if (event.key === 'ArrowRight') keys.right = isPressed
    if (event.key === 'ArrowUp') keys.forward = isPressed
    if (event.key === 'ArrowDown') keys.backward = isPressed
    if (event.key === 'w') keys.up = isPressed
    if (event.key === 's') keys.down = isPressed
  }

  const onKeyDown = (event) => setKey(event, true)
  const onKeyUp = (event) => setKey(event, false)

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  return {
    keys,
    dispose: () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    },
  }
}
