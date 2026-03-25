import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ArtworkCard from '../components/ArtworkCard';
import api from '../services/api';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [artistFilter, setArtistFilter] = useState('All');
  const [priceRange, setPriceRange] = useState(10000);
  const [artists, setArtists] = useState([]);
  const containerRef = useRef();
  const { search } = useLocation();

  // Extract search query from URL
  const queryParams = new URLSearchParams(search);
  const initialSearch = queryParams.get('search') || '';

  // Categories
  const categories = ['All', 'Painting', 'Sculpture', 'Photography', 'Digital', 'Mixed Media'];

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/artworks`);
        const data = res.data;
        setArtworks(data);
        
        // Extract unique artists from data
        const uniqueArtists = ['All', ...new Set(data.map(a => a.artist?.name).filter(Boolean))];
        setArtists(uniqueArtists);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filteredArtworks = artworks.filter(a => {
    const matchesCategory = category === 'All' || a.category?.toLowerCase() === category.toLowerCase();
    const matchesArtist = artistFilter === 'All' || a.artist?.name?.toLowerCase() === artistFilter.toLowerCase();
    const matchesPrice = a.price <= priceRange;
    
    // Search logic
    const searchLow = initialSearch.toLowerCase();
    const matchesSearch = !initialSearch || 
      a.title.toLowerCase().includes(searchLow) || 
      (a.artist?.name || '').toLowerCase().includes(searchLow) ||
      (a.category || '').toLowerCase().includes(searchLow);

    return matchesCategory && matchesArtist && matchesPrice && matchesSearch;
  });

  useGSAP(() => {
    gsap.fromTo('.header-reveal', {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--bg-main)] transition-colors duration-500">
      <div className="mb-16 md:mb-24 border-b border-[var(--border-main)] pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <h1 className="header-reveal text-5xl md:text-8xl font-serif text-[var(--text-main)] mb-6 tracking-tight leading-none uppercase">The Collection</h1>
            <p className="header-reveal text-[var(--text-muted)] font-light max-w-xl text-lg leading-relaxed">
              A curated selection of visionary contemporary artworks, redefining the boundaries of structure and emotion.
            </p>
          </div>
        </div>
        
        {/* Advanced Filters Bar */}
        <div className="header-reveal grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
          {/* Category Filter */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 font-semibold italic">Category</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs uppercase tracking-widest transition-colors ${
                    category === c ? 'text-[var(--text-main)] underline underline-offset-8' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Artist Filter */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 font-semibold italic">Artist</h4>
            <select 
              value={artistFilter} 
              onChange={(e) => setArtistFilter(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-widest text-[var(--text-main)] border-b border-[var(--border-main)] pb-2 focus:outline-none focus:border-[var(--text-main)] transition-colors cursor-pointer w-full max-w-[200px]"
            >
              {artists.map(a => <option key={a} value={a} className="bg-[var(--bg-surface)] text-[var(--text-main)]">{a}</option>)}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-semibold italic">Price Limit</h4>
              <span className="text-xs text-[var(--text-main)] uppercase tracking-widest font-bold">${priceRange.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-[1px] bg-[var(--text-muted)] opacity-20 appearance-none cursor-pointer accent-[var(--text-main)]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="w-12 h-12 border-t-2 border-[var(--text-main)] rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          layout 
          className="columns-1 sm:columns-2 lg:columns-3 gap-10 space-y-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork, index) => (
              <motion.div 
                key={artwork._id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="break-inside-avoid"
              >
                <ArtworkCard artwork={artwork} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {!loading && filteredArtworks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-40 text-[var(--text-muted)] font-serif text-3xl italic"
        >
          No artworks match this curatorial focus.
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;
