import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ArtworkCard from '../components/ArtworkCard';
import api from '../services/api';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [category, setCategory] = useState('All');
  const [artistFilter, setArtistFilter] = useState('All');
  const [priceRange, setPriceRange] = useState(50000);
  const [artists, setArtists] = useState([]);
  
  const containerRef = useRef();
  const navigate = useNavigate();
  const { search } = useLocation();

  // Extract search query from URL
  const queryParams = new URLSearchParams(search);
  const initialSearch = queryParams.get('search') || '';
  const [keyword, setKeyword] = useState(initialSearch);

  // Categories
  const categories = ['All', 'Painting', 'Sculpture', 'Photography', 'Digital', 'Mixed Media'];

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (keyword) params.set('search', keyword);
      else params.delete('search');
      navigate(`/gallery?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, navigate]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get('/artists');
        setArtists(['All', ...res.data.map(a => a.name)]);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const searchQuery = new URLSearchParams(search).get('search') || '';
        
        let url = `/artworks?page=${page}&limit=12`;
        if (searchQuery) url += `&keyword=${searchQuery}`;
        if (category !== 'All') url += `&category=${category}`;
        if (artistFilter !== 'All') url += `&artist=${artistFilter}`;
        if (priceRange < 50000) url += `&maxPrice=${priceRange}`;

        const res = await api.get(url);
        
        // Handle if backend returns new paginated format or old array format
        if (res.data.artworks) {
          setArtworks(res.data.artworks);
          setPages(res.data.pages);
          setTotal(res.data.total);
        } else {
          setArtworks(res.data);
          setPages(1);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [search, category, artistFilter, priceRange, page]);

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
          
          <div className="header-reveal w-full md:w-80">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="SEARCH COLLECTION..." 
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1); // Reset to page 1 on new search
                }}
                className="w-full bg-transparent border-b border-[var(--border-main)] py-3 px-1 text-xs uppercase tracking-widest text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)] transition-all placeholder:text-[var(--text-muted)] placeholder:opacity-50"
              />
              <div className="absolute right-2 top-3 opacity-30 group-focus-within:opacity-100 transition-opacity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
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
                  onClick={() => { setCategory(c); setPage(1); }}
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
              onChange={(e) => { setArtistFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-xs uppercase tracking-widest text-[var(--text-main)] border-b border-[var(--border-main)] pb-2 focus:outline-none focus:border-[var(--text-main)] transition-colors cursor-pointer w-full max-w-[200px]"
            >
              {artists.map(a => <option key={a} value={a} className="bg-[var(--bg-surface)] text-[var(--text-main)]">{a}</option>)}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-semibold italic">Max Price</h4>
              <span className="text-xs text-[var(--text-main)] uppercase tracking-widest font-bold">
                {priceRange >= 50000 ? 'Any' : `$${priceRange.toLocaleString()}`}
              </span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000"
              value={priceRange}
              onChange={(e) => { setPriceRange(parseInt(e.target.value)); setPage(1); }}
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
        <>
          <motion.div 
            layout 
            className="columns-1 sm:columns-2 lg:columns-3 gap-10 space-y-10"
          >
            <AnimatePresence mode="popLayout">
              {artworks.map((artwork, index) => (
                <motion.div 
                  key={artwork._id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: (index % 12) * 0.05, // limit delay staggering
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="break-inside-avoid"
                >
                  <ArtworkCard artwork={artwork} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex justify-center mt-20 gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-2 border border-[var(--border-main)] text-[var(--text-main)] text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-4 text-xs font-serif text-[var(--text-main)]">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPage(p)}
                    className={`${page === p ? 'font-bold underline underline-offset-4' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-6 py-2 border border-[var(--border-main)] text-[var(--text-main)] text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {!loading && artworks.length === 0 && (
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
