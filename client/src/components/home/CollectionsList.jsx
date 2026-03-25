import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const CollectionCard = ({ title, image }) => {
  return (
    <Link to={`/shop?search=${title}`} className="relative group overflow-hidden rounded-2xl md:rounded-[2rem] aspect-square sm:aspect-[4/3] md:aspect-[2/1] cursor-pointer shadow-lg">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      {/* Overlay with Title */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 flex items-center">
        <div className="ml-6 sm:ml-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/30 px-6 py-4 rounded-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CollectionsList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL || '$(import.meta.env.VITE_API_BASE_URL)';

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/collections`);
        setCollections(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) return null;
  if (collections.length === 0) return null;

  return (
    <section className="py-16 md:py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-black text-neutral-dark tracking-tighter uppercase italic">Featured Collections</h2>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary-100 flex items-center justify-center text-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-300">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-primary-100 flex items-center justify-center text-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-300">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid of Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {collections.map((collection, index) => (
            <CollectionCard 
              key={index}
              title={collection.title}
              image={collection.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsList;

