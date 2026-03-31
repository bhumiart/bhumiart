import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, IndianRupee, Layers, Package, FileText, Type, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const isEditMode = id !== undefined;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('Relief Murals');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/categories`);
        setCategories(data.map(c => c.name));
        if (data.length > 0 && !isEditMode) {
          setCategory(data[0].name);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();

    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setFetching(true);
          const { data } = await axios.get(`${API_URL}/api/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setOriginalPrice(data.originalPrice);
          setImage(data.image);
          setImages(data.images || []);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
          setFetching(false);
        } catch (err) {
          setError(err.message);
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const uploadFileHandler = async (e) => {
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

      setImage(data.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setError('File upload failed');
      setUploading(false);
    }
  };

  const uploadMultipleFilesHandler = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    setUploadingMultiple(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const uploadedImages = [];
      for (const file of files) {
        const singleFormData = new FormData();
        singleFormData.append('image', file);
        const { data } = await axios.post(`${API_URL}/api/upload`, singleFormData, config);
        uploadedImages.push(data.image);
      }

      setImages(prev => [...prev, ...uploadedImages]);
      setUploadingMultiple(false);
    } catch (error) {
      console.error(error);
      setError('Multiple file upload failed');
      setUploadingMultiple(false);
    }
  };

  const removeImageHandler = (imgToRemove) => {
    setImages(images.filter(img => img !== imgToRemove));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const productData = {
        name,
        price,
        originalPrice,
        image,
        images,
        category,
        countInStock,
        description,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/api/products/${id}`, productData, config);
      } else {
        await axios.post(`${API_URL}/api/products`, productData, config);
      }
      setLoading(false);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Masterpiece...
    </div>
  );

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${import.meta.env.VITE_API_BASE_URL}${url}`;
    return url;
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-accent-600/10 rounded-2xl flex items-center justify-center text-accent-600">
          <Sparkles size={32} />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-dark tracking-tighter uppercase italic">
            {isEditMode ? 'Edit' : 'Create'} <span className="text-accent-600">Masterpiece</span>
          </h1>
          <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
            {isEditMode ? `ID: ${id}` : 'Craft a new addition to the gallery'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-bold flex items-center shadow-sm">
          <span className="mr-3">⚠️</span> {error}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-8">
          <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 p-8 md:p-12 shadow-sm space-y-10">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <Type size={12} className="mr-2" /> Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Relief Mural"
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <Layers size={12} className="mr-2" /> Category
                </label>
                <select
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <IndianRupee size={12} className="mr-2" /> Sale Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm italic"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <IndianRupee size={12} className="mr-2 text-neutral-dark/20" /> Original Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark/40 transition-all shadow-sm italic"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <Package size={12} className="mr-2" /> Count In Stock
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm italic"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Image & Description */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <ImageIcon size={12} className="mr-2" /> Product Image
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Image URL"
                      className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="file"
                      id="image-file"
                      className="hidden"
                      onChange={uploadFileHandler}
                    />
                    <label 
                      htmlFor="image-file"
                      className="w-full bg-accent-600/5 border-2 border-dashed border-accent-600/20 rounded-2xl py-4 px-6 flex items-center justify-center cursor-pointer hover:bg-accent-600/10 transition-all font-bold text-accent-600 text-sm"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent-600 mr-3"></div>
                      ) : (
                        <ImageIcon size={18} className="mr-2" />
                      )}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </div>
                </div>
                {image && (
                  <div className="mt-4 w-32 h-32 rounded-2xl overflow-hidden border border-primary-100 bg-white shadow-lg">
                    <img src={getImageUrl(image)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Multiple Images */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <ImageIcon size={12} className="mr-2" /> Additional Masterpiece Images
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      type="file"
                      id="multiple-images-file"
                      className="hidden"
                      multiple
                      onChange={uploadMultipleFilesHandler}
                    />
                    <label 
                      htmlFor="multiple-images-file"
                      className="w-full bg-accent-600/5 border-2 border-dashed border-accent-600/20 rounded-2xl py-4 px-6 flex items-center justify-center cursor-pointer hover:bg-accent-600/10 transition-all font-bold text-accent-600 text-sm"
                    >
                      {uploadingMultiple ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent-600 mr-3"></div>
                      ) : (
                        <ImageIcon size={18} className="mr-2" />
                      )}
                      {uploadingMultiple ? 'Uploading...' : 'Upload More Images'}
                    </label>
                  </div>
                </div>
                {images && images.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-primary-100 bg-white shadow-md">
                        <img src={getImageUrl(img)} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageHandler(img)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  <FileText size={12} className="mr-2" /> Description
                </label>
                <textarea
                  placeholder="Describe the soul of this masterpiece..."
                  rows="5"
                  className="w-full bg-white border border-primary-100 rounded-[2rem] py-6 px-8 focus:outline-none focus:border-accent-400 font-medium text-neutral-dark leading-relaxed transition-all shadow-sm resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-12 py-5 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-accent-700 transition-all hover:scale-105 shadow-2xl shadow-accent-600/30 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 group"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
              ) : (
                <Save size={20} className="mr-2 group-hover:scale-110 transition-transform" />
              )}
              {isEditMode ? 'Update Masterpiece' : 'Publish Masterpiece'}
            </button>
          </div>
        </form>
      </div>
    );
};

export default ProductEdit;

