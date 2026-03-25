import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL || '$(import.meta.env.VITE_API_BASE_URL)';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`${API_URL}/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Products...
    </div>
  );

  if (error) return <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest italic">Error: {error}</div>;

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${API_URL}${url}`;
    return url;
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-neutral-dark tracking-tighter uppercase italic">
            Product <span className="text-accent-600">Management</span>
          </h1>
          <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
            Curate and manage your gallery of masterpieces
          </p>
        </div>
        <Link 
          to="/admin/product/create" 
          className="inline-flex items-center px-8 py-4 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-accent-700 transition-all hover:scale-105 shadow-xl shadow-accent-600/20 active:scale-95 group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add New Masterpiece
        </Link>
      </div>

      <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary-100">
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Product</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Category</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Price</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40">Stock</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-neutral-dark/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-primary-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                          <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-dark line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-neutral-dark/40 font-bold uppercase tracking-widest mt-1">ID: {product._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-white border border-primary-200 rounded-full text-[10px] font-black uppercase tracking-widest text-accent-700 shadow-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-neutral-dark italic">₹{product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'} italic`}>
                        {product.countInStock} In Stock
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link 
                          to={`/admin/product/${product._id}/edit`}
                          className="w-10 h-10 bg-white border border-primary-200 rounded-xl flex items-center justify-center text-accent-600 hover:bg-accent-600 hover:text-white hover:border-accent-600 transition-all shadow-sm"
                          title="Edit Product"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => deleteHandler(product._id)}
                          className="w-10 h-10 bg-white border border-primary-200 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && (
          <div className="text-center py-32 bg-primary-50 rounded-[2.5rem] border border-dashed border-primary-200 mt-8">
            <p className="text-neutral-dark/40 font-bold uppercase tracking-widest italic">No masterpieces found in the gallery</p>
          </div>
        )}
    </div>
  );
};

export default ProductList;

