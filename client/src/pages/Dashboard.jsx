import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminForm from '../components/AdminForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [activeTab, setActiveTab] = useState('artworks'); // artworks, artists, exhibitions
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `/${activeTab}`;
      if (activeTab === 'artworks') {
        url = `/artworks?limit=100`;
      } else if (activeTab === 'inquiries') {
        url = `/contact`;
      }
      const { data } = await api.get(url);
      
      // Handle both array responses and paginated object responses
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setData(data[activeTab] || data.data || []);
      } else {
        setData(data || []);
      }
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      try {
        const endpoint = activeTab === 'inquiries' ? `/contact/${id}` : `/${activeTab}/${id}`;
        await api.delete(endpoint);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 text-white">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-neutral-900 border border-white/10 p-6 self-start shadow-xl">
        <h2 className="text-xl font-light tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Dashboard</h2>
        <div className="space-y-4">
          {['artworks', 'artists', 'exhibitions', 'users', 'inquiries'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left text-[10px] uppercase tracking-widest py-3 px-4 transition-all duration-300 ${activeTab === tab ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              Manage {tab}
            </button>
          ))}
          <button 
            onClick={handleLogout}
            className="w-full text-left text-[10px] uppercase tracking-widest py-3 px-4 text-red-500 hover:text-red-400 mt-8 border border-red-500/20 hover:bg-red-500/5 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-neutral-900 border border-white/10 p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-light uppercase tracking-widest">
            {activeTab}
          </h3>
          {activeTab !== 'users' && activeTab !== 'inquiries' && (
            <button 
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105"
            >
              Add New {activeTab.slice(0, -1)}
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 uppercase tracking-widest animate-pulse">Loading {activeTab}...</div>
        ) : data.length === 0 ? (
          <div className="text-gray-400 font-light text-center py-20 border border-dashed border-white/20 uppercase tracking-widest text-xs">
            No {activeTab} found. Click 'Add New' to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  <th className="py-4 font-normal">
                    {activeTab === 'users' ? 'User Name / Email' : activeTab === 'inquiries' ? 'Inquirer / Message' : 'Name/Title'}
                  </th>
                  <th className="py-4 font-normal">
                    {activeTab === 'users' ? 'Role' : activeTab === 'inquiries' ? 'Subject / Date' : 'Category/Role'}
                  </th>
                  <th className="py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item) => (
                  <tr key={item._id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      {activeTab === 'inquiries' ? (
                        <div className="max-w-md">
                          <div className="text-sm font-medium tracking-wide">{item.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{item.email}</div>
                          <div className="text-xs text-gray-300 font-light border border-white/5 bg-white/[0.01] p-3 rounded-sm leading-relaxed max-h-24 overflow-y-auto italic">
                            "{item.message}"
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-4">
                          <img src={item.image || 'https://ui-avatars.com/api/?name=' + (item.title || item.name)} alt="" className="w-10 h-10 object-cover rounded-sm border border-white/10" />
                          <div>
                            <div className="text-sm font-medium tracking-wide">{item.title || item.name}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                              {activeTab === 'users' ? item.email : (item._id.substring(0, 8) + '...')}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-[10px] uppercase tracking-widest text-gray-400">
                      {activeTab === 'inquiries' ? (
                        <div>
                          <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-full mr-2">{item.subject}</span>
                          <span className="text-[9px] text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        item.category || (item.role || 'Artist')
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {activeTab !== 'users' && (
                        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          {activeTab !== 'inquiries' && (
                            <button 
                              onClick={() => {
                                setEditItem(item);
                                setShowForm(true);
                              }}
                              className="text-[10px] uppercase tracking-widest text-blue-500 hover:text-blue-400 font-bold transition-colors"
                            >
                              Edit
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400 font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <AdminForm 
          type={activeTab} 
          editItem={editItem}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }} 
          onSuccess={() => {
            fetchData();
            setEditItem(null);
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
