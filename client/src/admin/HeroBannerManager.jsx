import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Link as LinkIcon, MoveUp, MoveDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeroBannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [newBanner, setNewBanner] = useState({ image: '', title: '', subtitle: '', link: '', order: 0 });
  const [editBanner, setEditBanner] = useState({ image: '', title: '', subtitle: '', link: '', order: 0 });
  
  const { userInfo } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/hero-banners`);
      setBanners(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e, isEdit = false) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);

      if (isEdit) {
        setEditBanner({ ...editBanner, image: data.image });
      } else {
        setNewBanner({ ...newBanner, image: data.image });
      }
      setUploading(false);
    } catch (error) {
      console.error(error);
      alert('File upload failed');
      setUploading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBanner.image) {
      alert('Please upload an image first');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/api/hero-banners`, newBanner, config);
      setBanners([...banners, data].sort((a, b) => a.order - b.order));
      setNewBanner({ image: '', title: '', subtitle: '', link: '', order: 0 });
      setIsAdding(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/api/hero-banners/${id}`, editBanner, config);
      setBanners(banners.map(b => b._id === id ? data : b).sort((a, b) => a.order - b.order));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${API_URL}/api/hero-banners/${id}`, config);
        setBanners(banners.filter(b => b._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const startEdit = (banner) => {
    setEditingId(banner._id);
    setEditBanner({ 
      image: banner.image, 
      title: banner.title || '', 
      subtitle: banner.subtitle || '', 
      link: banner.link || '', 
      order: banner.order || 0 
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Hero Banners...
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">Hero Banners</h1>
          <p className="text-neutral-500 mt-1">Manage images for the home page slider</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-accent-600/20 active:scale-95"
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add New Banner'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="text-accent-600" size={24} />
            Add New Hero Banner
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Banner Image</label>
                <div className="flex flex-col gap-4">
                  {newBanner.image && (
                    <img src={newBanner.image} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-neutral-200" />
                  )}
                  <input
                    type="file"
                    onChange={(e) => uploadFileHandler(e)}
                    className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 cursor-pointer"
                  />
                  {uploading && <p className="text-sm text-accent-600 animate-pulse">Uploading...</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Display Order</label>
                <input
                  type="number"
                  value={newBanner.order}
                  onChange={(e) => setNewBanner({ ...newBanner, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. New Collection 2024"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Subtitle (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Up to 50% Off"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1 flex items-center gap-1">
                  <LinkIcon size={14} /> Link URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /shop/relief-murals"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-accent-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-accent-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Add Banner
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-2xl shadow-md border border-neutral-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            {editingId === banner._id ? (
              <div className="p-4 space-y-4">
                <div className="relative group">
                  <img src={editBanner.image} alt="Editing" className="w-full h-40 object-cover rounded-lg" />
                  <div className="mt-2">
                    <input
                      type="file"
                      onChange={(e) => uploadFileHandler(e, true)}
                      className="w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editBanner.title}
                    onChange={(e) => setEditBanner({ ...editBanner, title: e.target.value })}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded text-sm"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editBanner.subtitle}
                    onChange={(e) => setEditBanner({ ...editBanner, subtitle: e.target.value })}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded text-sm"
                    placeholder="Subtitle"
                  />
                  <input
                    type="text"
                    value={editBanner.link}
                    onChange={(e) => setEditBanner({ ...editBanner, link: e.target.value })}
                    className="w-full px-3 py-1.5 border border-neutral-200 rounded text-sm"
                    placeholder="Link URL"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Order:</span>
                    <input
                      type="number"
                      value={editBanner.order}
                      onChange={(e) => setEditBanner({ ...editBanner, order: parseInt(e.target.value) })}
                      className="w-20 px-3 py-1.5 border border-neutral-200 rounded text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleUpdate(banner._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-700"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-neutral-100 text-neutral-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-neutral-200"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => startEdit(banner)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-accent-600 rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded uppercase tracking-wider font-bold">
                    Order: {banner.order}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-dark truncate">{banner.title || 'Untitled Banner'}</h3>
                  <p className="text-sm text-neutral-500 truncate mt-1">{banner.subtitle || 'No subtitle'}</p>
                  {banner.link && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-accent-600 font-bold uppercase tracking-widest">
                      <LinkIcon size={10} /> {banner.link}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        {banners.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center">
            <ImageIcon className="mx-auto text-neutral-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-neutral-400">No Hero Banners Found</h3>
            <p className="text-neutral-500 mt-2">Click "Add New Banner" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBannerManager;
