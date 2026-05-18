import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../services/api';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  
  const containerRef = useRef();
  
  // Dummy fallback
  const fallbackArtwork = {
    _id: id,
    title: 'Ethereal Abstraction',
    description: 'A masterpiece of contemporary art exploring the boundaries between light and shadow. The artist uses a combination of traditional techniques and modern materials to create a compelling visual narrative that challenges the viewer\'s perception of reality. This piece commands the space it occupies, insisting on a dialogue with the observer.',
    artist: { _id: 'artist_1', name: 'Elena Rostova', bio: 'Born in 1985, Elena Rostova has quickly become one of the most sought-after contemporary artists of her generation, renowned for her evocative large-scale works.' },
    price: 3500,
    image: 'https://picsum.photos/seed/detail/1200/1600', // taller image for scrolling
    category: 'Painting',
    status: 'available',
    creationYear: 2024,
    dimensions: '120 x 180 cm',
    medium: 'Oil on Canvas'
  };

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/artworks/${id}`);
        setArtwork(res.data);
      } catch (error) {
        console.log("API not ready, using fallback data");
        setArtwork(fallbackArtwork);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  const getImageUrl = (art) => {
    if (!art.image || art.image.includes('undefined')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(art.title)}&background=111&color=fff&size=512`;
    }
    if (art.image.startsWith('http')) return art.image;
    if (art.image.startsWith('/uploads')) return `${api.defaults.baseURL.replace('/api', '')}${art.image}`;
    return art.image;
  };

  useGSAP(() => {
    if (!loading && artwork) {
      const tl = gsap.timeline();
      tl.fromTo('.detail-text', {
        y: 40,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, { dependencies: [artwork, loading], scope: containerRef });

  const handleReserve = async () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    try {
      setReserving(true);
      await api.post('/reservations', { artworkId: id });
      alert('Reservation successful!');
      setArtwork({ ...artwork, status: 'reserved' });
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        const msg = error.response?.data?.message || 'The museum server encountered an issue. Please try again later.';
        alert(msg);
      }
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
        <div className="w-12 h-12 border-t-2 border-[var(--text-main)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artwork) return <div className="text-center min-h-screen flex items-center justify-center text-[var(--text-main)] text-2xl font-serif uppercase tracking-widest">Artwork not found.</div>;

  return (
    <div ref={containerRef} className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto transition-colors duration-500">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* Scrollable Image Container (Left side) */}
        <div className="md:w-[55%] lg:w-[60%]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-main)] group"
          >
            <img 
              src={getImageUrl(artwork)} 
              alt={artwork.title} 
              className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          </motion.div>
        </div>

        {/* Sticky Detail Content (Right side) */}
        <div className="md:w-[45%] lg:w-[40%] relative">
          <div className="md:sticky md:top-32 flex flex-col justify-start">
            
            <div className="detail-text mb-6 flex items-center gap-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] border border-[var(--border-main)] px-3 py-1 italic font-semibold">
                {artwork.category}
              </span>
              <span className="text-sm font-sans text-[var(--text-muted)] opacity-60">
                {artwork.creationYear || new Date().getFullYear()}
              </span>
            </div>
            
            <h1 className="detail-text text-5xl lg:text-8xl font-serif text-[var(--text-main)] mb-6 leading-[0.9] tracking-tighter uppercase">
              {artwork.title}
            </h1>
            
            <Link to={`/artists/${artwork.artist?._id}`} className="detail-text block group w-fit mb-12">
              <p className="text-xl uppercase tracking-[0.3em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-main)] border-b border-transparent group-hover:border-[var(--text-main)] pb-1 italic font-light">
                {artwork.artist?.name || 'Unknown Artist'}
              </p>
            </Link>
            
            <div className="detail-text grid grid-cols-2 gap-y-8 gap-x-12 mb-12 border-y border-[var(--border-main)] py-10">
               <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2 font-bold italic opacity-60">Medium</h4>
                  <p className="text-[var(--text-main)] text-sm font-medium uppercase tracking-widest">{artwork.medium || 'N/A'}</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2 font-bold italic opacity-60">Dimensions</h4>
                  <p className="text-[var(--text-main)] text-sm font-medium uppercase tracking-widest">{artwork.dimensions || 'N/A'}</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2 font-bold italic opacity-60">Status</h4>
                  <p className="text-[var(--text-main)] text-sm capitalize font-bold tracking-widest">{artwork.status}</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2 font-bold italic opacity-60">Investment</h4>
                  <p className="text-[var(--text-main)] text-3xl font-serif leading-none">
                    ${artwork.price?.toLocaleString()}
                  </p>
               </div>
            </div>

            <div className="detail-text mb-12">
              <p className="text-[var(--text-muted)] font-light leading-relaxed text-lg">
                {artwork.description}
              </p>
            </div>

            <div className="detail-text mt-auto">
              <button 
                onClick={handleReserve}
                disabled={artwork.status !== 'available' || reserving}
                className={`w-full py-6 text-xs uppercase tracking-[0.4em] font-bold transition-all duration-300 ${
                  artwork.status === 'available' 
                    ? 'bg-[var(--text-main)] text-[var(--bg-main)] hover:opacity-90 cursor-pointer shadow-xl' 
                    : 'bg-neutral-800 text-gray-600 cursor-not-allowed border border-neutral-700'
                }`}
              >
                {reserving ? 'Processing...' : artwork.status === 'available' ? 'Acquire Piece' : 'Unavailable'}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArtworkDetail;
