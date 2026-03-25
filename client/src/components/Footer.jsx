import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-surface)] pt-24 pb-12 border-t border-[var(--border-main)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <Link to="/" className="text-4xl tracking-[0.2em] font-serif text-[var(--text-main)] uppercase inline-block mb-8 leading-none">
              Lumina
            </Link>
            <p className="text-[var(--text-muted)] text-sm font-light max-w-sm leading-relaxed italic opacity-80">
              Experience the world's most captivating contemporary and modern art. We represent visionary artists shaping the future of expression.
            </p>
          </div>
          
          <div>
            <h4 className="text-[var(--text-main)] uppercase tracking-[0.4em] text-[10px] font-bold mb-8 italic opacity-60">Curatorial</h4>
            <ul className="space-y-4 text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest">
              <li><Link to="/gallery" className="hover:text-[var(--text-main)] transition-colors">The Collection</Link></li>
              <li><Link to="/artists" className="hover:text-[var(--text-main)] transition-colors">Visionaries</Link></li>
              <li><Link to="/exhibitions" className="hover:text-[var(--text-main)] transition-colors">Current Exhibits</Link></li>
              <li><Link to="/about" className="hover:text-[var(--text-main)] transition-colors">Our Ethos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[var(--text-main)] uppercase tracking-[0.4em] text-[10px] font-bold mb-8 italic opacity-60">Engagement</h4>
            <ul className="space-y-4 text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest">
              <li>Inquiries: vishal42564256@gmail.com</li>
              <li>Concierge: 8092982304</li>
              <li>Visit: 123 Art District<br />New York, NY 10001</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-main)] pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] opacity-40">
          <p>&copy; {new Date().getFullYear()} Lumina Gallery. Built for the Infinite.</p>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <Link to="/privacy" className="hover:text-[var(--text-main)] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[var(--text-main)] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
