import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, Lock, Trash2, CreditCard, Truck, ArrowLeft, ShoppingCart, User, Phone, Mail, MapPin, Globe, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../lib/store';

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default function Checkout() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.email) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Invalid email';
    
    if (!customerInfo.firstName) newErrors.firstName = 'Required';
    if (!customerInfo.lastName) newErrors.lastName = 'Required';
    if (!customerInfo.address) newErrors.address = 'Required';
    if (!customerInfo.city) newErrors.city = 'Required';
    if (!customerInfo.postalCode) newErrors.postalCode = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { cart, removeFromCart, updateQuantity, placeOrder, showAnimation } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState('bkash');

  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingCart size={40} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-slate-400 font-bold max-w-xs mx-auto uppercase text-[10px] tracking-[0.2em]">Add some digital assets or physical products to proceed</p>
        </div>
        <Link to="/collection" className="btn-primary inline-flex py-4 px-12 rounded-2xl text-[11px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-500/20">
           <ArrowLeft size={16} /> Explore Universe
        </Link>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.08;
  const isFreeDelivery = subtotal > 50;
  const shipping = isFreeDelivery ? 0 : 10;
  const total = subtotal + taxes + shipping;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    if (!validate()) {
      return;
    }

    const { email, firstName, lastName, address, city, postalCode } = customerInfo;
    
    placeOrder({
      id: Math.random().toString(36).substring(2, 9),
      items: [...cart],
      total: total,
      date: new Date().toISOString(),
      status: 'Processing',
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      address: address,
      city: city,
      postalCode: postalCode,
      paymentMethod: paymentMethod.toUpperCase()
    });
    
    showAnimation('order');
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-12 lg:py-20 min-h-screen pt-28">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Form Area */}
        <div className="flex-1 lg:max-w-xl">
          {/* Progress */}
          <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-12">
            <span className="text-primary-fixed border-b border-primary-fixed pb-1">Shipping</span>
            <ChevronRight size={14} className="text-on-surface-variant" />
            <span className="text-primary-fixed border-b border-primary-fixed pb-1">Payment</span>
            <ChevronRight size={14} className="text-on-surface-variant" />
            <span className="text-on-surface-variant">Confirmation</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 px-1">
            <div className="space-y-1">
              <Link to="/collection" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 transition-all mb-2 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Continue Shopping
              </Link>
              <h2 className="font-sans font-black text-3xl md:text-4xl text-slate-900 tracking-tight flex items-center gap-3">
                <CreditCard className="text-indigo-600" size={32} />
                Checkout
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-0.5">Secure Transaction Protocol Active</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={20} />
              </div>
              <div className="leading-none">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Encryption</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">256-BIT SSL</p>
              </div>
            </div>
          </div>
            
            <form className="space-y-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2 px-1">
                  <ShieldCheck size={16} className="text-indigo-600"/> Customer Info
                </h3>
                <div className="bg-white border border-slate-100 p-6 rounded-[24px] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Email Terminal</label>
                    <input 
                      type="email" 
                      placeholder="hello@example.com" 
                      value={customerInfo.email}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                      className={cn(
                        "bg-[#f8f9fb] border focus:bg-white focus:ring-4 px-5 py-3.5 rounded-xl outline-none text-slate-900 transition-all font-bold text-sm placeholder:text-slate-300",
                        errors.email ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : "border-slate-50 focus:border-indigo-500/50 focus:ring-indigo-500/5"
                      )}
                    />
                    {errors.email && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">{errors.email}</span>}
                  </div>
                </div>

              </div>

              {/* Address */}
              <div className="space-y-6">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 px-1">Delivery Address</h3>
                 <div className="bg-white border border-slate-100 p-6 rounded-[24px] space-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">First Identity *</label>
                        <input 
                          type="text" 
                          placeholder="Agent"
                          value={customerInfo.firstName}
                          onChange={(e) => {
                            setCustomerInfo({...customerInfo, firstName: e.target.value});
                            if (errors.firstName) setErrors({...errors, firstName: ''});
                          }}
                          className={cn(
                            "bg-[#f8f9fb] border focus:bg-white focus:ring-4 px-5 py-3.5 rounded-xl outline-none text-slate-900 transition-all font-bold text-sm placeholder:text-slate-300",
                            errors.firstName ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : "border-slate-50 focus:border-indigo-500/50 focus:ring-indigo-500/5"
                          )}
                        />
                        {errors.firstName && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">{errors.firstName}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Last Identity *</label>
                        <input 
                          type="text" 
                          placeholder="Smith"
                          value={customerInfo.lastName}
                          onChange={(e) => {
                            setCustomerInfo({...customerInfo, lastName: e.target.value});
                            if (errors.lastName) setErrors({...errors, lastName: ''});
                          }}
                          className={cn(
                            "bg-[#f8f9fb] border focus:bg-white focus:ring-4 px-5 py-3.5 rounded-xl outline-none text-slate-900 transition-all font-bold text-sm placeholder:text-slate-300",
                            errors.lastName ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : "border-slate-50 focus:border-indigo-500/50 focus:ring-indigo-500/5"
                          )}
                        />
                        {errors.lastName && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">{errors.lastName}</span>}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Node (Address) *</label>
                      <input 
                        type="text" 
                        placeholder="Sector 7"
                        value={customerInfo.address}
                        onChange={(e) => {
                          setCustomerInfo({...customerInfo, address: e.target.value});
                          if (errors.address) setErrors({...errors, address: ''});
                        }}
                        className={cn(
                          "bg-[#f8f9fb] border focus:bg-white focus:ring-4 px-5 py-3.5 rounded-xl outline-none text-slate-900 transition-all font-bold text-sm placeholder:text-slate-300",
                          errors.address ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : "border-slate-50 focus:border-indigo-500/50 focus:ring-indigo-500/5"
                        )}
                      />
                      {errors.address && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">{errors.address}</span>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">City Hub *</label>
                        <input 
                          type="text" 
                          placeholder="Nexus City"
                          value={customerInfo.city}
                          onChange={(e) => {
                            setCustomerInfo({...customerInfo, city: e.target.value});
                            if (errors.city) setErrors({...errors, city: ''});
                          }}
                          className={cn(
                            "bg-[#f8f9fb] border focus:bg-white focus:ring-4 px-5 py-3.5 rounded-xl outline-none text-slate-900 transition-all font-bold text-sm placeholder:text-slate-300",
                            errors.city ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : "border-slate-50 focus:border-indigo-500/50 focus:ring-indigo-500/5"
                          )}
                        />
                        {errors.city && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">{errors.city}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Postal Protocol *</label>
                        <input 
                          type="text" 
                          placeholder="101010"
                          value={customerInfo.postalCode}
                          onChange={(e) => {
                            setCustomerInfo({...customerInfo, postalCode: e.target.value});
                            if (errors.postalCode) setErrors({...errors, postalCode: ''});
                          }}
                          className={cn(
                            "bg-[#f8f9fb] border focus:bg-white focus:ring-4 px-5 py-3.5 rounded-xl outline-none text-slate-900 transition-all font-bold text-sm placeholder:text-slate-300",
                            errors.postalCode ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : "border-slate-50 focus:border-indigo-500/50 focus:ring-indigo-500/5"
                          )}
                        />
                        {errors.postalCode && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1">{errors.postalCode}</span>}
                      </div>
                    </div>
                 </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-6">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-indigo-600" /> Secure Payment
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className={cn(
                      "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all aspect-square md:aspect-auto md:h-24 group overflow-hidden bg-white",
                      paymentMethod === 'bkash' ? "border-[#e2136e] shadow-[0_0_20px_rgba(226,19,110,0.1)]" : "border-slate-100 hover:border-slate-200"
                    )}>
                      <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="sr-only" />
                      <div className="w-full h-12 flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 160 160" className="h-full w-auto object-contain transition-transform group-hover:scale-110 z-10 p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g transform="translate(10, 10)">
                            {/* 1. Back Wing (Top left/middle) */}
                            <polygon points="20,40 75,10 65,80" fill="#df146e" />
                            {/* 2. Front Wing (Bottom right/middle) */}
                            <polygon points="65,80 125,90 75,115" fill="#df146e" />
                            {/* 3. Main Body / Center piece */}
                            <polygon points="65,80 75,10 115,70" fill="#e2136e" />
                            {/* 4. Tail (Left side pointing down) */}
                            <polygon points="20,40 65,80 48,135" fill="#9c0942" />
                            {/* 5. Beak/Head (Right side) */}
                            <polygon points="115,70 142,70 130,82" fill="#d11162" />
                          </g>
                        </svg>
                      </div>
                      {paymentMethod === 'bkash' && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#e2136e] rounded-full shadow-sm ring-2 ring-white" />}
                      <span className="text-[10px] font-bold uppercase tracking-tight mt-1 text-[#e2136e]">bKash</span>
                    </label>

                    <label className={cn(
                      "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all aspect-square md:aspect-auto md:h-24 group overflow-hidden bg-white",
                      paymentMethod === 'nagad' ? "border-[#f7941d] shadow-[0_0_20px_rgba(247,148,29,0.1)]" : "border-slate-100 hover:border-slate-200"
                    )}>
                      <input type="radio" name="payment" value="nagad" checked={paymentMethod === 'nagad'} onChange={() => setPaymentMethod('nagad')} className="sr-only" />
                      <div className="w-full h-12 flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 280 100" className="h-full w-auto object-contain transition-transform group-hover:scale-110 z-10 p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="nagadOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f99f1b" />
                              <stop offset="100%" stopColor="#f37021" />
                            </linearGradient>
                            <linearGradient id="nagadRed" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ed1c24" />
                              <stop offset="100%" stopColor="#c1272d" />
                            </linearGradient>
                          </defs>
                          <g transform="translate(5, 0)">
                            {/* 1. Swirling Circles / Rays Graphic */}
                            {/* Outer Red Swish */}
                            <path d="M 50 10 C 25 10 5 30 5 50 C 5 70 20 85 40 90 C 25 80 18 65 18 50 C 18 32 32 18 50 18 C 65 18 78 28 82 42 C 78 28 65 22 50 22 C 35 22 24 34 24 50 C 24 66 35 78 50 78 C 65 78 76 68 79 55 C 76 65 65 72 50 72 C 38 72 28 62 28 50 C 28 38 38 28 50 28 C 62 28 72 38 72 50 C 72 62 62 72 50 72 C 45 72 40 68 40 62 C 40 56 45 52 50 52 C 55 52 60 56 60 62 C 60 65 58 68 55 70 C 58 68 62 62 62 56 C 62 48 55 42 47 42 C 39 42 32 48 32 56 C 32 64 39 70 47 70 C 55 70 62 64 64 56" fill="url(#nagadRed)" />
                            {/* Orange Middle Swish */}
                            <path d="M 50 12 C 29 12 12 29 12 50 C 12 67 24 81 40 85 C 28 77 22 64 22 50 C 22 34 34 22 50 22 C 64 22 75 31 78 44 C 74 32 63 26 50 26 C 37 26 26 37 26 50 C 26 63 37 74 50 74 C 63 74 74 63 74 50" fill="url(#nagadOrange)" />
                            {/* Inner Circle Base */}
                            <circle cx="50" cy="50" r="20" fill="#ffffff" />
                            {/* Runner Silhouette in Red */}
                            <g transform="translate(1, 0)">
                              {/* Head */}
                              <circle cx="50" cy="39" r="2.8" fill="#ed1c24" />
                              {/* Torso */}
                              <path d="M 49.5 42 L 50.5 49 L 48 55 L 50.5 59 L 53 53 L 55.5 51 L 53.5 44 Z" fill="#ed1c24" />
                              {/* Leg Forward */}
                              <path d="M 50.5 49 L 54.5 53 L 57.5 53 L 55 50" fill="#ed1c24" />
                              {/* Leg Back */}
                              <path d="M 48 55 L 45 55 L 47 51" fill="#ed1c24" />
                              {/* Bag on Back */}
                              <path d="M 46.5 42.5 C 45 44 45 47.5 47 48.5 C 48.5 48.5 49.5 47 49 44 Z" fill="#ed1c24" />
                              {/* Stick/Pole horizontal */}
                              <line x1="41" y1="49.5" x2="61" y2="49.5" stroke="#ed1c24" strokeWidth="1.2" />
                              {/* Lantern hanging */}
                              <rect x="43" y="49.5" width="2" height="4.5" fill="none" stroke="#ed1c24" strokeWidth="1" />
                              <line x1="44" y1="54" x2="44" y2="56" stroke="#ed1c24" strokeWidth="1" />
                            </g>

                            {/* 2. Text Brand: "নগদ" (Nagad) in Red */}
                            <text x="96" y="58" fontFamily="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', sans-serif" fontWeight="900" fontSize="42" fill="#e31a22" letterSpacing="-1">নগদ</text>
                            
                            {/* 3. Subtext: "ডাক বিভাগের ডিজিটাল লেনদেন" in Black */}
                            <text x="96" y="78" fontFamily="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', sans-serif" fontWeight="700" fontSize="10" fill="#333333" letterSpacing="-0.2">ডাক বিভাগের ডিজিটাল লেনদেন</text>
                          </g>
                        </svg>
                      </div>
                      {paymentMethod === 'nagad' && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#f7941d] rounded-full shadow-sm ring-2 ring-white" />}
                      <span className="text-[10px] font-bold uppercase tracking-tight mt-1 text-[#f7941d]">Nagad</span>
                    </label>

                    <label className={cn(
                      "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all aspect-square md:aspect-auto md:h-24 group overflow-hidden bg-white",
                      paymentMethod === 'rocket' ? "border-[#8c3494] shadow-[0_0_20px_rgba(140,52,148,0.1)]" : "border-slate-100 hover:border-slate-200"
                    )}>
                      <input type="radio" name="payment" value="rocket" checked={paymentMethod === 'rocket'} onChange={() => setPaymentMethod('rocket')} className="sr-only" />
                      <div className="w-full h-12 flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 280 100" className="h-full w-auto object-contain transition-transform group-hover:scale-110 z-10 p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g transform="translate(5, 0)">
                            {/* Origami Rocket / Paper Airplane */}
                            <g transform="translate(45, -5)">
                              {/* Left upper fold (back wing) */}
                              <polygon points="120,52 225,18 165,92" fill="#a64cae" />
                              {/* Under wing / crease shadow */}
                              <polygon points="225,18 165,92 182,65" fill="#73247a" />
                              {/* Front main wing (folded up) */}
                              <polygon points="225,18 182,65 205,60" fill="#8c3494" />
                              {/* Trailing edge fold under shadow */}
                              <polygon points="165,92 182,65 180,98" fill="#54155a" />
                              {/* Left wing crease detail */}
                              <polygon points="120,52 165,92 148,82" fill="#bd59c5" />
                            </g>
                            
                            {/* Text "ROCKET" in purple */}
                            <text x="15" y="42" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" fill="#8c3494" letterSpacing="0.5">ROCKET</text>
                            
                            {/* Bengali "রকেট" in purple */}
                            <text x="15" y="78" fontFamily="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', sans-serif" fontWeight="900" fontSize="38" fill="#8c3494" letterSpacing="-1">রকেট</text>
                            
                            {/* Bengali Subtext "ডাচ-বাংলা ব্যাংক মোবাইল ব্যাংকিং" in purple */}
                            <text x="15" y="93" fontFamily="'Hind Siliguri', 'Kalpurush', 'Noto Sans Bengali', sans-serif" fontWeight="700" fontSize="8.5" fill="#8c3494" letterSpacing="-0.1">ডাচ-বাংলা ব্যাংক মোবাইল ব্যাংকিং</text>
                          </g>
                        </svg>
                      </div>
                      {paymentMethod === 'rocket' && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#8c3494] rounded-full shadow-sm ring-2 ring-white" />}
                      <span className="text-[10px] font-bold uppercase tracking-tight mt-1 text-[#8c3494]">Rocket</span>
                    </label>


                    <label className={cn(
                      "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all aspect-square md:aspect-auto md:h-24 group overflow-hidden bg-white",
                      paymentMethod === 'card' ? "border-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.1)]" : "border-slate-100 hover:border-slate-200"
                    )}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                      <div className="w-full h-12 flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 280 100" className="h-full w-auto object-contain transition-transform group-hover:scale-110 z-10 p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Mastercard Circles on the left */}
                          <g transform="translate(10, 0)">
                            <circle cx="45" cy="50" r="36" fill="#eb001b" />
                            <circle cx="85" cy="50" r="36" fill="#f79e1b" fillOpacity="0.85" />
                          </g>
                          
                          {/* Visa Wordmark on the right */}
                          <path 
                            fill="#254aa5" 
                            d="M189 366h36l22-139h-36zm149-136c-8-3-22-6-38-6-42 0-71 20-71 50 0 22 21 34 37 42 17 8 23 13 23 20 0 11-14 16-27 16-36 0-53-7-69-14l-10 44c13 5 36 10 59 10 44 0 73-20 73-52 0-18-11-31-37-42-16-8-26-13-26-21 0-7 8-15 25-15 15-1 26 3 34 6zm42 136h33l26-139h-30c-11 0-17 6-21 15l-48 124zm-225-139h-52c-10 0-16 5-19 13l-64 126h37l10-25h41l4 25zm-26 84l13-39c0-1 3-8 4-11l3 12 11 38zm251 55h32l16-95 18 95h31l29-139h-35l-14 77-18-77h-28l-15 75-12-75h-34z" 
                            transform="translate(205, 50) scale(0.34) translate(-256, -296.5)"
                          />
                        </svg>
                      </div>
                      {paymentMethod === 'card' && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-sm ring-2 ring-white" />}
                      <span className="text-[10px] font-bold uppercase tracking-tight mt-1 text-indigo-600">Card</span>
                    </label>



                    <label className={cn(
                      "relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all col-span-2 md:col-span-4 group",
                      paymentMethod === 'cod' ? "border-slate-900 bg-slate-50" : "border-slate-50 bg-white hover:border-slate-100"
                    )}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest leading-none">Cash on Delivery</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Pay when you receive the product</p>
                      </div>
                      {paymentMethod === 'cod' && <div className="ms-auto w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"/></div>}
                    </label>
                 </div>
              </div>


              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-1">
                <Link to="/collection" className="text-[10px] font-black tracking-[0.2em] text-slate-400 hover:text-indigo-600 uppercase transition-all flex items-center gap-2 group">
                   <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>
                <motion.button 
                  type="button" 
                  whileHover={{ scale: 1.02, backgroundColor: '#4338ca' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder} 
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-4.5 px-12 rounded-2xl text-[13px] font-black tracking-[0.1em] uppercase transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                >
                   Complete Order <ChevronRight size={18} />
                </motion.button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Lock size={12} className="text-indigo-600"/>
                <span>AES-256 BIT BANK-LEVEL SECURITY</span>
              </div>
            </form>
        </div>

        {/* Right Cart Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[420px] bg-white rounded-[40px] p-6 lg:p-10 border border-slate-100 shadow-[0_32px_64px_rgba(0,0,0,0.02)] relative h-max mt-10 lg:mt-0"
        >
           <h3 className="font-sans font-black text-2xl text-slate-900 mb-8 border-b border-slate-50 pb-4">Summary</h3>
           
           <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
             {cart.length === 0 ? (
               <div className="text-slate-400 text-sm py-4 font-bold text-center uppercase tracking-widest">Cart is Empty</div>
             ) : (
               cart.map((item) => (
                 <div key={item.id} className="flex gap-4 group relative bg-slate-50 p-4 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                    <div className="w-16 h-20 bg-white rounded-xl overflow-hidden relative border border-slate-100 shrink-0">
                       <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} />
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white shadow-lg text-[9px] font-black rounded-full flex items-center justify-center">
                         {item.quantity}
                       </div>
                    </div>
                    <div className="flex-1 flex flex-col py-1">
                       <div className="space-y-0.5">
                         <h4 className="font-sans font-black text-[13px] text-slate-900 line-clamp-1 leading-none">{item.name}</h4>
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest opacity-70">{item.category}</p>
                       </div>
                       <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-100">
                             <button 
                               type="button"
                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
                             >
                               -
                             </button>
                             <span className="text-[10px] font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                             <button 
                               type="button"
                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
                             >
                               +
                             </button>
                          </div>
                          <p className="font-sans font-black text-sm text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                          <button type="button" onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors ml-2">
                            <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))
             )}
           </div>

           <div className="border-t border-slate-50 pt-6 space-y-4 font-sans text-[13px]">
             <div className="flex justify-between text-slate-400">
               <span className="font-black uppercase tracking-widest text-[10px]">Subtotal</span>
               <span className="text-slate-900 font-black">${subtotal.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-slate-400">
               <span className="font-black uppercase tracking-widest text-[10px]">Shipping</span>
               {isFreeDelivery ? (
                 <span className="text-green-500 text-[10px] uppercase tracking-widest font-black">Free</span>
               ) : (
                 <span className="text-slate-900 font-black">$10.00</span>
               )}
             </div>
             <div className="flex justify-between text-slate-400">
               <span className="font-black uppercase tracking-widest text-[10px]">Estimated Tax</span>
               <span className="text-slate-900 font-black">${taxes.toLocaleString()}</span>
             </div>
           </div>

           <div className="border-t border-slate-50 mt-6 pt-6 flex justify-between items-end">
             <span className="font-black text-xl text-slate-900">Total</span>
             <div className="text-right flex items-baseline gap-2">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">USD</span>
                <span className="font-black text-4xl text-indigo-600">${total.toLocaleString()}</span>
             </div>
           </div>

           {isFreeDelivery && (
             <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
               <p className="text-[11px] text-green-600 font-black uppercase tracking-wider">🎉 Delivery Fee Waived (-$10.00)</p>
             </div>
           )}

           <div className="mt-8 bg-slate-50 border border-slate-100 p-5 rounded-3xl flex gap-4">
              <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                 Encrypted transaction protocol active. Satisfaction guaranteed with our 30-day return policy.
              </p>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
