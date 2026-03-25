import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.utils.toArray('.reveal-text').forEach(element => {
      gsap.fromTo(element, {
        y: 50,
        opacity: 0
      }, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    gsap.to('.parallax-img', {
      scrollTrigger: {
        trigger: '.parallax-container',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      ease: 'none'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 overflow-hidden transition-colors duration-500">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32">
        <h1 className="reveal-text text-5xl md:text-8xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-widest leading-none">
          Our Story
        </h1>
        <div className="w-24 h-[1px] bg-[var(--text-main)] opacity-30 mx-auto reveal-text"></div>
      </div>

      {/* Main Story Image (Parallax) */}
      <div className="parallax-container relative h-[60vh] md:h-[80vh] w-full overflow-hidden mb-32 border-y border-[var(--border-main)]">
        <img 
          src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=2000&auto=format&fit=crop" 
          alt="Gallery Interior" 
          className="parallax-img absolute top-[-50px] left-0 w-full h-[calc(100%+100px)] object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="reveal-text">
            <h2 className="text-xs uppercase tracking-[0.3em] font-sans text-[var(--text-muted)] mb-4">The Mission</h2>
            <h3 className="text-4xl text-[var(--text-main)] font-serif mb-6 leading-tight">Elevating Modern Expression.</h3>
            <p className="text-[var(--text-muted)] font-light leading-relaxed text-lg">
              Lumina was founded on a singular belief: that contemporary art possesses the unique power to challenge our perceptions and enrich the human experience. We curate works that exist at the frontier of creative expression.
            </p>
          </div>
          <div className="reveal-text">
            <h2 className="text-xs uppercase tracking-[0.3em] font-sans text-[var(--text-muted)] mb-4">The Vision</h2>
            <h3 className="text-4xl text-[var(--text-main)] font-serif mb-6 leading-tight">A Global Sanctuary for Creativity.</h3>
            <p className="text-[var(--text-muted)] font-light leading-relaxed text-lg">
              We strive to be the bridge between visionary artists and discerning collectors worldwide. By fostering a dialogue between the creator and the observer, we aim to cultivate an enduring legacy of cultural significance.
            </p>
          </div>
        </div>
      </div>

      {/* Director Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 reveal-text">
          <div className="md:w-1/3">
             <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop" alt="Director" className="w-full h-auto grayscale object-cover" />
          </div>
          <div className="md:w-2/3">
             <h4 className="text-3xl md:text-5xl text-[var(--text-main)] font-serif mb-8 leading-snug">
               "Art does not reproduce the visible; rather, it makes visible."
             </h4>
             <p className="text-[var(--text-muted)] uppercase tracking-widest text-sm">— Evelyn Vance, Gallery Director</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
