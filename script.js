import { OBJLoader } from "./OBJLoader.js"
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.144.0/three.module.js'
const width = window.innerWidth
const height = window.innerHeight

const canvas = document.getElementById('canvas')

canvas.setAttribute('width', width)
canvas.setAttribute('height', height)

const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setClearColor(0xD9D2E9)


const camera = new THREE.PerspectiveCamera(45, (width) / (height), 0.1, 5000)
camera.position.set(0, 80, 250)


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
    },
)

let plane_ar = []
let plane_shift = []
let plane_def = []


let farPlane_ar = []
let farPlane_ar_shift = []
let farPlane_ar_def = []


loader.load(
    './images/plane.obj',
    function (loadPlane) {
        plane = loadPlane
        loadPlane.children.forEach(el => {
            el.material.side = THREE.DoubleSide
        })
        loadPlane.position.z = 140

        for (let i = 0; i < 20; i++) {
            let newPlane = loadPlane.clone()
            plane_ar.push(newPlane)
            plane_shift.push(Math.random() * 0.2)
            plane_def.push(Math.random() * 30)

            scene.add(newPlane)
        }

        let plus = 0
        for (let i = 0; i < 40; i++) {
            let newPlane = loadPlane.clone()
            farPlane_ar.push(newPlane)
            farPlane_ar_shift.push(Math.random() * 0.2 + plus)
            farPlane_ar_def.push(Math.random() * 30 + plus)
            i > 20? plus = 40: plus
            scene.add(newPlane)

        }

        animate()

    },
)






const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-200, -140, 0),
    new THREE.Vector3(-190, -135, 0),
    new THREE.Vector3(-150, -130, 0),
    new THREE.Vector3(-120, -130, 0),
    new THREE.Vector3(-80, -130, 0),
    new THREE.Vector3(-40, -100, 80),
    new THREE.Vector3(0, -60, 130),
    new THREE.Vector3(15, -40, 146),
    new THREE.Vector3(10, 90, 120),
    new THREE.Vector3(-50, 120, 0),
    new THREE.Vector3(-120, 100, 0),
    new THREE.Vector3(-160, 60, 0),
    new THREE.Vector3(-120, 20, 70),
    new THREE.Vector3(-60, 20, 120),
    new THREE.Vector3(20, 40, 140),
    new THREE.Vector3(80, 60, 120),
    new THREE.Vector3(160, 60, 120),
    new THREE.Vector3(160, 0, 120),
    new THREE.Vector3(100, -80, 120),
    new THREE.Vector3(20, -120, 120),
    new THREE.Vector3(-60, -140, 120),
    new THREE.Vector3(-140, -80, 0),
    new THREE.Vector3(-100, -50, -80),
    new THREE.Vector3(-20, -40, 0),
    new THREE.Vector3(100, -20, 0),
    new THREE.Vector3(120, -40, 0),
    new THREE.Vector3(100, -80, 0),
    new THREE.Vector3(60, -120, 0),
    new THREE.Vector3(-20, -160, 0),
    new THREE.Vector3(-70, -200, 0),
    new THREE.Vector3(-140, -200, 0),
    new THREE.Vector3(-180, -200, 0),
    new THREE.Vector3(-220, -170, 0),
    new THREE.Vector3(-200, -140, 0),

])

const dotsArray = [
    new THREE.Vector3(-200, 20, 0),
    new THREE.Vector3(-190, 50, 0),
    new THREE.Vector3(-100, 0, 0)
]


for (let i = 0; i < 20; i++) {
    dotsArray.push(new THREE.Vector3(i * 80, ))
}

const farPlaneCurve = new THREE.CatmullRomCurve3(dotsArray)
const farPoints = farPlaneCurve.getPoints(50)
const any = new THREE.BufferGeometry().setFromPoints(farPoints)
const newMaterial = new THREE.LineBasicMaterial({color: 0xff0000})
const newObject = new THREE.Line(any, newMaterial)
newObject.position.x = -620

// Create the final object to add to the scene


scene.add(earth)

let time = 0
let up = new THREE.Vector3(0, 1, 0)
let tangent, radians
let axis = new THREE.Vector3()



let cameraPosition = 'center'
const animate = () => {
    time++

    if (plane_ar.length > 0 ) {
        plane_ar.forEach((plane, i) => {
            let custPerc = (plane_shift[i] + time / 1200) % 1
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

    if (farPlane_ar.length > 0) {
        let up = new THREE.Vector3(0, -1, 1)
        farPlane_ar.forEach((plane, i) => {
            let custPerc = (farPlane_ar_shift[i] + time / 2000) % 1
            let pos = farPlaneCurve.getPoint(custPerc)
            plane.position.copy(pos)
            plane.position.x -= 620
            plane.position.z += 200

            tangent = curve.getTangent(custPerc).normalize()
            axis.crossVectors(up, tangent).normalize()
            radians = Math.acos(up.dot(tangent))
            plane.quaternion.setFromAxisAngle(axis, radians)
        } )
    }



    if (cameraPosition === 'center') {

        if (camera.position.z > 450) {
            setTimeout(() => cameraPosition = 'center-left', 7000)
        } else {
            camera.position.z += 0.5
            camera.position.y -= 0.18 
        }
    } else if (cameraPosition === 'center-left') {
       
        if (Math.floor(camera.position.x ) === 90) {
            setTimeout(() => cameraPosition = 'left-center', 3000)
        } else {
            camera.position.z -=0.5
            camera.position.y += 0.18
            camera.position.x +=0.2
        }
    } else if (cameraPosition === 'left-center') {
        if (Math.floor(camera.position.x) === 1) {
            setTimeout(() => cameraPosition = 'center-center', 3000)
        } else {
            camera.position.z += 0.5
            camera.position.y -= 0.18
            camera.position.x -= 0.2
        }
    } else if (cameraPosition === 'center-center') {
        if (Math.floor(camera.position.z) === 180) {
            setTimeout(() => cameraPosition = 'center', 5000)
        } else {
            camera.position.z -= 0.5
            camera.position.y += 0.18
        }
    }

    earth ? earth.rotation.y += 0.007 : ''
    renderer.render(scene, camera)
    requestAnimationFrame(function () { animate() })

}