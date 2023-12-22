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
const logo = document.querySelector('.logo')
const canvas = document.querySelector('.logo canvas')
const gallery = document.querySelector('.smells div')

let swap
const sizes = {
	width: logo.clientWidth,
	height: 3200
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
    
    adjustScroll()
})

window.addEventListener('resize', () => {
	sizes.width = logo.clientWidth
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('load', () => {
    for (const i of paragraphs) {
        let split = new SplitText(i)

        gsap.to(split.chars, {
            color: 'white',
            scrollTrigger: {
                trigger: i,
                start: 'top 60%',
                end: 'bottom 0%',
                // markers: true,
                toggleActions: 'restart none none reverse',
            },
            duration: 0.05,
            stagger: 0.02
        })
    }

    gsap.to('li', {
        opacity: 1,
        scrollTrigger: {
            trigger: 'ul',
            start: 'top 60%',
            end: 'bottom 0%',
            // markers: true,
            toggleActions: 'restart none none reverse',
        },
        duration: 0.1,
        stagger: 0.25
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.position.set(7, -13.5, 22)
	scene.add(camera)

	const hemiLight = new three.HemisphereLight(0xFFFFFF, 0x444444, 1)
	hemiLight.position.set(200, 200, 200)
	scene.add(hemiLight)

    const loader = new FBXLoader()
	loader.load('/3d/swap6.fbx', (object) => {
        object.rotation.y = 1.4
		object.rotation.z = 1

        object.scale.z = 0.9

        object.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = true
				child.receiveShadow = true
			}
		})
		swap = object
		scene.add(object)
	})

    threeTick()
})

const adjustScroll = () => {
    const v = window.scrollY
    const max = 2300

    swap.position.x = mapValue(v, 0, max, 0, 3)
    swap.position.y = mapValue(v, 400, max, 0, -37)
    swap.position.z = mapValue(v, 1000, max, 0, -10)

    swap.rotation.x = mapValue(v, 0, max, 0, 4.71) * multiplier.x
    swap.rotation.y = mapValue(v, 0, max, 1.4, 0.3) * multiplier.y
    swap.rotation.z = mapValue(v, 0, max, 1, 2.59) * multiplier.z

    const g = mapValue(v, 3200, 4400, 0, -350)
    gallery.style['margin-left'] = `${g}px`

    2816 -200
}

const mapValue = (value, l, r, min, max) => {
    if (value <= l) return min
    if (value >= r) return max
    const normalizedValue = (value - l) / (r - l)
    const mappedValue = min + (max - min) * normalizedValue
    return mappedValue
  }

const threeTick = () => {
	renderer.render(scene, camera)

	window.requestAnimationFrame(threeTick)
}
