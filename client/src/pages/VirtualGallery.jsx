import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Info } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VirtualGallery = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      // Fetch up to 20 artworks for a smooth 3D experience
      const { data } = await api.get('/artworks?limit=20');
      const artworksArray = data.artworks ? data.artworks : data;
      setArtworks(artworksArray);
    } catch (error) {
      console.error('Error fetching artworks', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (art) => {
    if (!art.image || art.image.includes('undefined')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(art.title)}&background=111&color=fff&size=512`;
    }
    if (art.image.startsWith('http')) return art.image;
    if (art.image.startsWith('/uploads')) return `${api.defaults.baseURL.replace('/api', '')}${art.image}`;
    return art.image;
  };

  useEffect(() => {
    if (artworks.length === 0) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth;

      // Horizontal scroll tween
      const mainTween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        }
      });

      // Perspective and parallax for each artwork
      gsap.utils.toArray('.artwork-card-wrapper').forEach((wrapper) => {
        const card = wrapper.querySelector('.artwork-card-3d');
        const bgText = wrapper.querySelector('.bg-text');
        
        // 3D rotation effect
        gsap.to(card, {
          rotateY: 15,
          rotateX: 5,
          translateZ: 100,
          scrollTrigger: {
            trigger: wrapper,
            containerAnimation: mainTween, 
            start: "left right",
            end: "right left",
            scrub: true
          }
        });

        // Background text parallax
        if (bgText) {
          gsap.to(bgText, {
            x: -200,
            scrollTrigger: {
              trigger: wrapper,
              containerAnimation: mainTween,
              start: "left right",
              end: "right left",
              scrub: true
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [artworks]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="perspective-container bg-black overflow-hidden relative">
      <div className="fixed top-12 md:top-24 left-6 md:left-10 z-50 pointer-events-none drop-shadow-2xl mix-blend-difference">
        <h1 className="text-2xl md:text-4xl font-light tracking-[0.5em] text-white/40 uppercase">Virtual Museum</h1>
        <p className="text-[8px] md:text-[10px] tracking-[0.3em] text-white/60 uppercase mt-2 italic">Scroll to walk through the rooms</p>
      </div>

      <div ref={trackRef} className="gallery-track flex items-center h-full gap-[25vw] w-max" style={{ paddingLeft: 'calc(50vw - 150px)', paddingRight: 'calc(50vw - 150px)' }}>
        {artworks.map((art, artIdx) => (
          <div key={artIdx} className="artwork-card-wrapper relative flex-shrink-0 flex flex-col items-center group w-[300px]">
            
            {/* Massive Background Text */}
            <div className="bg-text absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-[0.03] z-0 whitespace-nowrap">
               <h2 className="text-[25vw] font-serif italic text-white tracking-tighter leading-none">{art.category}</h2>
            </div>

            {/* 3D Art Card */}
            <div className="relative z-10 w-full">
              <Link to={`/artwork/${art._id}`} className="artwork-card-3d block overflow-hidden rounded-sm shadow-2xl bg-[#111]">
                <img 
                  src={getImageUrl(art)} 
                  alt={art.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="spotlight"></div>
              </Link>
              
              <div className="mt-12 text-center transition-all duration-700 transform translate-z-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-10px]">
                <h3 className="text-sm tracking-[0.4em] uppercase font-bold text-white">{art.title}</h3>
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mt-3">{art.artist?.name || 'Unknown Artist'}</p>
                <div className="flex justify-center mt-6">
                    <Link to={`/artwork/${art._id}`} className="text-[9px] text-white/50 border border-white/20 px-6 py-2 hover:bg-white hover:text-black flex items-center gap-2 tracking-widest uppercase transition-all duration-300">
                        View Detail <ArrowRight size={12} />
                    </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Help */}
      <div className="fixed bottom-10 right-10 flex items-center gap-6 z-50">
          <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase tracking-widest font-bold">
            <Info size={14} />
            Use Mouse Wheel to Navigate
          </div>
          <div className="h-[1px] w-20 bg-white/10"></div>
          <Link to="/gallery" className="px-6 py-3 border border-white/10 text-white/50 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Classic View
          </Link>
      </div>
    </div>
  );
};

export default VirtualGallery;
