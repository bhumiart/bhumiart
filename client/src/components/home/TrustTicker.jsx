import React from 'react';
import { Star, CheckCircle, Heart } from 'lucide-react';

const TrustTicker = () => {
  const items = [
    { icon: <Star className="text-yellow-400 fill-yellow-400" size={16} />, text: "4.5/5 Rating" },
    { icon: <CheckCircle className="text-green-500" size={16} />, text: "Verified" },
    { icon: <Heart className="text-red-500 fill-red-500" size={16} />, text: "Customer love us 5/5 based on 118+ Reviews" },
    { icon: <Star className="text-yellow-400 fill-yellow-400" size={16} />, text: "4.5/5 Rating" },
    { icon: <CheckCircle className="text-green-500" size={16} />, text: "Verified" },
  ];

  // Duplicate items to ensure seamless loop
  const tickerItems = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-[#fff0f3] border-y border-accent-100 overflow-hidden py-3 my-2">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {tickerItems.map((item, index) => (
          <div key={index} className="inline-flex items-center space-x-2 mx-8 sm:mx-12">
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="text-neutral-dark text-xs sm:text-sm font-bold tracking-tight">
              {item.text}
            </span>
            <span className="ml-8 sm:ml-12 text-accent-200 font-thin">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustTicker;
