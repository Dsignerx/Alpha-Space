import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'

// =================== VARIABLES ===================
let velocity = new THREE.Vector3()
let shakeAmount = 0
let shakeDecay = 0.9
let shakeIntensity = 0.15
let acceleration = 0.053
let damping = 0.95
let stationGroup, ship, pulseTime = 0
let galaxy = null, particles = null
const cameraOffset = new THREE.Vector3(0, 2, 15) // cámara un poco más atrás
const smoothFactor = 0.055

const keys = { left: false, right: false, forward: false, backward: false, up: false, down: false }
window.addEventListener("keydown", e => { if(e.key==='ArrowLeft') keys.left=true; if(e.key==='ArrowRight') keys.right=true; if(e.key==='ArrowUp') keys.forward=true; if(e.key==='ArrowDown') keys.backward=true; if(e.key==='w') keys.up=true; if(e.key==='s') keys.down=true })
window.addEventListener("keyup", e => { if(e.key==='ArrowLeft') keys.left=false; if(e.key==='ArrowRight') keys.right=false; if(e.key==='ArrowUp') keys.forward=false; if(e.key==='ArrowDown') keys.backward=false; if(e.key==='w') keys.up=false; if(e.key==='s') keys.down=false })

// =================== ESCENA ===================
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000010) // fondo negro espacial

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 5000)
camera.position.set(0, 4, 15)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// =================== LUCES ===================
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(15, 50, 50)
scene.add(dirLight)

// =================== ESTRELLAS ===================
function createStars(count, size){
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count*3)
    for(let i=0;i<count*3;i++) pos[i] = (Math.random()-0.5)*500 // reducido a 500 para que se vean
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
    const mat = new THREE.PointsMaterial({size:size,color:0xffffff})
    return new THREE.Points(geo, mat)
}
scene.add(createStars(2000,0.5))
scene.add(createStars(400,1.2))

// =================== GALAXIA ===================
const galaxyGeo = new THREE.BufferGeometry()
const galaxyCount = 800
const galaxyPositions = new Float32Array(galaxyCount*3)
const galaxyColors = []
for(let i=0;i<galaxyCount;i++){
    galaxyPositions[i*3]=(Math.random()-0.5)*400
    galaxyPositions[i*3+1]=(Math.random()-0.5)*400
    galaxyPositions[i*3+2]=(Math.random()-0.5)*400
    const c = new THREE.Color(0.5+Math.random()*0.5,0.2+Math.random()*0.4,1)
    galaxyColors.push(c.r,c.g,c.b)
}
galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions,3))
galaxyGeo.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors,3))
galaxy = new THREE.Points(galaxyGeo, new THREE.PointsMaterial({size:1, vertexColors:true, transparent:true, opacity:0.6}))
scene.add(galaxy)

// =================== ESTACIÓN ===================
stationGroup = new THREE.Group()
stationGroup.position.set(0,0,0) // centramos la estación
scene.add(stationGroup)



// holograma anillo
const holoGeometry = new THREE.TorusGeometry(16,0.1,16,100)
const holoMaterial = new THREE.MeshBasicMaterial({color:0x00ffff, transparent:true, opacity:0.7})
const holoRing = new THREE.Mesh(holoGeometry, holoMaterial)
holoRing.rotation.x = Math.PI/2
stationGroup.add(holoRing)

// luz de estación
const stationLight = new THREE.PointLight(0x66ccff, 2, 200)
stationLight.position.set(0,0,0)
stationGroup.add(stationLight)

// =================== VENTANAS ===================
const windowsGroup = new THREE.Group()
const windowMaterials = []   // guardamos los materiales
const rings = 12, windowsPerRing = 10, radius = 2.2

for(let r = 0; r < rings; r++){
    const zPos = -4 + r * 1.2
    for(let i = 0; i < windowsPerRing; i++){
        const angle = (i / windowsPerRing) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        const winGeo = new THREE.SphereGeometry(0.1, 8, 8)
        const winMat = new THREE.MeshStandardMaterial({
            color: 0x66ccff,
            emissive: 0x66ccff,
            emissiveIntensity: 1.5
        })
        
        const win = new THREE.Mesh(winGeo, winMat)
        win.position.set(x, y, zPos)
        win.lookAt(x*2, y*2, zPos)

        windowsGroup.add(win)
        windowMaterials.push(winMat)  // <-- guardamos para el pulso deluxe
    }
}

stationGroup.add(windowsGroup)

// =================== NAVE ===================
const shipGeo = new THREE.SphereGeometry(0.6,2,32)
const shipMat = new THREE.MeshStandardMaterial({color:0x66ccff,emissive:0x112244,metalness:0.6,roughness:0.3})
ship = new THREE.Mesh(shipGeo,shipMat)
ship.position.set(0,0,25)
scene.add(ship)

// =================== PARTÍCULAS ===================
const particleCount = 100
const particleGeo = new THREE.BufferGeometry()
const posArr = new Float32Array(particleCount * 3)
const particleSpeed = []
const particleBasePositions = []   // <-- guardamos posiciones base

for(let i = 0; i < particleCount; i++){
    const x = (Math.random()-0.5)*20
    const y = (Math.random()-0.5)*20
    const z = (Math.random()-0.5)*20

    posArr[i*3] = x
    posArr[i*3+1] = y
    posArr[i*3+2] = z

    particleBasePositions.push({x, y, z})

    particleSpeed.push(Math.random()*0.01 + 0.005)
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr,3))
const particleMat = new THREE.PointsMaterial({color:0x66ccff, size:0.2, transparent:true, opacity:0.7})
particles = new THREE.Points(particleGeo, particleMat)
stationGroup.add(particles)

// =================== UPDATE ===================
function update(){
  // rotación galaxia y estrellas
  scene.children.forEach(obj=>{
      if(obj instanceof THREE.Points && obj!==particles) obj.rotation.y+=0.0001
  })

  // nave
  if(ship){
      if(keys.left) velocity.x -= acceleration
      if(keys.right) velocity.x += acceleration
      if(keys.forward) velocity.z -= acceleration
      if(keys.backward) velocity.z += acceleration
      if(keys.up) velocity.y += acceleration
      if(keys.down) velocity.y -= acceleration

      velocity.multiplyScalar(damping)
      ship.position.add(velocity)
      ship.rotation.z = -velocity.x * 2
      ship.rotation.x = velocity.z * 2

      

      // cámara
      const offset = cameraOffset.clone()
      const desiredPos = ship.position.clone().add(offset)
      camera.position.lerp(desiredPos, smoothFactor)
      camera.lookAt(ship.position)
  }

  // pulso estación
  pulseTime += 0.05
  stationLight.intensity = 2 + Math.sin(pulseTime) * 1.5
  holoRing.material.opacity = 0.5 + Math.sin(pulseTime * 2) * 0.3

  // =================== PULSO ARCOÍRIS VENTANAS ===================
if(windowMaterials && windowMaterials.length > 0){
  const pulse = Math.sin(pulseTime * 3) * 0.5 + 0.5 // 0 a 1
  const hueOffset = pulseTime * 0.1                 // hace girar los colores suavemente
  windowMaterials.forEach((mat, i)=>{
      // calculamos un matiz diferente por ventana para más dinamismo
      const hue = (i / windowMaterials.length + hueOffset) % 1
      const color = new THREE.Color()
      color.setHSL(hue, 0.7, 0.5)                  // saturación 70%, luz 50%
      mat.emissive.copy(color)
      mat.emissiveIntensity = 0.5 + pulse * 2
  })
}

// =================== MOVIMIENTO SUAVE PARTÍCULAS ===================
if(particles){
  const positions = particles.geometry.attributes.position.array
  for(let i = 0; i < particleCount; i++){
      const base = particleBasePositions[i]
      const speed = particleSpeed[i]

      // movimiento oscilante suave
      positions[i*3] = base.x + Math.sin(pulseTime*speed*5 + i) * 1.5
      positions[i*3+1] = base.y + Math.cos(pulseTime*speed*3 + i) * 1.2
      positions[i*3+2] = base.z + Math.sin(pulseTime*speed*4 + i) * 1.5
  }
  particles.geometry.attributes.position.needsUpdate = true
}


}

    

// =================== RENDER & ANIMATE ===================
function render(){ renderer.render(scene,camera) }
function animate(){ requestAnimationFrame(animate); update(); render() }
animate()

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})