import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from '../ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const SignatureArtworks = ({ products, onAddToWishlist }) => {
  // Randomize and limit products to 8 items
  const randomizedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [products]);

  return (
    <section className="py-8 md:py-8 bg-[#fffcf0]/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-10 md:mb-14">
          <h2 className="text-sm md:text-3xl font-bold text-neutral-dark tracking-tight uppercase italic">Signature Artworks</h2>
          <Link 
            to="/shop" 
            className="px-6 py-2 bg-[#222] text-white rounded-full text-xs font-bold hover:bg-black transition-all shadow-md uppercase tracking-wide text-center"
          >
            View All
          </Link>
        </div>

        {/* Swiper Slider */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={randomizedProducts.length > 4}
            navigation={{
              nextEl: '.swiper-button-next-sig',
              prevEl: '.swiper-button-prev-sig',
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
               340: { slidesPerView: 2 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-4 !px-2"
          >
            {randomizedProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} onAddToWishlist={onAddToWishlist} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Slider Arrows */}
          <button className="swiper-button-prev-sig absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl border border-primary-50 flex items-center justify-center text-neutral-dark hover:bg-primary-50 z-20 opacity-0 group-hover:opacity-100 transition-all focus:outline-none">
            <ChevronLeft size={20} />
          </button>
          
          <button className="swiper-button-next-sig absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl border border-primary-50 flex items-center justify-center text-neutral-dark hover:bg-primary-50 z-20 opacity-0 group-hover:opacity-100 transition-all focus:outline-none">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignatureArtworks;
