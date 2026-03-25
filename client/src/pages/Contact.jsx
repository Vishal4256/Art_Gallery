import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Contact = () => {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.stagger-reveal', {
      y: 40,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[var(--color-dark-bg)] min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
      
      {/* Contact Information */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="stagger-reveal text-5xl md:text-7xl font-serif text-white mb-6 uppercase tracking-widest">Connect</h1>
        <div className="stagger-reveal w-16 h-[1px] bg-white/30 mb-12"></div>
        
        <p className="stagger-reveal text-gray-400 font-light leading-relaxed text-lg mb-16 max-w-md">
          We welcome inquiries regarding available works, upcoming exhibitions, and private advisory services.
        </p>

        <div className="stagger-reveal space-y-10">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-sans text-gray-500 mb-2">Visit Us</h3>
            <p className="text-white text-lg font-light">123 Art District Avenue<br />New York, NY 10001</p>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-sans text-gray-500 mb-2">Contact</h3>
            <p className="text-white text-lg font-light mb-1">vishal42564256@gmail.com</p>
            <p className="text-white text-lg font-light">8092982304</p>
          </div>
          
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-sans text-gray-500 mb-4">Social</h3>
            <div className="flex gap-6">
              <a href="#" className="text-white text-sm uppercase tracking-widest border-b border-transparent hover:border-white transition-colors pb-1">Instagram</a>
              <a href="#" className="text-white text-sm uppercase tracking-widest border-b border-transparent hover:border-white transition-colors pb-1">Artsy</a>
              <a href="#" className="text-white text-sm uppercase tracking-widest border-b border-transparent hover:border-white transition-colors pb-1">Twitter</a>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="md:w-1/2">
        <div className="stagger-reveal bg-neutral-900 border border-white/5 p-10 md:p-16 h-full flex flex-col justify-center">
          <h2 className="text-2xl text-white font-serif mb-8">Send an Inquiry</h2>
          
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            <div>
              <select className="w-full bg-transparent border-b border-white/20 pb-3 text-gray-500 focus:outline-none focus:border-white focus:text-white transition-colors appearance-none cursor-pointer">
                <option value="" disabled selected>Subject</option>
                <option value="artwork">Artwork Inquiry</option>
                <option value="exhibition">Exhibition Information</option>
                <option value="advisory">Art Advisory</option>
                <option value="other">General Comment</option>
              </select>
            </div>
            <div>
              <textarea 
                placeholder="Message" 
                rows="4"
                className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none mt-2"
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full py-4 bg-white text-black text-sm uppercase tracking-[0.2em] font-medium hover:bg-gray-200 transition-colors mt-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Contact;
