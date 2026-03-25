import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ArtworkDetail from './pages/ArtworkDetail';
import Artists from './pages/Artists';
import Exhibitions from './pages/Exhibitions';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnimatedPage from './components/AnimatedPage';

const LocationProvider = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/gallery" element={<AnimatedPage><Gallery /></AnimatedPage>} />
            <Route path="/artwork/:id" element={<AnimatedPage><ArtworkDetail /></AnimatedPage>} />
            <Route path="/artists" element={<AnimatedPage><Artists /></AnimatedPage>} />
            <Route path="/artists/:id" element={<AnimatedPage><Artists /></AnimatedPage>} />
            <Route path="/exhibitions" element={<AnimatedPage><Exhibitions /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
            <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
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
