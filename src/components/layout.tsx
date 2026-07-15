import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, X, ChevronDown, ArrowLeft, ArrowRight, Check, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '../lib/store';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Toaster, toast } from 'react-hot-toast';

import { ShopNexLogo, ShopNexText } from './brand/Logo';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const LogoIcon = () => (
  <motion.svg 
    width="44" 
    height="44" 
    viewBox="0 0 44 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
    animate={{ y: [0, -3, 0] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--color-secondary)" />
        <stop offset="100%" stopColor="var(--color-primary-fixed)" />
      </linearGradient>
    </defs>
    <motion.path
      d="M12 14L22 24H32M26 18L32 24L26 30"
      stroke="url(#logoGradient)"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M12 34L22 24L26 20M30 16L32 14"
      stroke="url(#logoGradient)"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
    />
  </motion.svg>
);

const SearchIconAnimated = () => (
  <motion.svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
    variants={{
      hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } }
    }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </motion.svg>
);

const HeartIconAnimated = () => (
  <motion.svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    variants={{
      hover: { scale: 1.1, transition: { duration: 0.2 } }
    }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </motion.svg>
);

const CartIconAnimated = () => (
  <motion.svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    variants={{
      hover: { scale: 1.1, y: -2, transition: { duration: 0.2 } }
    }}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </motion.svg>
);

const UserIconAnimated = () => (
  <motion.svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    variants={{
      hover: { y: -2, transition: { duration: 0.2 } }
    }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </motion.svg>
);

export function NavBar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return <HomeNavBar />;
  }
  return <DefaultNavBar />;
}

export function HomeNavBar() {
  const { cart, wishlist } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
       authListener.subscription.unsubscribe();
       window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/collection', isDropdown: true },
    { name: 'Pricing', path: '/collection' },
    { name: 'Contact', path: '#footer' },
  ];

  const categoryLinks = [
    { name: 'Electronics', path: '/collection?category=Electronics' },
    { name: 'Fashion', path: '/collection?category=Fashion' },
    { name: 'Home & Living', path: '/collection?category=Home' },
    { name: 'Beauty', path: '/collection?category=Beauty' },
    { name: 'Sports', path: '/collection?category=Sports' },
    { name: 'Gadgets', path: '/collection?category=Gadgets' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 flex justify-between items-center transition-all duration-500 h-[73px] px-6 md:px-10 py-5",
      isScrolled 
        ? "top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl bg-surface/40 backdrop-blur-[40px] saturate-[180%] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[32px] h-[68px] px-8" 
        : "bg-transparent border-transparent"
    )}>
      <div className="flex items-center space-x-4">
        <button 
          className="lg:hidden text-on-surface hover:text-primary-fixed transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
        <Link to="/" className="flex items-center space-x-3 group">
          <ShopNexLogo size={40} />
          <ShopNexText className="text-[28px] hidden sm:block" />
        </Link>
      </div>
      
      <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[13px] font-bold tracking-wider uppercase text-on-surface-variant hover:text-primary-fixed transition-colors relative group py-2">
          Home
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-fixed transition-all duration-300 w-0 group-hover:w-1/2"></span>
        </Link>
        <div className="relative group/nav py-2 cursor-pointer">
          <span className="text-[13px] font-bold tracking-wider uppercase text-on-surface-variant group-hover/nav:text-primary-fixed transition-colors flex items-center gap-1">
            Categories <ChevronDown size={14} className="group-hover/nav:-rotate-180 transition-transform duration-300" />
          </span>
          <div className="absolute top-[120%] left-0 w-52 bg-surface/40 backdrop-blur-[24px] saturate-[180%] border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 overflow-hidden z-[100] py-2">
            <Link to="/collection" className="block px-4 py-2.5 text-[11px] font-extrabold tracking-widest text-primary-fixed hover:bg-primary-fixed/5 transition-colors border-b border-outline-variant/10 uppercase">
              All Categories
            </Link>
            {categoryLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="block px-4 py-2.5 text-[13px] font-bold tracking-wide text-on-surface-variant hover:text-primary-fixed hover:bg-primary-fixed/5 transition-colors border-b border-outline-variant/10 last:border-0"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <Link to="/collection" className="text-[13px] font-bold tracking-wider uppercase text-on-surface-variant hover:text-primary-fixed transition-colors relative group py-2">
          Pricing
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-fixed transition-all duration-300 w-0 group-hover:w-1/2"></span>
        </Link>
        <button onClick={() => {
          const footer = document.querySelector('footer');
          if (footer) footer.scrollIntoView({ behavior: 'smooth' });
        }} className="text-[13px] font-bold tracking-wider uppercase text-on-surface-variant hover:text-primary-fixed transition-colors relative group py-2 outline-none">
          Contact
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-fixed transition-all duration-300 w-0 group-hover:w-1/2"></span>
        </button>
      </nav>

      <div className="flex items-center space-x-6">
        <motion.button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-on-surface-variant hover:text-primary-fixed transition-colors hidden sm:block outline-none"
          whileHover="hover"
        >
          <SearchIconAnimated />
        </motion.button>
        
        <Link to="/collection?favorites=true" className="text-on-surface-variant hover:text-primary-fixed transition-colors relative group block">
          <motion.div whileHover="hover">
            <HeartIconAnimated />
          </motion.div>
          {wishlist.length > 0 && (
             <motion.span 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute -top-2 -right-2 w-5 h-5 bg-error text-surface text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-surface"
             >
               {wishlist.length}
             </motion.span>
          )}
        </Link>
        
        <Link to="/checkout" className="text-on-surface-variant hover:text-primary-fixed transition-colors relative group block">
          <motion.div whileHover="hover">
            <CartIconAnimated />
          </motion.div>
          {cartItemCount > 0 && (
             <motion.span 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute -top-2 -right-2 w-5 h-5 bg-primary-fixed text-surface text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-surface"
             >
               {cartItemCount}
             </motion.span>
          )}
        </Link>
        
        {user ? (
          <Link to="/dashboard" className="text-on-surface-variant hover:text-primary-fixed transition-colors block">
            <motion.div 
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 transition-all outline outline-0 hover:outline-[3px] hover:outline-primary-fixed/20 shadow-sm overflow-hidden"
              whileHover="hover"
            >
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIconAnimated />
              )}
            </motion.div>
          </Link>
        ) : (
          <Link 
            to="/login"
            className="text-on-surface-variant hover:text-primary-fixed transition-colors block outline-none"
          >
            <motion.div 
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 transition-all outline outline-0 hover:outline-[3px] hover:outline-primary-fixed/20 shadow-sm overflow-hidden"
              whileHover="hover"
            >
              <UserIconAnimated />
            </motion.div>
          </Link>
        )}
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && <MobileMenu user={user} onClose={() => setIsMobileMenuOpen(false)} navLinks={navLinks} />}
      </AnimatePresence>

      <SearchOverlay isSearchOpen={isSearchOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsSearchOpen={setIsSearchOpen} />
    </header>
  );
}

export function DefaultNavBar() {
  const { cart, wishlist } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categoryLinks = [
    { name: 'Electronics', path: '/collection?category=Electronics' },
    { name: 'Fashion', path: '/collection?category=Fashion' },
    { name: 'Home & Living', path: '/collection?category=Home' },
    { name: 'Beauty', path: '/collection?category=Beauty' },
    { name: 'Sports', path: '/collection?category=Sports' },
    { name: 'Gadgets', path: '/collection?category=Gadgets' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 flex justify-between items-center transition-all duration-500 h-[73px] px-6 md:px-10 py-5",
      isScrolled 
        ? "top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl bg-surface/40 backdrop-blur-[40px] saturate-[180%] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[32px] h-[68px] px-8" 
        : "bg-transparent border-transparent"
    )}>
      <div className="flex items-center space-x-4">
        <button 
          className="lg:hidden text-on-surface hover:text-primary-fixed transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
        <Link to="/" className="flex items-center space-x-3 group">
          <ShopNexLogo size={40} />
          <ShopNexText className="text-[28px] hidden sm:block" />
        </Link>
      </div>
      
      <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
        {categoryLinks.map((link) => {
           const isActive = location.pathname === '/collection' && location.search.includes(link.name.split(' ')[0]);
           return (
             <Link 
               key={link.name} 
               to={link.path} 
               className={cn(
                 "relative text-[13px] font-bold tracking-wider uppercase transition-colors duration-300 py-2 group", 
                 isActive ? 'text-primary-fixed' : 'text-on-surface-variant hover:text-primary-fixed'
               )}
             >
               {link.name}
               <span className={cn(
                 "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-fixed transition-all duration-300",
                 isActive ? "w-1/2" : "w-0 group-hover:w-1/2"
               )}></span>
             </Link>
           )
        })}
      </nav>

      <div className="flex items-center space-x-6">
        <motion.button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-on-surface-variant hover:text-primary-fixed transition-colors hidden sm:block outline-none"
          whileHover="hover"
        >
          <SearchIconAnimated />
        </motion.button>
        
        <Link to="/collection?favorites=true" className="text-on-surface-variant hover:text-primary-fixed transition-colors relative group block">
          <motion.div whileHover="hover">
            <HeartIconAnimated />
          </motion.div>
          {wishlist.length > 0 && (
             <motion.span 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute -top-2 -right-2 w-5 h-5 bg-error text-surface text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-surface"
             >
               {wishlist.length}
             </motion.span>
          )}
        </Link>
        
        <Link to="/checkout" className="text-on-surface-variant hover:text-primary-fixed transition-colors relative group block">
          <motion.div whileHover="hover">
            <CartIconAnimated />
          </motion.div>
          {cartItemCount > 0 && (
             <motion.span 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="absolute -top-2 -right-2 w-5 h-5 bg-primary-fixed text-surface text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-surface"
             >
               {cartItemCount}
             </motion.span>
          )}
        </Link>
        
        {user ? (
          <Link to="/dashboard" className="text-on-surface-variant hover:text-primary-fixed transition-colors block">
            <motion.div 
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 transition-all outline outline-0 hover:outline-[3px] hover:outline-primary-fixed/20 shadow-sm overflow-hidden"
              whileHover="hover"
            >
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIconAnimated />
              )}
            </motion.div>
          </Link>
        ) : (
          <Link 
            to="/login"
            className="text-on-surface-variant hover:text-primary-fixed transition-colors block outline-none"
          >
            <motion.div 
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary-fixed hover:bg-primary-fixed/5 transition-all outline outline-0 hover:outline-[3px] hover:outline-primary-fixed/20 shadow-sm overflow-hidden"
              whileHover="hover"
            >
              <UserIconAnimated />
            </motion.div>
          </Link>
        )}
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu 
            user={user} 
            onClose={() => setIsMobileMenuOpen(false)} 
            navLinks={[
              ...categoryLinks.map(l => ({ name: l.name, path: l.path })),
              { name: 'Home', path: '/' }
            ]} 
          />
        )}
      </AnimatePresence>

      <SearchOverlay isSearchOpen={isSearchOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsSearchOpen={setIsSearchOpen} />

      {/* Floating Back Button for non-home pages */}
      <div className="fixed top-[73px] left-0 w-full z-40 px-6 py-2 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-md border border-outline-variant shadow-sm text-on-surface flex items-center justify-center hover:bg-primary-fixed hover:text-surface transition-all"
              title="Go Back"
            >
              <ArrowLeft size={18} className="stroke-[2.5px]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(1)}
              className="w-10 h-10 rounded-xl bg-surface/80 backdrop-blur-md border border-outline-variant shadow-sm text-on-surface flex items-center justify-center hover:bg-primary-fixed hover:text-surface transition-all"
              title="Go Forward"
            >
              <ArrowRight size={18} className="stroke-[2.5px]" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ user, onClose, navLinks }: { user: any, onClose: () => void, navLinks: any[] }) {
  return (
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="fixed inset-0 z-[60] bg-surface flex flex-col pt-20 px-8 pb-8 lg:hidden shadow-2xl"
    >
      <button 
         className="absolute top-6 right-6 text-on-surface hover:text-primary-fixed p-2"
         onClick={onClose}
      >
        <X size={32} />
      </button>
      <nav className="flex flex-col space-y-6 text-xl font-bold uppercase tracking-widest mt-8">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            onClick={onClose}
            className="text-on-surface hover:text-primary-fixed transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-4 pt-10 border-t border-outline-variant">
         {user ? (
           <Link to="/dashboard" onClick={onClose} className="btn-primary py-4 rounded-xl text-center text-sm font-bold uppercase tracking-wider shadow-md">
             Member Dashboard
           </Link>
         ) : (
           <Link 
             to="/login"
             onClick={onClose}
             className="btn-primary py-4 rounded-xl text-center text-sm font-bold uppercase tracking-wider shadow-md"
           >
             Member Sign In
           </Link>
         )}
      </div>
    </motion.div>
  );
}

function SearchOverlay({ isSearchOpen, searchQuery, setSearchQuery, setIsSearchOpen }: any) {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full right-0 w-full md:w-[450px] md:right-10 bg-surface/40 backdrop-blur-[24px] saturate-[180%] border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:rounded-b-2xl z-40"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            setIsSearchOpen(false);
            navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
          }} className="w-full relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              placeholder="Search products..." 
              className="w-full bg-surface-variant/50 border border-primary-fixed/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary-fixed transition-colors font-sans shadow-inner pr-12 text-sm"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-fixed p-1.5 bg-primary-fixed/10 rounded-lg hover:bg-primary-fixed hover:text-surface transition-all shadow-sm">
               <Search size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Custom Motion-based Success Animations
function CartAnimation() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background Pulse */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 bg-primary-fixed/20 rounded-full blur-3xl"
      />
      
      {/* Cart Body */}
      <motion.div
        initial={{ x: -150, opacity: 0, rotate: -10 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 100 }}
        className="relative z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -4, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 0.2, 
            repeat: 3,
            delay: 1.2
          }}
          className="text-primary-fixed"
        >
          <ShoppingCart size={120} strokeWidth={1} />
        </motion.div>
        
        {/* Falling Items */}
        <AnimatePresence>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: (i - 1) * 25, opacity: 0, scale: 0, rotate: 0 }}
              animate={{ y: -30, opacity: 1, scale: 1, rotate: i * 45 }}
              transition={{ 
                delay: 0.5 + i * 0.2, 
                duration: 0.6, 
                type: "spring",
                stiffness: 150
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
            >
              <div className="w-8 h-8 bg-secondary rounded-lg shadow-lg flex items-center justify-center border-2 border-surface">
                 <Package size={16} className="text-surface" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Big Success Tick - Green */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', damping: 8 }}
          className="absolute -top-4 -right-4 bg-[#22c55e] text-surface rounded-full p-3 shadow-2xl border-4 border-surface z-20"
        >
          <Check size={32} strokeWidth={4} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function OrderAnimation() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Circle Ring - Slow Draw */}
      <motion.svg width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-2xl">
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          stroke="#22c55e"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {/* Solid Background Fill */}
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="#22c55e"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 100 }}
        />
      </motion.svg>
      
      {/* White Hand-drawn Checkmark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg 
          width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", damping: 8, stiffness: 200 }}
        >
          <motion.path
            d="M20 6L9 17L4 12"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 0.5, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
    </div>
  );
}

export function SuccessAnimation({ type, onComplete }: { type: 'cart' | 'order', onComplete: () => void }) {
  const lastTypeRef = useRef<string | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Only toast if the type has changed
    if (lastTypeRef.current !== type) {
      lastTypeRef.current = type;
      const message = type === 'cart' ? 'Added to Cart!' : 'Order Placed Successfully!';
      toast.success(message, {
        duration: 3000,
        icon: type === 'cart' ? '🛒' : '✅',
        style: {
          borderRadius: '16px',
          background: 'var(--color-surface)',
          color: 'var(--color-on-surface)',
          border: '1px solid var(--color-outline-variant)',
          fontWeight: 'bold',
          padding: '16px 24px',
          fontSize: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
    
    // Timer MUST always run independently of toast status
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 4000);

    return () => clearTimeout(timer);
  }, [type]);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface/90 backdrop-blur-md px-6 cursor-pointer"
      title="Click to dismiss"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-surface/40 backdrop-blur-[40px] saturate-[180%] p-10 rounded-[40px] border border-white/30 flex flex-col items-center shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={() => onCompleteRef.current()}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors p-2"
        >
          <X size={20} />
        </button>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary-fixed)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {type === 'cart' ? <CartAnimation /> : <OrderAnimation />}
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-6"
          >
            <p className="text-on-surface-variant font-medium mt-2">
              {type === 'cart' ? 'Item is waiting in your cart.' : 'Your order is being processed.'}
            </p>
          </motion.div>


          {/* Progress bar */}
          <div className="w-full h-1.5 bg-outline-variant/20 rounded-full mt-10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-secondary to-primary-fixed"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="w-full px-8 pt-20 pb-12 bg-surface border-t border-outline-variant mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary-fixed"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 border-b border-outline-variant pb-16 max-w-7xl mx-auto relative z-10">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center space-x-3 mb-6 group">
            <ShopNexLogo size={32} animated={false} />
            <ShopNexText className="text-2xl" />
          </Link>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-6">
            Shop Next Level, Be Smart. Everything You Need, One Click Away.
          </p>
          <p className="text-on-surface-variant text-sm flex flex-col gap-3 font-medium">
            <span className="hover:text-primary-fixed transition-colors cursor-pointer flex items-center gap-2">Email: support@shopnex.com</span>
            <span className="hover:text-primary-fixed transition-colors cursor-pointer flex items-center gap-2">Phone: +880 1234-567890</span>
            <span className="hover:text-primary-fixed transition-colors cursor-pointer flex items-center gap-2">Address: Dhaka, Bangladesh</span>
          </p>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-extrabold tracking-tight text-on-surface mb-2">Categories</p>
          <Link to="/collection?category=Electronics" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Electronics
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/collection?category=Fashion" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Fashion
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/collection?category=Home" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Home & Living
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/collection?category=Beauty" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Beauty & Health
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-extrabold tracking-tight text-on-surface mb-2">Customer Care</p>
          <Link to="/page/faq" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Help Center / FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/page/return-policy" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Return Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/dashboard" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Track Your Order
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-extrabold tracking-tight text-on-surface mb-2">Legal</p>
          <Link to="/page/terms" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Terms & Conditions
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/page/privacy-policy" className="font-medium text-sm text-on-surface-variant hover:text-primary-fixed transition-colors w-max relative group">
            Privacy Policy
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary-fixed transition-all group-hover:w-full"></span>
          </Link>
        </div>
      </div>
      <div className="w-full text-center mt-12 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <p className="font-bold text-xs tracking-widest text-on-surface-variant uppercase">© {new Date().getFullYear()} SHOPNEX. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-4 mt-6 md:mt-0 text-on-surface-variant">
           {/* Social placeholers */}
           <div className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
           </div>
           <div className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
           </div>
           <div className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-variant hover:text-primary-fixed transition-colors cursor-pointer">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
           </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </footer>
  );
}
