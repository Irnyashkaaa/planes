import { OBJLoader } from "./OBJLoader.js"
const width = window.innerWidth
const height = window.innerHeight

const canvas = document.getElementById('canvas')

canvas.setAttribute('width', width)
canvas.setAttribute('height', height)

const scene = new THREE.Scene()


const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setClearColor(0x000000)


const camera = new THREE.PerspectiveCamera(45, (width) / (height), 0.1, 5000)
camera.position.set(0, 0, 400)


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-10, 20, 100);
scene.add(light)

const loader = new OBJLoader()
const earthSphereGeometry = new THREE.SphereGeometry(90, 100, 100)
const earthSphereMaterial = new THREE.MeshLambertMaterial({
    emissiveIntensity: 0.3, emissive: 0xC1B6DB, visible: 0
})
const earthSphereMesh = new THREE.Mesh(earthSphereGeometry, earthSphereMaterial)
earthSphereMesh.rotation.y = 4.5
scene.add(earthSphereMesh)

let earth;

loader.load(
    './images/earth.obj',
    function (object) {
        scene.add(object)
        object.children[0].material = new THREE.MeshNormalMaterial()
        earth = object
        animate()
    }
)


const animate = () => {
    earth? earth.rotation.y += 0.007: ''
    renderer.render(scene, camera)
    requestAnimationFrame(function () { animate() })

}
