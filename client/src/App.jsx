import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedPage from './components/AnimatedPage';
import { AuthProvider } from './context/AuthContext';

// Lazy loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const ArtworkDetail = React.lazy(() => import('./pages/ArtworkDetail'));
const Artists = React.lazy(() => import('./pages/Artists'));
const Exhibitions = React.lazy(() => import('./pages/Exhibitions'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Login = React.lazy(() => import('./pages/Login'));
const ArtistDetail = React.lazy(() => import('./pages/ArtistDetail'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const VirtualGallery = React.lazy(() => import('./pages/VirtualGallery'));
const ExhibitionDetail = React.lazy(() => import('./pages/ExhibitionDetail'));

// Simple loading spinner
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="w-12 h-12 border-t-2 border-[var(--text-main)] rounded-full animate-spin"></div>
  </div>
);

const LocationProvider = () => {
  const location = useLocation();
  
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
        <Navbar />
        <main className="flex-grow pt-20">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
                <Route path="/gallery" element={<AnimatedPage><Gallery /></AnimatedPage>} />
                <Route path="/virtual-gallery" element={<AnimatedPage><VirtualGallery /></AnimatedPage>} />
                <Route path="/artwork/:id" element={<AnimatedPage><ArtworkDetail /></AnimatedPage>} />
                <Route path="/artists" element={<AnimatedPage><Artists /></AnimatedPage>} />
                <Route path="/artists/:id" element={<AnimatedPage><ArtistDetail /></AnimatedPage>} />
                <Route path="/exhibitions" element={<AnimatedPage><Exhibitions /></AnimatedPage>} />
                <Route path="/exhibitions/:id" element={<AnimatedPage><ExhibitionDetail /></AnimatedPage>} />
                <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
                <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
                <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
                <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <LocationProvider />
    </Router>
  );
}

export default App;
