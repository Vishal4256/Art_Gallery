import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ArtworkCard = ({ artwork }) => {
  const { user, fetchFreshData } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (user && user.wishlist) {
      setIsWishlisted(user.wishlist.includes(artwork._id));
    } else {
      setIsWishlisted(false);
    }
  }, [user, artwork._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to wishlist artworks');
    
    try {
      setWishlistLoading(true);
      await api.post('/users/wishlist', { artworkId: artwork._id });
      // Refresh global user state to sync wishlist everywhere
      await fetchFreshData();
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    } finally {
      setWishlistLoading(false);
    }
  };
  const cardRef = useRef();
  const imageRef = useRef();
  const overlayRef = useRef();

  const getImageUrl = (art) => {
    if (!art.image || art.image.includes('undefined')) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(art.title)}&background=111&color=fff&size=512`;
    }
    if (art.image.startsWith('http')) return art.image;
    if (art.image.startsWith('/uploads')) return `${api.defaults.baseURL.replace('/api', '')}${art.image}`;
    return art.image;
  };

  useGSAP(() => {
    const card = cardRef.current;
    
    // Hover animation
    const tl = gsap.timeline({ paused: true });
    
    tl.to(imageRef.current, { scale: 1.05, duration: 0.6, ease: 'power2.out' })
      .to(overlayRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.6');

    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => tl.reverse());

    return () => {
      card.removeEventListener('mouseenter', () => tl.play());
      card.removeEventListener('mouseleave', () => tl.reverse());
    };
  }, { scope: cardRef });

  return (
    <Link to={`/artwork/${artwork._id}`} ref={cardRef} className="block group cursor-pointer">
      <div className="relative overflow-hidden aspect-[4/5] bg-[var(--bg-surface)] mb-4 border border-[var(--border-main)] flex items-center justify-center">
        <img
          ref={imageRef}
          src={getImageUrl(artwork)}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
          
          {/* Wishlist Toggle */}
          <button 
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isWishlisted ? 'bg-red-500/20 text-red-500' : 'bg-black/20 text-white opacity-0 group-hover:opacity-100'
            }`}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isWishlisted ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm" >
            <span className="text-white uppercase tracking-widest text-sm border border-white px-6 py-2">
              View Detail
            </span>
          </div>
        {artwork.status === 'sold' && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs uppercase tracking-widest font-bold">
            Sold
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-serif text-[var(--text-main)] mb-2 group-hover:opacity-70 transition-opacity">{artwork.title}</h3>
        <p className="text-[var(--text-muted)] text-sm mb-2 italic">{artwork.artist?.name || 'Unknown Artist'}</p>
        <p className="text-[var(--text-main)] font-medium tracking-widest text-sm opacity-80">${artwork.price?.toLocaleString()}</p>
      </div>
    </Link>
  );
};

export default ArtworkCard;
