import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1544152773-19601fe0ee66?q=80&w=2000&auto=format&fit=crop',
    title: 'The Modern',
    subtitle: 'MUSEUM'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1549887552-cb1cb71ae0f1?q=80&w=2000&auto=format&fit=crop',
    title: 'Contemporary',
    subtitle: 'COLLECTION'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=2000&auto=format&fit=crop',
    title: 'Visionary',
    subtitle: 'EXHIBITS'
  }
];

const Home = () => {
  const containerRef = useRef();
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get('/artists');
        setFeaturedArtists(res.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      }
    };
    fetchArtists();
  }, []);

  const getImageUrl = (artist) => {
    if (!artist.image || artist.image.includes('undefined')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=111&color=fff&size=512`;
    }
    if (artist.image.startsWith('http')) return artist.image;
    if (artist.image.startsWith('/uploads')) return `${api.defaults.baseURL.replace('/api', '')}${artist.image}`;
    return artist.image;
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    // Scroll Animations for sections
    gsap.utils.toArray('.fade-up').forEach(element => {
      gsap.fromTo(element, {
        y: 80,
        opacity: 0
      }, {
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
        },
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.reveal-line').forEach(element => {
      gsap.fromTo(element, {
        scaleX: 0
      }, {
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
        },
        scaleX: 1,
        transformOrigin: 'left',
        duration: 2,
        ease: 'power4.inOut'
      });
    });

    // Parallax Effect for Featured Artist Images
    gsap.utils.toArray('.parallax-img').forEach(img => {
      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[var(--bg-main)] min-h-screen transition-colors duration-500">
      {/* Immersive Hero Slider Section */}
      <section className="relative h-[calc(100vh-80px)] overflow-hidden bg-neutral-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <motion.img 
               initial={{ scale: 1.15 }}
               animate={{ scale: 1 }}
               transition={{ duration: 10, ease: 'linear' }}
               src={slides[currentSlide].image} 
               alt={slides[currentSlide].title} 
               className="w-full h-full object-cover" 
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 pt-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-4xl md:text-6xl font-sans text-white uppercase tracking-[0.3em] mb-2 opacity-60"
            >
              Lumina Gallery
            </motion.h1>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-6xl md:text-[10rem] font-serif text-white uppercase tracking-tighter leading-none mb-12 drop-shadow-2xl">
                  {slides[currentSlide].subtitle}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 flex justify-center items-center gap-12"
          >
            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <Link to="/gallery" className="px-12 py-5 bg-white text-black text-xs uppercase tracking-[0.3em] font-bold hover:bg-gray-200 transition-all hover:tracking-[0.4em] shadow-2xl text-center">
                Explore Collection
              </Link>
              <Link to="/virtual-gallery" className="px-12 py-5 bg-transparent border border-white/20 text-white text-xs uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all hover:tracking-[0.4em] shadow-2xl text-center flex items-center justify-center gap-3">
                Virtual 3D Experience
              </Link>
            </div>
            
            <div className="hidden md:flex gap-3">
              {slides.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`w-12 h-[2px] transition-all duration-500 ${currentSlide === i ? 'bg-white w-20' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Introduction */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h3 className="fade-up text-3xl md:text-5xl font-serif text-[var(--text-main)] leading-relaxed font-light mb-10">
          "Art is not what you see, but what you make others see."
        </h3>
        <div className="reveal-line w-24 h-[1px] bg-[var(--text-main)] opacity-40 mx-auto mb-10"></div>
        <p className="fade-up text-[var(--text-muted)] text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
          Lumina Gallery curates the finest contemporary masterpieces. We provide a sanctuary for visionary artists to connect with collectors who appreciate the profound impact of modern aesthetics.
        </p>
      </section>

      {/* Featured Artists teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="flex justify-between items-end mb-16 fade-up">
          <div>
            <h2 className="text-xl font-sans text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2 text-sm italic">Featured</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[var(--text-main)] uppercase tracking-widest leading-none">Visionaries</h3>
          </div>
          <Link to="/artists" className="hidden md:inline-block text-[var(--text-main)] uppercase tracking-[0.2em] text-sm hover:text-[var(--text-muted)] transition-colors border-b border-[var(--text-main)] hover:border-[var(--text-muted)] pb-1">
            View All Artists
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredArtists.length > 0 ? featuredArtists.map((artist, i) => (
            <Link to={`/artists/${artist._id}`} key={artist._id} className="fade-up group cursor-pointer block">
               <div className="relative overflow-hidden aspect-[3/4] mb-6 rounded-sm">
                 <img src={getImageUrl(artist)} alt={artist.name} className="parallax-img absolute -top-20 -bottom-20 w-full h-[calc(100%+40px)] object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
               </div>
               <h4 className="text-[var(--text-main)] text-3xl font-serif mb-2">{artist.name}</h4>
               <p className="text-[var(--text-muted)] uppercase tracking-widest text-xs">Exhibiting Now</p>
            </Link>
          )) : (
            [1, 2, 3].map((item) => (
              <div key={item} className="fade-up group cursor-pointer">
                 <div className="relative overflow-hidden aspect-[3/4] mb-6 block bg-[var(--bg-surface)] animate-pulse rounded-sm">
                 </div>
                 <h4 className="text-[var(--text-main)] text-3xl font-serif mb-2 bg-[var(--bg-surface)] w-3/4 h-8"></h4>
                 <p className="text-[var(--text-muted)] uppercase tracking-widest text-xs bg-[var(--bg-surface)] w-1/2 h-4 mt-2"></p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
