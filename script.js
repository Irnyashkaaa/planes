import { OBJLoader } from "./OBJLoader.js"
const width = window.innerWidth
const height = window.innerHeight

const canvas = document.getElementById('canvas')

canvas.setAttribute('width', width)
canvas.setAttribute('height', height)

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setClearColor(0xD9D2E9)


const camera = new THREE.PerspectiveCamera(45, (width) / (height), 0.1, 5000)
camera.position.set(0, 0, 400)


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-10, 20, 100);
scene.add(light)

const loader = new OBJLoader()
const earthSphereGeometry = new THREE.SphereGeometry(90, 100, 100)
const earthSphereMaterial = new THREE.MeshLambertMaterial({
    emissiveIntensity: 0.3, emissive: 0xFB5AE8, color: 0xC1B6D8
})
const earthSphereMesh = new THREE.Mesh(earthSphereGeometry, earthSphereMaterial)
earthSphereMesh.rotation.y = 4.5

let earth = new THREE.Group()

earth.add(earthSphereMesh)


let plane;
loader.load(
    './images/earth.obj',
    function (object) {
        object.children[0].material = new THREE.MeshNormalMaterial()
        earth.add(object)
        animate()
    },
)

loader.load(
    './images/plane.obj',
    function (loadPlane) {
        plane = loadPlane
        loadPlane.children.forEach(el => {
            el.material.side = THREE.DoubleSide
        })
        loadPlane.position.z = 140
        scene.add(loadPlane)

    },
)

const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3( -100, 0, 100 ),
	new THREE.Vector3( -50, 50, 50 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 50, -50, 50 ),
	new THREE.Vector3( 100, 0, 100 )
])

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material )

scene.add(curveObject)

// scene.add(earth)

let time = 0
const animate = () => {
    time++
    let perc = (time % 200) / 200
    let nextPerc = ((time * 10) % 200) / 200
    if (plane) {
        plane.rotation.z = -1.6
        let pos = curve.getPoint(perc)
        plane.position.copy(pos)
        console.log(nextPerc);
        debugger
        plane.lookAt(nextPerc, nextPerc, nextPerc)
    }
    // plane? plane.position.x +=  0.4: ''
    earth ? earth.rotation.y += 0.007 : ''
    renderer.render(scene, camera)
    requestAnimationFrame(function () { animate() })

}
