import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Ensure mobile menu closes on route change
    setIsOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/gallery?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Artists', path: '/artists' },
    { name: 'Exhibitions', path: '/exhibitions' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--bg-main)]/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl tracking-[0.2em] font-serif text-[var(--text-main)] uppercase transition-colors">
              Lumina
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-10 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 font-bold ${
                    location.pathname === link.path ? 'text-[var(--text-main)] underline underline-offset-8' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-4 w-[1px] bg-[var(--text-main)] opacity-10 mx-2"></div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <button 
                onClick={toggleTheme}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </button>

              <Link to="/login" className={`px-8 py-3 bg-[var(--text-main)] text-[var(--bg-main)] text-[10px] uppercase tracking-[0.2em] transition-all duration-300 rounded-full font-bold hover:opacity-80 shadow-md`}>
                Login
              </Link>
            </div>

            {/* Mobile Menu Button + Theme/Search */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[var(--text-muted)]"
              >
                <Search size={18} />
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 text-[var(--text-muted)]"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="text-[var(--text-main)] hover:opacity-70 transition focus:outline-none">
                {isOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute w-full bg-[var(--bg-main)] border-b border-[var(--border-main)] overflow-hidden"
            >
              <div className="flex flex-col space-y-6 px-6 py-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-3xl uppercase tracking-[0.3em] font-serif text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="inline-block mt-4 w-full text-center py-5 bg-[var(--text-main)] text-[var(--bg-main)] text-xs uppercase tracking-widest transition-all duration-300 rounded-full font-bold"
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-3xl"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-10 right-10 text-white hover:text-gray-400 transition-colors"
            >
              <X size={40} strokeWidth={1} />
            </button>
            
            <div className="w-full max-w-4xl">
              <p className="text-xs uppercase tracking-[0.5em] text-gray-400 mb-8 text-center font-sans">Search the Museum Collection</p>
              <input 
                autoFocus
                type="text"
                placeholder="Artist, Title, or Category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-transparent border-b border-white/20 text-4xl md:text-8xl font-serif text-white text-center pb-8 focus:outline-none focus:border-white transition-colors placeholder:text-white/10"
              />
              <p className="text-gray-500 text-sm mt-12 text-center uppercase tracking-widest italic font-light">Press Enter to See Results</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
