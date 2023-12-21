/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

import './style.css'

import { gsap } from 'gsap';
import * as three from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from './split_text';

gsap.registerPlugin(ScrollTrigger, SplitText);

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
    console.log(window.scrollY);
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
        let split = new SplitText(i);

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
        });
    }

    console.log(sizes);
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.position.set(6, -2, 5)
	scene.add(camera)

	const hemiLight = new three.HemisphereLight(0xFFFFFF, 0x444444, 1)
	hemiLight.position.set(200, 200, 200)
	scene.add(hemiLight)

    const loader = new FBXLoader()
	loader.load('/3d/swap.fbx', (object) => {
		object.rotation.z = 1
        object.rotation.y = 2
        object.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true
			}
		})
		swap = object
		scene.add(object)
	})

    threeTick();
});

const threeTick = () => {
	// const elapsed = clock.getElapsedTime()

	// camera.position.x = (cursor.x + 1) / 2
	// camera.position.y = (cursor.y / 2) + 9
	// camera.lookAt(new THREE.Vector3(0, 6, 0))

	renderer.render(scene, camera)

	window.requestAnimationFrame(threeTick)
}

