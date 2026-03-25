import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Use dynamic URL for assets outside of src
const getImageUrl = (name) => {
  return new URL(`../../../images/banners/${name}`, import.meta.url).href;
};

const Hero = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  const slides = [
    { image: getImageUrl('banner-1.jpeg') },
    { image: getImageUrl('banner-2.jpeg') },
    { image: getImageUrl('banner-3.jpeg') },
    { image: getImageUrl('banner-4.jpeg') }
  ];

  return (
    <section className="relative w-full h-[30vh] sm:h-[60vh] md:h-[80vh] overflow-hidden group">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
          bulletClass: 'custom-bullet',
          bulletActiveClass: 'custom-bullet-active',
        }}
        navigation={{
          prevEl,
          nextEl,
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background Image - Zoom removed */}
              <img
                src={slide.image}
                alt={`Banner ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation & Pagination Capsule at Bottom Center */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-4 w-full justify-center px-4 max-w-lg">
        {/* Prev Button - Circular Capsule */}
        <button 
          ref={(node) => setPrevEl(node)}
          className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer border border-transparent active:scale-95 flex-shrink-0"
        >
          <ChevronLeft size={16} className="sm:size-8" />
        </button>

        {/* Pagination Container - Long Pill Capsule */}
        <div className="custom-pagination bg-white/90 backdrop-blur-md px-4 sm:px-8 py-2 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 shadow-lg min-w-[100px] sm:min-w-[10px] overflow-hidden">
          {/* Swiper will inject bullets here */}
        </div>

        {/* Next Button - Circular Capsule */}
        <button 
          ref={(node) => setNextEl(node)}
          className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer border border-transparent active:scale-95 flex-shrink-0"
        >
          <ChevronRight size={16} className="sm:size-8" />
        </button>
      </div>

      {/* Custom Styles for Swiper & Custom Navigation */}
      <style>{`
        .custom-pagination {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .custom-bullet {
          width: 6px;
          height: 6px;
          background: #d1d1d1;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 4px;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .custom-bullet {
            width: 10px;
            height: 10px;
            margin: 0 6px;
          }
        }
        .custom-bullet-active {
          background: #5e0b35; /* accent-900 color for active dot */
          transform: scale(1.3);
        }
        
        /* Ensure navigation buttons work */
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
 
};

export default Hero;
