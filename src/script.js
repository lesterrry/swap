/*************************
Handcrafted by Aydar N.
2023

me@aydar.media
*************************/

import './style.css'

import { gsap } from 'gsap';

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

    // const scrollAnimation2 = gsap.to('section.description p:nth-of-type(2)', {
    //     color: 'white',
    //     scrollTrigger: {
    //         trigger: 'section.description',
    //         start: 'top 65%',
    //         end: 'bottom 35%',
    //         // markers: true,
    //         toggleActions: 'restart none none reverse',
    //         duration: 0.5
    //     },
    // });
});

