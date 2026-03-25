import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('artworks'); // artworks, artists, exhibitions

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      const parsed = JSON.parse(userInfo);
      // In a real app, verify admin role: if(parsed.role !== 'admin') navigate('/');
      setUser(parsed);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 text-white">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-neutral-900 border border-white/10 p-6 self-start">
        <h2 className="text-xl font-light tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Dashboard</h2>
        <div className="space-y-4">
          <button 
            onClick={() => setActiveTab('artworks')}
            className={`w-full text-left text-sm uppercase tracking-widest py-2 transition-colors ${activeTab === 'artworks' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Manage Artworks
          </button>
          <button 
            onClick={() => setActiveTab('artists')}
             className={`w-full text-left text-sm uppercase tracking-widest py-2 transition-colors ${activeTab === 'artists' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Manage Artists
          </button>
          <button 
            onClick={() => setActiveTab('exhibitions')}
             className={`w-full text-left text-sm uppercase tracking-widest py-2 transition-colors ${activeTab === 'exhibitions' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Manage Exhibitions
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left text-sm uppercase tracking-widest py-2 text-red-500 hover:text-red-400 mt-8"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-neutral-900 border border-white/10 p-8">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-light uppercase tracking-widest">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <button className="px-4 py-2 bg-white text-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Add New
          </button>
        </div>

        <div className="text-gray-400 font-light text-center py-20 border border-dashed border-white/20">
          <p>Admin features (CRUD operations) for {activeTab} will be implemented here.</p>
          <p className="text-sm mt-2">Connecting to backend APIs: <code className="text-white">POST /api/{activeTab}</code></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
