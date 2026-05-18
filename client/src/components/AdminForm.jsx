import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminForm = ({ type, onClose, onSuccess, editItem }) => {
  const [formData, setFormData] = useState({
    title: editItem?.title || '',
    name: editItem?.name || '',
    description: editItem?.description || '',
    bio: editItem?.bio || '',
    price: editItem?.price || '',
    category: editItem?.category || 'Painting',
    artist: editItem?.artist?._id || editItem?.artist || '',
    image: editItem?.image || '',
  });
  const [artists, setArtists] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (type === 'artworks') {
      fetchArtists();
    }
  }, [type]);

  const fetchArtists = async () => {
    try {
      const { data } = await api.get('/artists');
      setArtists(data);
      if (data.length > 0 && !editItem) {
        setFormData(prev => ({ ...prev, artist: data[0]._id }));
      }
    } catch (error) {
      console.error('Failed to fetch artists', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // The backend returns /uploads/..., we need the full URL for display if it's not absolute
      const backendUrl = api.defaults.baseURL.replace('/api', '');
      setFormData({ ...formData, image: `${backendUrl}${data.image}` });
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const endpoint = editItem ? `/${type}/${editItem._id}` : `/${type}`;
      const payload = type === 'artworks' 
        ? { 
            title: formData.title, 
            description: formData.description, 
            artist: formData.artist, 
            price: formData.price, 
            image: formData.image, 
            category: formData.category 
          }
        : { 
            name: formData.name, 
            bio: formData.bio, 
            image: formData.image 
          };

      if (editItem) {
        await api.put(endpoint, payload);
      } else {
        await api.post(endpoint, payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || `${editItem ? 'Update' : 'Creation'} failed`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 w-full max-w-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <h3 className="text-xl uppercase tracking-widest font-light">Add New {type.slice(0, -1)}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {type === 'artworks' ? (
            <>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Artist</label>
                <select name="artist" value={formData.artist} onChange={handleChange} className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors">
                  {artists.map(a => <option key={a._id} value={a._id} className="bg-neutral-900">{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors">
                  {['Painting', 'Digital', 'Photography', 'Sculpture', 'Mixed Media'].map(cat => <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Biography</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} required rows="4" className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors" />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Image</label>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL or upload..." className="w-full bg-black/20 border border-white/10 p-3 text-sm focus:border-white outline-none transition-colors" required />
              </div>
              <label className="cursor-pointer bg-white text-black p-3 hover:bg-gray-200 transition-colors">
                <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              </label>
            </div>
            {formData.image && <img src={formData.image} alt="Preview" className="mt-4 w-full h-32 object-cover border border-white/10" />}
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={submitting || uploading}
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {submitting ? 'Processing...' : editItem ? `Update ${type.slice(0, -1)}` : `Create ${type.slice(0, -1)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
