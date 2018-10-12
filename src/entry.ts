import * as THREE from 'three'

import vertexShader from './vertex-shader.vs'
import perlinNoise from './perlin-noise.fs'
import fragmentShader from './fragment-shader.fs'

const container: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
container.width = window.innerWidth
container.height = window.innerHeight

const camera: THREE.Camera = new THREE.Camera()
camera.position.z = 1

const scene: THREE.Scene = new THREE.Scene()
const geometry = new THREE.PlaneBufferGeometry(2, 2)
const uniforms = {
  u_time: { type: 'f', value: 100.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2() },
  u_mouse: { type: 'v2', value: new THREE.Vector2() },
  c_mouse: { type: 'v2', value: new THREE.Vector2() }
}

const material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: perlinNoise + fragmentShader
})

const mesh: THREE.Mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: container
})

let mouseY: number = 0
let mouseX: number = 0

renderer.setSize(renderer.domElement.width, renderer.domElement.height)
uniforms.u_resolution.value.x = renderer.domElement.width
uniforms.u_resolution.value.y = renderer.domElement.height

window.addEventListener('resize', () => {
  container.width = window.innerWidth
  container.height = window.innerHeight
  renderer.setSize(renderer.domElement.width, renderer.domElement.height)
  uniforms.u_resolution.value.x = renderer.domElement.width
  uniforms.u_resolution.value.y = renderer.domElement.height
}, false)

document.addEventListener('mousemove', (event: MouseEvent): void => {
  mouseX = event.pageX
  mouseY = event.pageY
}, false)

animate()

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
  uniforms.u_time.value += 0.005
  uniforms.u_mouse.value.x += (mouseX - uniforms.u_mouse.value.x) / 30
  uniforms.u_mouse.value.y += (mouseY - uniforms.u_mouse.value.y) / 30
  renderer.render(scene, camera)
}
