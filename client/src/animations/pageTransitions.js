import gsap from 'gsap';

export const pageIn = (container) => {
  return gsap.fromTo(container, {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
};

export const staggerIn = (selector) => {
  return gsap.fromTo(selector, {
    opacity: 0,
    y: 30
  }, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });
};

export const revealHeader = (selector) => {
    return gsap.fromTo(selector, {
        y: 100,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'expo.out'
    });
};
