import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from '../ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const BestSellerSection = ({ products, onAddToCart, onAddToWishlist }) => {
  return (
    <section className="py-16 md:py-12 bg-white overflow-hidden ">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-14 gap-4">
          <h2 className="text-2xl md:text-4xl font-black text-neutral-dark tracking-tighter uppercase italic">All Time Best Sellers</h2>
          <Link 
            to="/shop" 
            className="px-8 py-3 bg-neutral-dark text-white rounded-xl text-xs font-black hover:bg-accent-900 transition-all shadow-xl uppercase tracking-widest text-center"
          >
            View All Collection
          </Link>
        </div>

        {/* Swiper Slider (Owl Carousel Effect) */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-4"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard 
                  product={product} 
                  onAddToWishlist={onAddToWishlist}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Slider Arrows */}
          <button className="swiper-button-prev-custom absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl border border-primary-50 flex items-center justify-center text-neutral-dark hover:bg-primary-50 z-20 opacity-0 group-hover:opacity-100 transition-all focus:outline-none">
            <ChevronLeft size={20} />
          </button>
          
          <button className="swiper-button-next-custom absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl border border-primary-50 flex items-center justify-center text-neutral-dark hover:bg-primary-50 z-20 opacity-0 group-hover:opacity-100 transition-all focus:outline-none">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
