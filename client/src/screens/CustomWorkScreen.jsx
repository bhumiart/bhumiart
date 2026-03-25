import React from 'react';
import { Sparkles, Palette, Ruler, MessageSquare, ArrowRight } from 'lucide-react';

const CustomWorkScreen = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-neutral-dark mb-6 tracking-tighter italic uppercase">
            Custom <span className="text-accent-600">Creations</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-dark/60 max-w-2xl mx-auto font-medium italic">
            Bring your vision to life with our bespoke Lippan art services. From statement wall murals to personalized gifts, we create masterpieces tailored just for you.
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-neutral-dark uppercase italic tracking-tighter mb-4">Our Bespoke Process</h2>
          <div className="w-24 h-1.5 bg-accent-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: <MessageSquare size={32} />, title: "Consultation", desc: "Share your ideas, dimensions, and color preferences with our team." },
            { icon: <Palette size={32} />, title: "Design Sketch", desc: "We'll provide a detailed sketch and color palette for your approval." },
            { icon: <Sparkles size={32} />, title: "Crafting", desc: "Our master artisans meticulously create your piece using traditional mud-work." },
            { icon: <Ruler size={32} />, title: "Delivery", desc: "Your custom masterpiece is carefully packed and delivered to your doorstep." }
          ].map((step, i) => (
            <div key={i} className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-primary-50 text-accent-600 rounded-[2rem] flex items-center justify-center mx-auto group-hover:bg-accent-600 group-hover:text-white transition-all duration-500 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-neutral-dark">{step.title}</h3>
              <p className="text-sm text-neutral-dark/60 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="bg-neutral-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">Ready to Start Your Project?</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto italic">Contact us today for a free consultation and quote for your custom Lippan art piece.</p>
            <a 
              href="https://wa.me/yournumber" 
              className="inline-flex items-center px-10 py-5 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-accent-700 transition-all hover:scale-105 shadow-xl shadow-accent-600/20 active:scale-95 group"
            >
              Get a Quote <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomWorkScreen;
