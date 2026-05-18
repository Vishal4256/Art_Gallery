import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../services/api';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        // Fallback data
        const dummyArtists = Array.from({ length: 6 }).map((_, i) => ({
          _id: `artist_${i}`,
          name: `Visionary Artist ${i + 1}`,
          bio: 'Contemporary artist working in various mediums to explore the intersection of nature and technology.',
          image: `https://picsum.photos/seed/artist${i}/600/600`
        }));

        let data = [];
        try {
          const res = await api.get('/artists');
          data = res.data;
        } catch (error) {
          data = dummyArtists;
        }

        setArtists(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
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

  useGSAP(() => {
    if (!loading && artists.length > 0) {
      gsap.fromTo('.artist-card', {
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
  }, { dependencies: [artists, loading], scope: containerRef });

  if (loading) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
          <div className="w-8 h-8 border-t-2 border-[var(--text-main)] rounded-full animate-spin"></div>
        </div>
      );
  }

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--bg-main)] transition-colors duration-500">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-8xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-tighter">Visionaries</h1>
        <div className="w-24 h-[1px] bg-[var(--text-main)] opacity-30 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {artists.map(artist => (
          <Link key={artist._id} to={`/artists/${artist._id}`} className="artist-card group cursor-pointer block">
            <div className="relative overflow-hidden aspect-[4/5] mb-8 border border-[var(--border-main)] bg-[var(--bg-surface)]">
              <img 
                src={getImageUrl(artist)} 
                alt={artist.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                 <span className="text-white uppercase tracking-widest text-xs border border-white px-8 py-3 font-medium">Explore Portfolio</span>
              </div>
            </div>
            <h2 className="text-4xl text-[var(--text-main)] font-serif mb-4 leading-none">{artist.name}</h2>
            <p className="text-[var(--text-muted)] text-sm font-light leading-relaxed line-clamp-3 italic opacity-80">{artist.bio}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Artists;
