import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import api from '../services/api';
import ArtworkCard from '../components/ArtworkCard';

const ExhibitionDetail = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  const getImageUrl = (item) => {
    if (!item.image || item.image.includes('undefined')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=111&color=fff&size=512`;
    }
    if (item.image.startsWith('http')) return item.image;
    if (item.image.startsWith('/uploads')) return `${api.defaults.baseURL.replace('/api', '')}${item.image}`;
    return item.image;
  };

  useEffect(() => {
    const fetchExhibitionData = async () => {
      try {
        setLoading(true);
        const { data: exData } = await api.get(`/exhibitions/${id}`);
        setExhibition(exData);

        // Fetch all artworks and intelligently filter based on exhibition theme
        const { data: artData } = await api.get('/artworks?limit=100');
        const artworksArray = artData.artworks ? artData.artworks : artData;
        
        let filtered = [];
        if (exData.title.toLowerCase().includes('lumina')) {
          // Lumina Collective features Elena Rostova and Marcus Vance
          filtered = artworksArray.filter(art => 
            art.category === 'Painting' || art.category === 'Digital' || art.category === 'Sculpture'
          );
        } else if (exData.title.toLowerCase().includes('urban') || exData.title.toLowerCase().includes('solitude')) {
          // Urban Solitude is photography themed
          filtered = artworksArray.filter(art => art.category === 'Photography');
        } else {
          filtered = artworksArray.slice(0, 3);
        }

        setFeaturedArtworks(filtered);
      } catch (error) {
        console.error('Failed to fetch exhibition details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitionData();
  }, [id]);

  useGSAP(() => {
    if (!loading && exhibition) {
      const tl = gsap.timeline();
      tl.fromTo('.reveal', {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, { dependencies: [exhibition, loading], scope: containerRef });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
        <div className="w-12 h-12 border-t-2 border-[var(--text-main)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-main)] text-white">
        <h2 className="text-2xl font-serif uppercase tracking-widest mb-8">Exhibition not found</h2>
        <Link to="/exhibitions" className="text-xs uppercase tracking-[0.2em] border-b border-white pb-1">Back to Exhibitions</Link>
      </div>
    );
  }

  const start = new Date(exhibition.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const end = new Date(exhibition.endDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div ref={containerRef} className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link to="/exhibitions" className="reveal inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mb-12">
        <ArrowLeft size={14} /> Back to Exhibitions
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 mb-32">
        <div className="lg:w-3/5 reveal">
          <div className="overflow-hidden border border-[var(--border-main)] bg-[var(--bg-surface)] rounded-sm">
            <img 
              src={getImageUrl(exhibition)} 
              alt={exhibition.title} 
              className="w-full h-[550px] object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>

        <div className="lg:w-2/5 flex flex-col justify-center">
          <div className="reveal flex items-center gap-3 text-[var(--text-muted)] uppercase tracking-[0.3em] text-[10px] font-bold mb-6 italic opacity-80">
            <Calendar size={14} />
            Timeline: {start} — {end}
          </div>
          
          <h1 className="reveal text-4xl md:text-6xl font-serif text-[var(--text-main)] mb-8 uppercase tracking-tighter leading-tight">
            {exhibition.title}
          </h1>
          
          <div className="reveal w-16 h-[1px] bg-[var(--text-main)] opacity-30 mb-8"></div>
          
          <p className="reveal text-[var(--text-muted)] text-lg font-light leading-relaxed mb-12 italic">
            {exhibition.description}
          </p>

          <div className="reveal p-6 border border-white/5 bg-white/[0.02] backdrop-blur-sm flex gap-4 items-start">
            <Info className="text-white/40 flex-shrink-0 mt-1" size={18} />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/80 font-bold mb-1">Curatorial Note</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                This exhibition is fully curated and staged at our physical pavilion. Selected artworks are available for acquisition, catalogued below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-main)] pt-20">
        <h2 className="reveal text-2xl font-serif text-[var(--text-main)] uppercase tracking-[0.2em] mb-16">Featured Works</h2>
        
        {featuredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredArtworks.map((art, index) => (
              <motion.div 
                key={art._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="reveal"
              >
                <ArtworkCard artwork={art} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="reveal text-[var(--text-muted)] italic">No works currently catalogued under this exhibition.</p>
        )}
      </div>
    </div>
  );
};

export default ExhibitionDetail;
