import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Truck, Star, Percent, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { useAppContext } from '../lib/store';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const { products, wishlist, toggleWishlist } = useAppContext();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden -mt-24">
        <motion.div 
          className="absolute inset-0 z-0 bg-background"
          style={{ y: backgroundY }}
        >
          {/* We'll use a futuristic/high-tech abstract e-commerce image here */}
          <img 
            className="w-full h-[130%] object-cover opacity-20 scale-105" 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2940"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background z-10"></div>
        </motion.div>
        
        <motion.div 
          className="relative z-20 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{ opacity }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-surface/50 border border-outline-variant text-primary-fixed text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
              Welcome to the Future
            </span>
          </div>
          <h1 className="font-sans font-extrabold text-5xl md:text-7xl lg:text-[80px] text-on-surface mb-6 max-w-4xl leading-tight tracking-tighter mx-auto">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-fixed">Shop Next Level</span>, Be Smart
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
            Everything you need, one click away. Discover world-class Electronics, Fashion, Beauty, and Gadgets at unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-6">
            <Link to="/collection" className="btn-primary px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-center w-full max-w-xs mx-auto">
              Start Shopping
            </Link>
          </div>
        </motion.div>

        {/* Floating Perks Banner */}
        <motion.div 
          className="absolute bottom-10 left-0 w-full z-30 px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="max-w-6xl mx-auto glass-panel rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-outline-variant shadow-sm border border-outline-variant/50 backdrop-blur-3xl">
              <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-start pt-2 md:pt-0 group cursor-pointer relative overflow-hidden p-2 rounded-xl transition-all duration-300 hover:bg-surface-variant/30">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-outline-variant shadow-md relative overflow-hidden"
                  whileHover="hover"
                >
                  <motion.div 
                     className="absolute inset-0 bg-gradient-to-tr from-primary-fixed/20 to-transparent"
                     animate={{ opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Enhanced Sparking/Starburst Elements */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-primary-fixed rounded-full z-0"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0],
                        x: [0, Math.cos(i * 60 * (Math.PI / 180)) * 40],
                        y: [0, Math.sin(i * 60 * (Math.PI / 180)) * 40],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.2, 
                        delay: i * 0.2,
                        ease: "circOut"
                      }}
                    />
                  ))}

                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut"
                    }}
                    whileHover={{ 
                      scale: 1.3, 
                      rotate: [0, -15, 15, -15, 15, 0],
                      transition: { duration: 0.5 }
                    }}
                    className="z-10 flex items-center justify-center"
                  >
                    <Percent size={32} className="text-primary-fixed drop-shadow-sm" strokeWidth={2.5} />
                  </motion.div>
                </motion.div>
                <div>
                   <p className="text-on-surface font-extrabold text-lg tracking-tight group-hover:text-primary-fixed transition-colors">Mega Sale</p>
                   <p className="text-on-surface-variant text-sm font-medium leading-tight">Up to 50% OFF</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-center pt-6 md:pt-0 md:pl-8 group cursor-pointer relative overflow-hidden p-2 rounded-xl transition-all duration-300 hover:bg-surface-variant/30">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-outline-variant shadow-md relative overflow-hidden"
                  whileHover="hover"
                >
                  {/* Road Element with Speed Blur */}
                  <div className="absolute bottom-4 left-0 w-full h-[3px] overflow-hidden px-2 opacity-30">
                    <motion.div 
                      className="w-[200%] h-full border-b-[2px] border-dashed border-secondary"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                    />
                  </div>
                  
                  <motion.div 
                     className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent"
                     animate={{ opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                  />
                  
                  {/* Truck moving from start to end */}
                  <motion.div
                    animate={{ 
                      x: [-40, 40],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "linear"
                    }}
                    className="z-10"
                  >
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
                    >
                      <Truck size={30} className="text-secondary drop-shadow-sm" strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                </motion.div>
                <div>
                   <p className="text-on-surface font-extrabold text-lg tracking-tight group-hover:text-secondary transition-colors">Free Delivery</p>
                   <p className="text-on-surface-variant text-sm font-medium leading-tight">On Orders Over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-1/3 justify-center md:justify-end pt-6 md:pt-0 md:pl-8 group cursor-pointer relative overflow-hidden p-2 rounded-xl transition-all duration-300 hover:bg-surface-variant/30">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-outline-variant shadow-md relative overflow-hidden"
                  whileHover="hover"
                >
                  <motion.div 
                     className="absolute inset-0 bg-gradient-to-tr from-primary-fixed/20 to-transparent"
                     animate={{ opacity: [0.3, 0.8, 0.3], rotate: [0, -90, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                  />
                  
                  {/* Rotating Scanner Border */}
                  <motion.div 
                    className="absolute inset-1 rounded-full border border-dashed border-primary-fixed/40"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  />

                  {/* Shield Shine Effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-[300%] -translate-x-full rotate-[35deg]"
                    animate={{ translateX: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1.5 }}
                  />

                  <motion.div
                    animate={{ 
                      scale: [0.98, 1.05, 0.98],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    className="z-10"
                  >
                    <ShieldCheck size={32} className="text-primary-fixed drop-shadow-sm" strokeWidth={2.5} />
                    <motion.div
                      className="absolute inset-0 border-2 border-primary-fixed rounded-full"
                      animate={{ 
                        scale: [1, 1.8], 
                        opacity: [0.35, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.div>
                <div>
                   <p className="text-on-surface font-extrabold text-lg tracking-tight group-hover:text-primary-fixed transition-colors">Trusted</p>
                   <p className="text-on-surface-variant text-sm font-medium leading-tight">By 10,000+ Customers</p>
                </div>
              </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="px-6 md:px-16 py-32 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface mb-4 tracking-tight">Explore Categories</h2>
            <p className="text-on-surface-variant font-light text-lg">Curated selections of top-tier products across tech, fashion, and lifestyle.</p>
          </div>
          <Link to="/collection" className="text-xs font-bold text-primary-fixed tracking-wider border-b border-primary-fixed/30 pb-1 hover:border-primary-fixed transition-all uppercase whitespace-nowrap group">
            VIEW ALL PRODUCTS
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-3 gap-6 md:h-[1000px]">
          {/* Main Category */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8 md:row-span-2 relative overflow-hidden group cursor-pointer rounded-2xl glass-panel p-2 shadow-sm"
          >
            <div className="w-full h-[400px] md:h-full relative rounded-xl overflow-hidden">
               <img className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2940" alt="Electronics" />
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-8 pt-24">
                 <p className="text-[10px] font-bold text-on-surface mb-2 uppercase tracking-widest bg-surface px-3 py-1 rounded inline-block">HOT TECH RELEASES</p>
                 <h3 className="font-sans font-extrabold text-3xl text-on-surface tracking-tight mt-2">Premium Electronics</h3>
               </div>
               <Link onClick={() => window.scrollTo(0,0)} to="/collection?category=Electronics" className="absolute inset-0 z-10"></Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 relative overflow-hidden group cursor-pointer rounded-2xl glass-panel p-2 shadow-sm flex flex-col"
          >
            <div className="h-[250px] md:h-full relative rounded-xl overflow-hidden">
               <img className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2840" alt="Fashion" />
               <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors"></div>
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 pt-16">
                 <h3 className="font-sans font-extrabold text-2xl text-on-surface tracking-tight">Men & Women Fashion</h3>
               </div>
               <Link onClick={() => window.scrollTo(0,0)} to="/collection?category=Fashion" className="absolute inset-0 z-10"></Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-4 md:row-span-1 relative overflow-hidden group cursor-pointer rounded-2xl glass-panel p-2 shadow-sm flex flex-col"
          >
            <div className="h-[250px] md:h-full relative rounded-xl overflow-hidden">
               <img className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2900" alt="Home & Living" />
               <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors"></div>
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 pt-16">
                 <h3 className="font-sans font-extrabold text-2xl text-on-surface tracking-tight">Home & Living</h3>
               </div>
               <Link onClick={() => window.scrollTo(0,0)} to="/collection?category=Home" className="absolute inset-0 z-10"></Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-6 md:row-span-1 relative overflow-hidden group cursor-pointer rounded-2xl glass-panel p-2 shadow-sm flex flex-col"
          >
            <div className="h-[250px] md:h-full relative rounded-xl overflow-hidden">
               <img className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=2900" alt="Beauty" />
               <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors"></div>
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 pt-16">
                 <h3 className="font-sans font-extrabold text-2xl text-on-surface tracking-tight">Beauty</h3>
               </div>
               <Link onClick={() => window.scrollTo(0,0)} to="/collection?category=Beauty" className="absolute inset-0 z-10"></Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-6 md:row-span-1 relative overflow-hidden group cursor-pointer rounded-2xl glass-panel p-2 shadow-sm flex flex-col"
          >
            <div className="h-[250px] md:h-full relative rounded-xl overflow-hidden">
               <img className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2900" alt="Sports" />
               <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors"></div>
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 pt-16">
                 <h3 className="font-sans font-extrabold text-2xl text-on-surface tracking-tight">Sports & Outdoors</h3>
               </div>
               <Link onClick={() => window.scrollTo(0,0)} to="/collection?category=Sports" className="absolute inset-0 z-10"></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 md:px-16 py-24 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface mb-4 tracking-tight">Trending Now</h2>
            <p className="text-on-surface-variant font-light text-lg">The most sought-after pieces from our latest propagation.</p>
          </div>
          <Link to="/collection" className="flex items-center gap-2 text-xs font-black text-primary-fixed tracking-widest uppercase group transition-all hover:gap-3">
            Explore All <span><ArrowRight size={14} /></span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((prod, index) => {
            const isWishlisted = wishlist.includes(prod.id);
            return (
              <motion.div 
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col bg-surface rounded-2xl border border-primary-fixed/5 overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-primary-fixed/20 isolate"
              >
                <div className="block h-72 bg-surface-variant relative overflow-hidden">
                  <Link to={`/product/${prod.id}`}>
                    <motion.img 
                      src={prod.img} 
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <button 
                    onClick={() => toggleWishlist(prod.id)} 
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-primary-fixed transition-all p-2.5 z-10 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Heart size={16} className={isWishlisted ? 'fill-primary-fixed text-primary-fixed' : ''} />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[9px] font-black uppercase text-primary-fixed bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-primary-fixed/10 tracking-widest">
                      New Arrival
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-slate-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{prod.category}</p>
                    <div className="flex text-amber-400 gap-0.5 items-center">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] text-slate-900 font-black">4.9</span>
                    </div>
                  </div>
                  <Link to={`/product/${prod.id}`} className="font-sans font-black text-lg text-slate-900 mb-3 leading-tight group-hover:text-primary-fixed transition-colors line-clamp-1">{prod.name}</Link>
                  <p className="text-xs text-slate-400 font-bold mb-6 line-clamp-2 leading-relaxed">{prod.description}</p>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
                    <span className="text-slate-900 font-black text-xl tracking-tight">{prod.price}</span>
                    <Link to={`/product/${prod.id}`} className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-primary-fixed transition-all shadow-md active:scale-95">
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-16 bg-surface border-t border-outline-variant relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
             <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-4">What Our Customers Say</h2>
             <p className="text-on-surface-variant max-w-2xl mx-auto">Trusted by thousands of shoppers across the country.</p>
          </div>
          
          <div className="relative w-full overflow-hidden flex" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <motion.div 
               className="flex gap-6 w-max"
               animate={{ x: ["0%", "-50%"] }}
               transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            >
              {[
                {
                  text: "ShopNex is my absolute go-to for all electronics. The delivery was lightning fast, and everything arrived perfectly packaged.",
                  initial: "S",
                  name: "Sarah J.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "I bought a few dresses for an upcoming event. Not only was the quality beyond amazing, but their sizing guide was spot on.",
                  initial: "M",
                  name: "Michael R.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "Excellent shopping experience. I had some issues with my payment initially, but their technical support resolved it within minutes.",
                  initial: "E",
                  name: "Emily T.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "I snagged some incredible deals during their mega sale. The items are 100% genuine and the tracking feature was very accurate.",
                  initial: "D",
                  name: "David C.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "Finding high-quality beauty products locally is tough, but ShopNex had everything I needed. Fast shipping and great prices.",
                  initial: "L",
                  name: "Linda K.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "Best eCommerce site I've used. I found rare tech gadgets here that were sold out everywhere else. Seamless experience!",
                  initial: "J",
                  name: "James L.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "The search and filtering options made finding the exact makeup shade I needed so easy. This is my new favorite online store.",
                  initial: "A",
                  name: "Alicia W.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "Unbeatable prices on organic home decor. My living room looks like a magazine cover thanks to ShopNex!",
                  initial: "H",
                  name: "Henry B.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "The Apple Watch Ultra I ordered arrived overnight. Authenticity guaranteed, and the warranty process was explained clearly.",
                  initial: "K",
                  name: "Kevin M.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
                },
                {
                  text: "I love the minimalist high-tech vibe of the website. It reflects the quality of products they sell. Highly impressed.",
                  initial: "R",
                  name: "Rachel T.",
                  status: "Verified Buyer",
                  img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150&h=150"
                }
              ].map((testimonial, i) => (
                <div 
                  key={i}
                  className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-outline-variant hover:border-primary-fixed/30 transition-all cursor-default w-[350px] shrink-0"
                >
                  <div className="flex text-amber-400 gap-1">
                    {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed italic flex-grow">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-outline-variant/50">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface font-bold text-lg overflow-hidden shrink-0 border border-outline-variant">
                      {testimonial.img ? (
                        <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover" />
                      ) : (
                        testimonial.initial
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-on-surface font-bold text-sm tracking-tight">{testimonial.name}</p>
                      <p className="text-primary-fixed/80 font-bold text-[10px] uppercase tracking-wider">{testimonial.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
