import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCollection, setNewCollection] = useState({ title: '', image: '', description: '' });
  const [editCollection, setEditCollection] = useState({ title: '', image: '', description: '' });
  const { userInfo } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/collections`);
      setCollections(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/api/collections`, newCollection, config);
      setCollections([...collections, data]);
      setNewCollection({ title: '', image: '', description: '' });
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
      const { data } = await axios.put(`${API_URL}/api/collections/${id}`, editCollection, config);
      setCollections(collections.map(c => c._id === id ? data : c));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${API_URL}/api/collections/${id}`, config);
        setCollections(collections.filter(c => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const startEdit = (collection) => {
    setEditingId(collection._id);
    setEditCollection({ 
      title: collection.title, 
      image: collection.image, 
      description: collection.description || '' 
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Collections...
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest italic">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-dark tracking-tighter uppercase italic">
            Collection <span className="text-accent-600">Management</span>
          </h1>
          <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
            Curate featured collections for your homepage
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-8 py-4 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-accent-700 transition-all hover:scale-105 shadow-xl shadow-accent-600/20 active:scale-95 group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add New Collection
        </button>
      </div>

      {isAdding && (
        <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 text-neutral-dark">
            Create New <span className="text-accent-600">Collection</span>
          </h2>
          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  Collection Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Featured Artwork"
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                  value={newCollection.title}
                  onChange={(e) => setNewCollection({ ...newCollection, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                  value={newCollection.image}
                  onChange={(e) => setNewCollection({ ...newCollection, image: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                Description
              </label>
              <textarea
                placeholder="Describe this collection..."
                className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm min-h-[120px]"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="px-8 py-4 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent-700 transition-all shadow-lg"
              >
                Save Collection
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-8 py-4 bg-neutral-100 text-neutral-dark rounded-full font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary-100">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Collection Details</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {collections.map((collection) => (
                <tr key={collection._id} className="hover:bg-white transition-colors group">
                  <td className="px-8 py-6">
                    {editingId === collection._id ? (
                      <div className="space-y-4 max-w-2xl">
                        <input
                          type="text"
                          value={editCollection.title}
                          onChange={(e) => setEditCollection({ ...editCollection, title: e.target.value })}
                          className="w-full bg-primary-50 border border-primary-100 rounded-xl py-2 px-4 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={editCollection.image}
                          onChange={(e) => setEditCollection({ ...editCollection, image: e.target.value })}
                          className="w-full bg-primary-50 border border-primary-100 rounded-xl py-2 px-4 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark"
                          placeholder="Image URL"
                        />
                        <textarea
                          value={editCollection.description}
                          onChange={(e) => setEditCollection({ ...editCollection, description: e.target.value })}
                          className="w-full bg-primary-50 border border-primary-100 rounded-xl py-2 px-4 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark"
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-6">
                        <div className="w-32 h-20 rounded-2xl overflow-hidden bg-white border border-primary-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase italic tracking-tighter text-neutral-dark mb-1">
                            {collection.title}
                          </h3>
                          <p className="text-sm text-neutral-dark/40 font-medium line-clamp-2">
                            {collection.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      {editingId === collection._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(collection._id)}
                            className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all shadow-sm"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(collection)}
                            className="p-3 bg-white text-accent-400 border border-primary-100 rounded-xl hover:text-accent-600 hover:border-accent-200 transition-all shadow-sm"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(collection._id)}
                            className="p-3 bg-white text-red-400 border border-primary-100 rounded-xl hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {collections.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-neutral-dark/40 font-black uppercase tracking-widest italic">No collections found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;
