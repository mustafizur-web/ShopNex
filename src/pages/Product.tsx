import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Share2, Heart, Plus, Minus, ArrowRight, Truck, ShieldCheck, Tag, ShoppingBag, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../lib/store';

export default function Product() {
  const [quantity, setQuantity] = useState(1);
  const [showAddedCart, setShowAddedCart] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToCart, wishlist, toggleWishlist, showAnimation, products } = useAppContext();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="pt-40 pb-20 px-6 text-center space-y-6">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100/50">
          <X size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Product not found.</h2>
        <p className="text-slate-400 font-bold max-w-xs mx-auto">The entity you are looking for might have been de-propagated or moved.</p>
        <Link to="/collection" className="btn-primary inline-flex py-4 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest gap-2">
           <ArrowLeft size={16} /> Return to Universe
        </Link>
      </div>
    );
  }
  
  const productId = product.id;
  const isWishlisted = wishlist.includes(productId);

  const priceNum = parseFloat(product.price.replace(/[^0-9.-]+/g,""));

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: product.name,
      price: priceNum,
      quantity,
      img: product.img,
      category: product.category
    });
    
    showAnimation('cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="pt-8" ref={containerRef}>
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 mb-8 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <Link to="/" className="hover:text-primary-fixed transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/collection?category=${product.category.split(' ')[0]}`} className="hover:text-primary-fixed transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-on-surface bg-primary-fixed/20 px-2 rounded">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-160px)] px-4 md:px-8 max-w-[1440px] mx-auto gap-8">
        {/* Images Area (Scrollable with Parallax) */}
        <div className="w-full lg:w-1/2 flex flex-col relative overflow-hidden rounded-3xl border border-primary-fixed/20 glass-panel shadow-2xl h-[40vh] sm:h-[50vh] lg:h-[80vh]">
          <motion.div className="w-full h-full relative" style={{ y: parallaxY }}>
            <img 
              src={product.img} 
              className="w-full h-[120%] object-cover object-center lg:object-top -mt-[5%] transition-all" 
              alt={product.name} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"; 
                target.onerror = null;
              }}
            />
          </motion.div>
          <div className="absolute top-4 left-4">
             <span className="bg-primary-fixed border border-primary-fixed text-on-surface text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                BEST SELLER
             </span>
          </div>
        </div>

        {/* Product Details (Sticky) */}
        <div className="w-full lg:w-1/2 py-4 lg:py-12 lg:sticky top-24 h-max">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-6 md:p-10 rounded-3xl border border-primary-fixed/10 relative overflow-hidden shadow-2xl"
          >
             {/* Glow Behind Details */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-fixed/5 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
              <div className="flex-1">
                <p className="text-xs font-bold text-primary-fixed uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Tag size={14} /> {product.category}
                </p>
                <h1 className="font-sans font-extrabold text-2xl sm:text-3xl md:text-5xl text-on-surface mb-2 leading-tight tracking-tight break-words">{product.name}</h1>
              </div>
              <div className="flex gap-4 sm:flex-shrink-0">
                <button className="text-on-surface-variant hover:text-primary-fixed transition-colors bg-surface p-3 rounded-full shadow border border-outline-variant hover:border-primary-fixed/50 flex-shrink-0">
                  <Share2 size={18} strokeWidth={2} />
                </button>
                <button onClick={() => toggleWishlist(productId)} className={`${isWishlisted ? 'text-primary-fixed border-primary-fixed/50' : 'text-on-surface-variant border-outline-variant hover:text-primary-fixed'} transition-colors bg-surface p-3 rounded-full shadow border flex-shrink-0`}>
                  <Heart size={18} strokeWidth={isWishlisted ? 3 : 2} className={isWishlisted ? 'fill-primary-fixed' : ''} />
                </button>
              </div>
            </div>

            <p className="text-3xl text-on-surface mb-8 font-sans font-extrabold flex items-center gap-3 relative z-10">
               {product.price}
               <span className="text-sm font-medium text-on-surface-variant line-through block mt-1">${(priceNum * 1.3).toFixed(2)}</span>
            </p>

            <div className="space-y-6 mb-10 relative z-10">
              <p className="text-on-surface-variant font-light leading-relaxed text-base">
                {product.description || `Discover the perfect blend of innovation and style with the ${product.name}. Carefully crafted for modern lifestyles, 
                this premium ${product.category.toLowerCase()} item delivers unmatched quality, stunning details, and remarkable durability. 
                Experience next-generation design today.`}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-primary-fixed/10">
                    <Truck className="text-primary-fixed" size={20} />
                    <div>
                       <p className="text-xs font-bold text-on-surface uppercase">Free Delivery</p>
                       <p className="text-[10px] text-on-surface-variant">On orders over $50</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-primary-fixed/10">
                    <ShieldCheck className="text-primary-fixed" size={20} />
                    <div>
                       <p className="text-xs font-bold text-on-surface uppercase">2-Year Warranty</p>
                       <p className="text-[10px] text-on-surface-variant">Guaranteed protection</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Quantity */}
              <div>
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3 block">Quantity</span>
                <div className="flex items-center justify-between border border-primary-fixed/30 rounded-xl w-40 p-1 bg-surface shadow-inner">
                  <button className="p-3 text-on-surface-variant hover:text-primary-fixed transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} strokeWidth={3}/></button>
                  <span className="font-sans text-sm font-bold text-on-surface">{quantity}</span>
                  <button className="p-3 text-on-surface-variant hover:text-primary-fixed transition-colors" onClick={() => setQuantity(quantity + 1)}><Plus size={16} strokeWidth={3}/></button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={handleAddToCart} className="flex-1 btn-primary py-4 rounded-xl text-sm font-extrabold tracking-wider uppercase text-center flex items-center justify-center gap-2 border border-transparent">
                  <Plus size={18} /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 btn-outline py-4 rounded-xl text-center text-sm font-extrabold tracking-wider uppercase backdrop-blur-md">
                  Buy Now
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-wider text-on-surface-variant pt-6 border-t border-primary-fixed/10">
                 <ArrowRight size={14} className="text-primary-fixed" />
                 30-Day Hassle-Free Returns
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
