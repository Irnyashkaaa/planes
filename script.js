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
camera.position.set(0, 0, 800)


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

let plane_ar = []
let plane_shift = []
let plane_def = []


loader.load(
    './images/plane.obj',
    function (loadPlane) {
        plane = loadPlane
        loadPlane.children.forEach(el => {
            el.material.side = THREE.DoubleSide
        })
        loadPlane.position.z = 140

        for (let i = 0; i < 10; i++) {
            let newPlane = loadPlane.clone()
            plane_ar.push(newPlane)
            plane_shift.push(Math.random() * 0.6)
            plane_def.push(Math.random() * 20)

            scene.add(newPlane)
        }

    },
)

const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3( -200, 0, 200 ),
	new THREE.Vector3( -100, 100, 100 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 100, -100, 100 ),
	new THREE.Vector3( 200, 0, 200 )
])

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material )

scene.add(curveObject)

// scene.add(earth)

let time = 0
let up = new THREE.Vector3(0, 1, 0)
let tangent, radians
let axis = new THREE.Vector3()




const animate = () => {
    time++
    let perc = (time % 200) / 200

    if (plane_ar.length > 0) {
        plane_ar.forEach((plane, i) => {
            let custPerc = (plane_shift[i] + perc) % 1
            let pos = curve.getPoint(custPerc)
            plane.position.copy(pos.add(new THREE.Vector3(
                plane_def[i], plane_def[i], plane_def[i]
            )))

            tangent = curve.getTangent(custPerc).normalize()
            axis.crossVectors(up, tangent).normalize()
            radians = Math.acos(up.dot(tangent))
            plane.quaternion.setFromAxisAngle(axis, radians)
        })
    }

    earth ? earth.rotation.y += 0.007 : ''
    renderer.render(scene, camera)
    requestAnimationFrame(function () { animate() })

}
