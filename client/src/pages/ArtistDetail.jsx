import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import { Instagram, Globe, Twitter, ArrowLeft } from 'lucide-react';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        const artistRes = await api.get(`/artists/${id}`);
        setArtist(artistRes.data);

        // Fetch artworks by this artist
        const artworksRes = await api.get('/artworks');
        const artistArtworks = artworksRes.data.filter(art => 
          art.artist?._id === id || art.artist === id
        );
        setArtworks(artistArtworks);
      } catch (error) {
        console.error('Failed to fetch artist details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  const getImageUrl = (artist) => {
    if (!artist.image || artist.image.includes('undefined')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=111&color=fff&size=512`;
    }
    if (artist.image.startsWith('http')) return artist.image;
    if (artist.image.startsWith('/uploads')) return `${api.defaults.baseURL.replace('/api', '')}${artist.image}`;
    return artist.image;
  };

  useGSAP(() => {
    if (!loading && artist) {
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
  }, { dependencies: [artist, loading], scope: containerRef });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
        <div className="w-12 h-12 border-t-2 border-[var(--text-main)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[var(--bg-main)] text-white">
        <h2 className="text-2xl font-serif uppercase tracking-widest mb-8">Artist not found</h2>
        <Link to="/artists" className="text-xs uppercase tracking-[0.2em] border-b border-white pb-1">Back to Artists</Link>
      </div>
    );
  }

  const backendUrl = api.defaults.baseURL.replace('/api', '');

  return (
    <div ref={containerRef} className="bg-[var(--bg-main)] min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link to="/artists" className="reveal inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mb-12">
        <ArrowLeft size={14} /> Back to Artists
      </Link>

      <div className="flex flex-col md:flex-row gap-16 mb-32">
        <div className="md:w-1/2 reveal">
          <div className="aspect-[4/5] overflow-hidden border border-[var(--border-main)] grayscale hover:grayscale-0 transition-all duration-1000">
            <img 
              src={getImageUrl(artist)} 
              alt={artist.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="reveal text-5xl md:text-8xl font-serif text-[var(--text-main)] mb-8 uppercase tracking-tighter leading-none">
            {artist.name}
          </h1>
          
          <div className="reveal w-16 h-[1px] bg-[var(--text-main)] opacity-30 mb-8"></div>
          
          <p className="reveal text-[var(--text-muted)] text-lg font-light leading-relaxed mb-12 italic">
            {artist.bio}
          </p>

          <div className="reveal flex gap-8">
            {artist.socialLinks?.instagram && (
              <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <Instagram size={20} />
              </a>
            )}
            {artist.socialLinks?.twitter && (
              <a href={artist.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <Twitter size={20} />
              </a>
            )}
            {artist.socialLinks?.website && (
              <a href={artist.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <Globe size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-main)] pt-20">
        <h2 className="reveal text-2xl font-serif text-[var(--text-main)] uppercase tracking-[0.2em] mb-16">Selected Works</h2>
        
        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {artworks.map((art, index) => (
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
          <p className="reveal text-[var(--text-muted)] italic">No works currently on display.</p>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
