import * as THREE from 'three'

import perlinNoise from './perlin-noise.fs'
import fragmentShader from './fragment-shader.fs'

const rangeR: HTMLInputElement = document.getElementById('range_r') as HTMLInputElement
const rangeG: HTMLInputElement = document.getElementById('range_g') as HTMLInputElement
const rangeB: HTMLInputElement = document.getElementById('range_b') as HTMLInputElement

const container: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement

const camera: THREE.Camera = new THREE.Camera()
camera.position.z = 1

const scene: THREE.Scene = new THREE.Scene()
const geometry = new THREE.PlaneBufferGeometry(2, 2)
const uniforms = {
  u_time: { type: 'f', value: 100.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2() },
  u_mouse: { type: 'v2', value: new THREE.Vector2() },
  c_mouse: { type: 'v2', value: new THREE.Vector2() },
  u_rgbOffset: { type: 'v3', value: new THREE.Vector3(0.2, 0.1, 0.0) }
}

const material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  fragmentShader: [
    perlinNoise,
    fragmentShader
  ].join('\n')
})

const mesh: THREE.Mesh = new THREE.Mesh(geometry, material)

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: container
})

let mouseY: number = 0
let mouseX: number = 0

renderer.setSize(renderer.domElement.width, renderer.domElement.height)

window.addEventListener('resize', setSize, false)

document.addEventListener('mousemove', (event: MouseEvent): void => {
  mouseX = event.pageX
  mouseY = event.pageY
}, false)

scene.add(mesh)
setSize()
animate()

rangeR.addEventListener('change', (event: Event): void => {
  console.log((event.target as HTMLInputElement).value)
  uniforms.u_rgbOffset.value.x = +(event.target as HTMLInputElement).value
}, false)
rangeG.addEventListener('change', (event: Event): void => {
  console.log((event.target as HTMLInputElement).value)
  uniforms.u_rgbOffset.value.y = +(event.target as HTMLInputElement).value
}, false)
rangeB.addEventListener('change', (event: Event): void => {
  console.log((event.target as HTMLInputElement).value)
  uniforms.u_rgbOffset.value.z = +(event.target as HTMLInputElement).value
}, false)

function setSize (): void {
  container.width = window.innerWidth
  container.height = window.innerHeight
  renderer.setSize(renderer.domElement.width, renderer.domElement.height)
  uniforms.u_resolution.value.x = renderer.domElement.width
  uniforms.u_resolution.value.y = renderer.domElement.height
}

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
