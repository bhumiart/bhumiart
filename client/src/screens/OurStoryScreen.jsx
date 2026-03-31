import React from 'react';
import { Heart, Globe, Users, History, Sparkles, ShieldCheck } from 'lucide-react';

const OurStoryScreen = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-50 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-neutral-dark mb-6 tracking-tighter italic uppercase">
            Our <span className="text-accent-600">Story</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-dark/60 max-w-2xl mx-auto font-medium italic leading-relaxed">
            Preserving the ancient mud-and-mirror art form of Kutch, Gujarat. We bridge the gap between traditional craftsmanship and modern interiors.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex px-4 py-2 bg-accent-50 text-accent-700 rounded-full text-xs font-black uppercase tracking-widest border border-accent-100">
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-dark uppercase italic tracking-tighter leading-[0.9]">
              Crafting <br /> <span className="text-accent-600">Culture</span> <br /> For Your Home
            </h2>
            <p className="text-lg text-neutral-dark/60 font-medium leading-relaxed italic">
              Lippan art, also known as Mud and Mirror Work, is a traditional mural craft of the Kutchi people. At logo.png, we empower local artisans and keep this heritage alive by creating masterpieces that fit perfectly in contemporary homes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {[
                { icon: <Globe size={20} />, title: "Authentic Heritage", desc: "Using the same mud-and-mirror techniques passed down through generations." },
                { icon: <Heart size={20} />, title: "Artisan First", desc: "We provide fair wages and a platform for master artisans from Gujarat." }
              ].map((item, i) => (
                <div key={i} className="space-y-3 p-6 bg-primary-50 rounded-[2rem] border border-primary-100">
                  <div className="text-accent-600">{item.icon}</div>
                  <h3 className="font-black uppercase italic tracking-tighter text-neutral-dark">{item.title}</h3>
                  <p className="text-xs text-neutral-dark/60 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 border-8 border-white">
              <img 
                src="https://www.artociti.com/cdn/shop/files/Group_1597880753.png?v=1763973000&width=600" 
                alt="Artisan Crafting" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent-600 text-white p-8 rounded-[3rem] flex flex-col justify-center -rotate-6 shadow-2xl">
              <p className="text-4xl font-black italic tracking-tighter">100%</p>
              <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Handmade with Pride</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-neutral-dark py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Why Choose <span className="text-accent-600">logo.png</span></h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Our core values define every piece we create</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <History size={32} />, title: "Timeless Quality", desc: "Our murals are designed to last for generations, using durable materials." },
              { icon: <Sparkles size={32} />, title: "Exquisite Detail", desc: "Every mirror is placed by hand, creating intricate geometric patterns." },
              { icon: <ShieldCheck size={32} />, title: "Trusted Delivery", desc: "We ensure your artwork reaches you safely with our specialized packaging." }
            ].map((value, i) => (
              <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all duration-500 group">
                <div className="text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-500">{value.icon}</div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{value.title}</h3>
                <p className="text-white/40 font-medium leading-relaxed italic">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryScreen;
