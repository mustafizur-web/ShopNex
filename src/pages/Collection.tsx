import { useState } from 'react';
import { ChevronDown, Heart, Filter, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext, type Product } from '../lib/store';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Collection() {
  const { wishlist, toggleWishlist, products } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const showFavorites = searchParams.get('favorites') === 'true';
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [sortBy, setSortBy] = useState<'Popular' | 'Price: Low to High' | 'Price: High to Low' | 'Newest'>('Popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortProducts = (productItems: Product[]) => {
    const sorted = [...productItems];
    switch (sortBy) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => 
          parseFloat(a.price.replace(/[^0-9.-]+/g,"")) - parseFloat(b.price.replace(/[^0-9.-]+/g,""))
        );
      case 'Price: High to Low':
        return sorted.sort((a, b) => 
          parseFloat(b.price.replace(/[^0-9.-]+/g,"")) - parseFloat(a.price.replace(/[^0-9.-]+/g,""))
        );
      case 'Newest':
        return sorted.sort((a, b) => {
          const idA = a.id.replace(/\D/g, '');
          const idB = b.id.replace(/\D/g, '');
          return parseInt(idB || '0') - parseInt(idA || '0');
        });
      case 'Popular':
      default:
        return sorted; // 'Popular' is default order in array
    }
  };

  const filteredProducts = sortProducts(products.filter(p => {
    const isCategoryMatch = selectedCategory === 'All' || p.category.includes(selectedCategory) || selectedCategory.includes(p.category);
    const isSearchMatch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const isFavoriteMatch = !showFavorites || wishlist.includes(p.id);
    const priceNum = parseFloat(p.price.replace(/[^0-9.-]+/g,""));
    const isPriceMatch = priceNum <= maxPrice;
    return isCategoryMatch && isPriceMatch && isSearchMatch && isFavoriteMatch;
  }));

  const clearAllFilters = () => {
     setMaxPrice(3500);
     setSortBy('Popular');
     if (showFavorites) {
        navigate('/collection?favorites=true');
     } else {
        navigate('/collection');
     }
  };

  return (
    <div className="px-6 md:px-16 pb-20 pt-28 max-w-[1440px] mx-auto min-h-screen">
      <header className="mb-12 pt-8">
        <motion.h1 
          className="font-sans font-extrabold text-4xl md:text-5xl mb-3 text-on-surface tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {showFavorites ? 'Your Favorites' : (searchQuery ? `Search Results for "${searchQuery}"` : (selectedCategory === 'All' ? 'Discover Our Products' : `${selectedCategory} Collection`))}
        </motion.h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 flex-shrink-0 glass-panel p-6 rounded-2xl self-start h-max">
          <div className="flex items-center justify-between border-b border-primary-fixed/20 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-2"><Filter size={14}/> Filters</span>
            <button onClick={clearAllFilters} className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed hover:text-on-surface transition-colors">Clear All</button>
          </div>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">Category</h3>
            <div className="space-y-3">
              {['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Gadgets'].map((cat) => {
                const isSelected = selectedCategory === cat || (selectedCategory === 'All' && cat === 'All');
                return (
                  <Link 
                    to={cat === 'All' ? '/collection' : `/collection?category=${cat}`}
                    key={cat} 
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-4 h-4 border rounded relative transition-colors flex items-center justify-center ${isSelected ? 'bg-primary-fixed border-primary-fixed shadow-sm' : 'border-outline-variant bg-transparent group-hover:border-primary-fixed'}`}>
                      {isSelected && <svg className="w-3 h-3 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-primary-fixed text-shadow-sm' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{cat}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">Max Price: ${maxPrice}</h3>
            </div>
            <div className="pt-2 px-1">
              <input 
                type="range" 
                min="0" 
                max="3500" 
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-fixed cursor-pointer"
              />
              <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase">
                <span>Min: $0</span>
                <span>Max: $3500</span>
              </div>
            </div>
          </section>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 isolate">
          <div className="flex justify-between items-center mb-6 glass-panel px-4 py-3 rounded-xl relative z-[40]">
            <span className="text-xs font-semibold text-on-surface-variant">Showing {filteredProducts.length} items</span>
            <div className="relative">
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant/50 text-on-surface rounded-lg text-xs font-bold tracking-wide hover:bg-surface-variant transition-colors border border-outline-variant"
              >
                Sort By: {sortBy} <ChevronDown size={14} className={cn("transition-transform", showSortDropdown && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    {/* Invisible backdrop to close dropdown when clicking outside or just provide space */}
                    <div 
                      className="fixed inset-0 z-[50]" 
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-56 bg-surface border border-outline-variant rounded-2xl shadow-2xl z-[60] overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-1 px-1.5 py-1.5">
                        {(['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low'] as const).map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setShowSortDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 text-xs font-bold transition-all rounded-xl mb-0.5 last:mb-0 uppercase tracking-widest",
                              sortBy === option 
                                ? "text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/20 shadow-inner" 
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              {option}
                              {sortBy === option && <Check size={14} className="text-primary-fixed" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((prod, index) => {
              const isWishlisted = wishlist.includes(prod.id);
              return (
                <motion.div 
                  key={prod.id}
                  className="group relative flex flex-col bg-surface rounded-2xl border border-primary-fixed/10 overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-primary-fixed/40"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="block h-64 bg-surface-variant relative overflow-hidden">
                    <Link to={`/product/${prod.id}`}>
                      <motion.img 
                        src={prod.img} 
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"; // Fallback tech image
                          target.onerror = null;
                        }}
                      />
                    </Link>
                    <button onClick={(e) => { e.preventDefault(); toggleWishlist(prod.id); }} className="absolute top-3 right-3 text-on-surface-variant hover:text-primary-fixed transition-colors p-2 z-10 bg-surface/80 backdrop-blur-md rounded-full shadow-sm hover:shadow-md">
                      <Heart size={16} className={isWishlisted ? 'fill-primary-fixed text-primary-fixed' : ''} />
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-surface to-surface-variant/30">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] font-bold text-primary-fixed uppercase tracking-wider">{prod.category}</p>
                       <div className="flex text-secondary gap-0.5">
                         <Star size={10} fill="currentColor" />
                         <span className="text-[10px] text-on-surface">4.8</span>
                       </div>
                    </div>
                    <Link to={`/product/${prod.id}`} className="font-sans font-bold text-lg text-on-surface mb-2 leading-tight group-hover:text-primary-fixed transition-colors">{prod.name}</Link>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-primary-fixed/10">
                       <span className="text-on-surface font-extrabold text-lg">{prod.price}</span>
                       <Link to={`/product/${prod.id}`} className="bg-primary-fixed/10 text-primary-fixed border border-primary-fixed/30 hover:bg-primary-fixed hover:text-on-surface px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                         View
                       </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
             <div className="text-center py-20">
               <p className="text-on-surface-variant text-lg">No products found in this category.</p>
             </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="mt-16 flex justify-center">
              <button className="btn-outline px-8 py-3 rounded-xl font-bold text-xs tracking-widest uppercase">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
