import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ArtworkCard = ({ artwork }) => {
  const cardRef = useRef();
  const imageRef = useRef();
  const overlayRef = useRef();

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
      <div className="relative overflow-hidden aspect-[4/5] bg-[var(--bg-surface)] mb-4 border border-[var(--border-main)]">
        <img
          ref={imageRef}
          src={artwork.image || 'https://picsum.photos/seed/defaultart/600/800'}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
        />
        <div ref={overlayRef} className="absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center backdrop-blur-sm">
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
