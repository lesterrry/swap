/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

import './style.css'

import { gsap } from 'gsap'
import * as three from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from './split_text'

gsap.registerPlugin(ScrollTrigger, SplitText)

const paragraphs = [
    'section.description p:nth-of-type(1)',
    'section.description p:nth-of-type(2)',
    'section.description p:nth-of-type(3)',
    'section.smells p:nth-of-type(1)',
    'section.faq p:nth-of-type(1)',
    'section.buy p:nth-of-type(1)',
    'section.subscribe p:nth-of-type(1)',
]

let swap
const canvas = document.querySelector('.logo canvas')
const sizes = {
	width: canvas.clientWidth,
	height: 3100
}
let cursor = {
	x: 0,
	y: 0
}
let multiplier = {
    x: 1,
    y: 1,
    z: 1
}

const clock = new three.Clock()
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const scene = new three.Scene()
const renderer = new three.WebGLRenderer({
	canvas: canvas,
	antialias: true,
	alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

window.addEventListener('scroll', () => {
    adjustScroll()
})

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5
	cursor.y = - (event.clientY / sizes.height - 0.5)

    multiplier = { 
        x: 1,
        y: 1 + (cursor.x * 0.05), 
        z: 1 + (cursor.y * -0.2), 
    }

    console.log(multiplier)
    
    adjustScroll()
})

window.addEventListener('resize', () => {
	sizes.width = canvas.clientWidth
	// sizes.height = canvas.clientHeight
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('load', () => {
    for (const i of paragraphs) {
        let split = new SplitText(i)

        const scrollAnimation = gsap.to(split.words, {
            color: 'white',
            scrollTrigger: {
                trigger: i,
                start: 'top 60%',
                end: 'bottom 0%',
                // markers: true,
                toggleActions: 'restart none none reverse',
            },
            duration: 0.1,
            stagger: 0.1
        })
    }

    console.log(sizes)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.position.set(7, -14, 22)
	scene.add(camera)

	const hemiLight = new three.HemisphereLight(0xFFFFFF, 0x444444, 1)
	hemiLight.position.set(200, 200, 200)
	scene.add(hemiLight)

    const loader = new FBXLoader()
	loader.load('/3d/swap.fbx', (object) => {
        object.rotation.y = 1.4
		object.rotation.z = 1

        object.scale.z = 0.9

        // object.position.x = 2.3
        // object.position.y = -42
        // object.position.z = -17

        // object.rotation.x = 4.71
        // object.rotation.y = 0.3
        // object.rotation.z = 2.59


        object.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true
			}
		})
		swap = object
        init()
		scene.add(object)
	})

    threeTick()
})

const adjustScroll = () => {
    const v = window.scrollY
    const max = 2150

    swap.position.x = mapValue(v, 0, max, 0, 3)
    swap.position.y = mapValue(v, 400, max, 0, -42)
    swap.position.z = mapValue(v, 1000, max, 0, -17)

    swap.rotation.x = mapValue(v, 0, max, 0, 4.71) * multiplier.x
    swap.rotation.y = mapValue(v, 0, max, 1.4, 0.3) * multiplier.y
    swap.rotation.z = mapValue(v, 0, max, 1, 2.59) * multiplier.z
}

const mapValue = (value, l, r, min, max) => {
    if (value <= l) return min
    if (value >= r) return max
    const normalizedValue = (value - l) / (r - l)
    const mappedValue = min + (max - min) * normalizedValue
    return mappedValue
  }

const threeTick = () => {
	// const elapsed = clock.getElapsedTime()

	// camera.position.x = (cursor.x + 1) / 2
	// camera.position.y = (cursor.y / 2) + 9
	// camera.lookAt(new THREE.Vector3(0, 6, 0))

	renderer.render(scene, camera)

	window.requestAnimationFrame(threeTick)
}











const init = () => {

const positionXControl = document.getElementById("position-x");
positionXControl.value = swap.position.x;
positionXControl.addEventListener("input", (e) => {
  swap.position.x = parseFloat(e.target.value);
  console.log(e.target.value);
});

const positionYControl = document.getElementById("position-y");
positionYControl.value = swap.position.y;
positionYControl.addEventListener("input", (e) => {
  swap.position.y = parseFloat(e.target.value);
});

const positionZControl = document.getElementById("position-z");
positionZControl.value = swap.position.z;
positionZControl.addEventListener("input", (e) => {
  swap.position.z = parseFloat(e.target.value);
});

const rotationXControl = document.getElementById("rotation-x");
rotationXControl.value = swap.rotation.x;
rotationXControl.addEventListener("input", (e) => {
  swap.rotation.x = parseFloat(e.target.value);
});

const rotationYControl = document.getElementById("rotation-y");
rotationYControl.value = swap.rotation.y;
rotationYControl.addEventListener("input", (e) => {
  swap.rotation.y = parseFloat(e.target.value);
});

const rotationZControl = document.getElementById("rotation-z");
rotationZControl.value = swap.rotation.z;
rotationZControl.addEventListener("input", (e) => {
  swap.rotation.z = parseFloat(e.target.value);
  console.log(swap.rotation, swap.position)
});




}