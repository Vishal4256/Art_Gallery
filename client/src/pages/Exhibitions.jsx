import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../services/api';

const Exhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setLoading(true);
        // Fallback data
        const dummyExhibitions = Array.from({ length: 3 }).map((_, i) => ({
          _id: `ex_${i}`,
          title: `Lumina Collective V.${i + 1}`,
          description: 'A curated selection of modern works exploring the synthesis of classical techniques and digital avant-garde.',
          startDate: new Date(Date.now() + i * 86400000 * 30).toISOString(),
          endDate: new Date(Date.now() + (i + 1) * 86400000 * 30).toISOString(),
          image: `https://picsum.photos/seed/exh${i}/1200/600`
        }));

        let data = [];
        try {
          const res = await api.get('/exhibitions');
          data = res.data;
        } catch (error) {
          data = dummyExhibitions;
        }

        setExhibitions(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  useGSAP(() => {
    if (!loading && exhibitions.length > 0) {
      gsap.fromTo('.exhibition-card', {
        y: 40,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }, { dependencies: [exhibitions, loading], scope: containerRef });

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
        <h1 className="text-5xl md:text-8xl font-serif text-[var(--text-main)] mb-6 uppercase tracking-tighter leading-none">Exhibitions</h1>
        <div className="w-24 h-[1px] bg-[var(--text-main)] opacity-30 mx-auto"></div>
      </div>

      <div className="space-y-32">
        {exhibitions.map((ex, index) => {
          const start = new Date(ex.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
          const end = new Date(ex.endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
          
          return (
            <div key={ex._id} className={`exhibition-card flex flex-col md:flex-row gap-12 lg:gap-20 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-3/5 overflow-hidden border border-[var(--border-main)] bg-[var(--bg-surface)]">
                <img 
                  src={ex.image} 
                  alt={ex.title} 
                  className="w-full h-[500px] object-cover transition-transform duration-1000 hover:scale-105" 
                />
              </div>
              <div className="md:w-2/5 flex flex-col justify-center">
                <div className="mb-6 text-[var(--text-muted)] uppercase tracking-[0.4em] text-[10px] font-bold italic opacity-60">
                  Timeline: {start} — {end}
                </div>
                <h2 className="text-5xl lg:text-6xl text-[var(--text-main)] font-serif mb-8 leading-tight tracking-tight uppercase">{ex.title}</h2>
                <p className="text-[var(--text-muted)] font-light leading-relaxed mb-10 text-lg">{ex.description}</p>
                <button className="self-start text-[10px] uppercase tracking-[0.3em] text-[var(--text-main)] border-b border-[var(--text-main)] hover:opacity-60 transition-all pb-2 font-bold italic">
                  Explore Exhibition Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Exhibitions;
