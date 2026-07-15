import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  img: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  paymentMethod?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  orders: Order[];
  placeOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: string) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  customers: Customer[];
  animation: 'cart' | 'order' | null;
  showAnimation: (type: 'cart' | 'order' | null) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  // Electronics
  { id: 'e1', name: 'MacBook Pro 14" M3', category: 'Electronics', price: '$1,999.00', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', description: 'Experience pure performance with the M3 chip. Built for creators and pros.' },
  { id: 'e2', name: 'iPhone 15 Pro Max', category: 'Electronics', price: '$1,199.00', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800', description: 'The first iPhone with an aerospace-grade titanium design. Powered by the A17 Pro chip.' },
  { id: 'e3', name: 'Sony WH-1000XM5', category: 'Electronics', price: '$399.00', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800', description: 'Industry-leading noise canceling headphones with exceptional sound quality.' },
  { id: 'e4', name: 'iPad Pro 12.9" M2', category: 'Electronics', price: '$1,099.00', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', description: 'Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity.' },
  { id: 'e5', name: 'Samsung S24 Ultra', category: 'Electronics', price: '$1,299.00', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800', description: 'The ultimate Galaxy Ultra experience. With Galaxy AI, take your productivity to the next level.' },
  { id: 'e6', name: 'AirPods Pro (2nd Gen)', category: 'Electronics', price: '$249.00', img: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&q=80&w=800', description: 'Rebuilt from the sound up. Advanced active noise cancellation and personalized spatial audio.' },
  { id: 'e7', name: 'Apple Watch Ultra 2', category: 'Electronics', price: '$799.00', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800', description: 'The most rugged and capable Apple Watch. Designed for endurance, exploration, and adventure.' },
  { id: 'e8', name: 'Canon EOS R6 Mark II', category: 'Electronics', price: '$2,499.00', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', description: 'Master full-frame video and stills. High-speed performance meets professional-grade quality.' },
  { id: 'e9', name: 'Bose QuietComfort Ultra', category: 'Electronics', price: '$429.00', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800', description: 'Breakthrough spatialized audio for more immersive listening. World-class quiet.' },
  { id: 'e10', name: 'Nintendo Switch OLED', category: 'Electronics', price: '$349.00', img: 'https://images.unsplash.com/photo-1627843563095-f6e94676cfe0?auto=format&fit=crop&q=80&w=800', description: 'Vibrant 7-inch OLED screen. Play at home on the TV or on-the-go.' },

  // Fashion
  { id: 'f1', name: 'Essential Oversized Tee', category: 'Fashion', price: '$45.00', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', description: 'Crafted from premium heavyweight cotton for the perfect drape and comfort.' },
  { id: 'f2', name: 'Premium Raw Denim', category: 'Fashion', price: '$120.00', img: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800', description: 'Japanese selvedge denim that ages beautifully with time. Slim-straight fit.' },
  { id: 'f3', name: 'Minimalist Leather Sneakers', category: 'Fashion', price: '$180.00', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800', description: 'Handcrafted in Italy using top-grain calf leather. Timeless silhouette.' },
  { id: 'f4', name: 'Linen Classic Shirt', category: 'Fashion', price: '$75.00', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800', description: 'Breathable European linen for effortless style in warm weather.' },
  { id: 'f5', name: 'Trench Coat Khaki', category: 'Fashion', price: '$250.00', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', description: 'A timeless layering piece featuring water-resistant gabardine and horn buttons.' },
  { id: 'f6', name: 'Slim Fit Chinos', category: 'Fashion', price: '$65.00', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800', description: 'Tailored from soft, stretch-infused cotton for all-day comfort.' },
  { id: 'f7', name: 'Wrap Dress Floral', category: 'Fashion', price: '$95.00', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800', description: 'Featuring a feminine floral print and an adjustable waist for the perfect fit.' },
  { id: 'f8', name: 'Cashmere Crewneck Sweater', category: 'Fashion', price: '$150.00', img: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&q=80&w=800', description: '100% Grade A Mongolian cashmere. Incredibly soft and lightweight.' },
  { id: 'f9', name: 'Chelsea Boots Leather', category: 'Fashion', price: '$190.00', img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=800', description: 'Classic design with elasticated sides and a premium pull-up leather finish.' },
  { id: 'f10', name: 'Oversized Hoodie Premium', category: 'Fashion', price: '$85.00', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', description: 'Heavyweight loopback terry with a relaxed drop-shoulder fit.' },

  // Home & Living
  { id: 'h1', name: 'Ceramic Pour-Over Set', category: 'Home & Living', price: '$65.00', img: 'https://images.unsplash.com/photo-1544787210-2213d84ad960?auto=format&fit=crop&q=80&w=800', description: 'Artisan-made ceramic set for the perfect morning brew. Minimalist design.' },
  { id: 'h2', name: 'Organic Cotton Bedding', category: 'Home & Living', price: '$145.00', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800', description: 'Woven from 100% long-staple organic cotton for a crisp, cool feel.' },
  { id: 'h3', name: 'Scented Soy Candle', category: 'Home & Living', price: '$35.00', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', description: 'Hand-poured candle with notes of sandalwood and cedar. 50+ hour burn time.' },
  { id: 'h4', name: 'Adjustable Desk Lamp', category: 'Home & Living', price: '$85.00', img: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800', description: 'Modern task lighting with adjustable arm and warm LED illumination.' },
  { id: 'h5', name: 'Velvet Throw Pillow', category: 'Home & Living', price: '$40.00', img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800', description: 'Luxurious velvet pillow with feather-down insert for ultimate comfort.' },
  { id: 'h6', name: 'Modern Ceramic Vases', category: 'Home & Living', price: '$55.00', img: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800', description: 'Set of three matte-finished ceramic vases for a contemporary touch.' },
  { id: 'h7', name: 'Wool Area Rug (5x7)', category: 'Home & Living', price: '$450.00', img: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&q=80&w=800', description: 'Hand-tufted 100% wool rug with a subtle geometric pattern.' },
  { id: 'h8', name: 'Smart Desktop Fan', category: 'Home & Living', price: '$75.00', img: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800', description: 'Silent brushless motor with app-controlled speed settings and timers.' },
  { id: 'h9', name: 'Abstract Wall Art', category: 'Home & Living', price: '$120.00', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800', description: 'Framed abstract print on archival paper. Add color and character to any wall.' },
  { id: 'h10', name: 'Bamboo Bath Tray', category: 'Home & Living', price: '$45.00', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', description: 'Expandable bamboo tray with tablet holder and wine glass slot for the ultimate bath.' },

  // Beauty
  { id: 'b1', name: 'Hydrating Face Serum', category: 'Beauty', price: '$48.00', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800', description: 'Multi-molecular hyaluronic acid serum for deep and lasting hydration.' },
  { id: 'b2', name: 'Mineral Sunscreen SPF 50', category: 'Beauty', price: '$32.00', img: 'https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?auto=format&fit=crop&q=80&w=800', description: 'Sheer, lightweight mineral protection that blends easily on all skin tones.' },
  { id: 'b3', name: 'Matte Lipstick Trio', category: 'Beauty', price: '$55.00', img: 'https://images.unsplash.com/photo-1586776977402-255513bf69b5?auto=format&fit=crop&q=80&w=800', description: 'Three essential shades with a creamy, non-drying matte finish.' },
  { id: 'b4', name: 'Botanical Face Oil', category: 'Beauty', price: '$60.00', img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800', description: 'A blend of rare botanical extracts to nourish and brighten the complexion.' },
  { id: 'b5', name: 'Rosewater Toning Mist', category: 'Beauty', price: '$24.00', img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800', description: 'Refreshing facial mist made with pure steam-distilled Bulgarian Rose petals.' },
  { id: 'b6', name: 'Vitamin C Glow Serum', category: 'Beauty', price: '$52.00', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800', description: 'Powerful antioxidant serum to brighten skin and reduce visible dark spots.' },
  { id: 'b7', name: 'Jelly Cleanser Gentle', category: 'Beauty', price: '$22.00', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800', description: 'pH-balanced jelly cleanser that removes impurities without stripping the skin.' },
  { id: 'b8', name: 'Silk Sleep Mask', category: 'Beauty', price: '$35.00', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800', description: '100% mulberry silk sleep mask to protect the delicate eye area while you sleep.' },
  { id: 'b9', name: 'Exfoliating Coffee Scrub', category: 'Beauty', price: '$18.00', img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800', description: 'Invigorating body scrub made with organic coffee grounds and cold-pressed oils.' },
  { id: 'b10', name: 'Whipped Body Butter', category: 'Beauty', price: '$28.00', img: 'https://images.unsplash.com/photo-1592338573210-9111c6d3bc85?auto=format&fit=crop&q=80&w=800', description: 'Rich, airy body butter that melts into the skin for intense 24-hour hydration.' },

  // Gadgets
  { id: 'g1', name: 'Mechanical Keypad', category: 'Gadgets', price: '$125.00', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800', description: 'Hot-swappable tactile switches with customizable RGB lighting.' },
  { id: 'g2', name: 'Portable SSD 2TB', category: 'Gadgets', price: '$199.00', img: 'https://images.unsplash.com/photo-1597740985671-25d1fe9cf081?auto=format&fit=crop&q=80&w=800', description: 'Lightning-fast external storage in a rugged, pocket-sized aluminum body.' },
  { id: 'g3', name: 'Smart Home Hub', category: 'Gadgets', price: '$149.00', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800', description: 'Control your entire home with voice commands and intuitive automation.' },
  { id: 'g4', name: 'Wireless Charging Dock', category: 'Gadgets', price: '$79.00', img: 'https://images.unsplash.com/photo-1586816824338-95889396f9a0?auto=format&fit=crop&q=80&w=800', description: 'Charge your phone, watch, and earbuds simultaneously with fast-charging technology.' },
  { id: 'g5', name: 'Noise-Masking Earbuds', category: 'Gadgets', price: '$249.00', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', description: 'Designed specifically for sleep, these tiny buds mask noise with soothing sounds.' },
  { id: 'g6', name: 'Folding Drone 4K', category: 'Gadgets', price: '$599.00', img: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=800', description: 'Ultra-portable 4K camera drone with GPS-assisted flight and intelligent follow.' },
  { id: 'g7', name: 'Smart Reusable Notebook', category: 'Gadgets', price: '$35.00', img: 'https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?auto=format&fit=crop&q=80&w=800', description: 'Endlessly reusable notebook that connects to your favorite cloud services.' },
  { id: 'g8', name: 'UV Phone Sanitizer', category: 'Gadgets', price: '$65.00', img: 'https://images.unsplash.com/photo-1614030424754-24d9e96e484c?auto=format&fit=crop&q=80&w=800', description: 'Eliminate 99.9% of bacteria on your device while it charges wirelessly.' },
  { id: 'g9', name: 'Pocket Retro Console', category: 'Gadgets', price: '$89.00', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', description: 'Pre-loaded with 500 classic games. Perfect for retro gaming enthusiasts.' },
  { id: 'g10', name: 'Electric Milk Frother Smart', category: 'Gadgets', price: '$45.00', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800', description: 'Create barista-quality foam for your lattes and cappuccinos in seconds.' },

  // Sports
  { id: 's1', name: 'Professional Yoga Mat', category: 'Sports', price: '$85.00', img: 'https://images.unsplash.com/photo-1592431690279-bb7599cb9789?auto=format&fit=crop&q=80&w=800', description: 'Eco-friendly, non-slip yoga mat with dense cushioning for joint support.' },
  { id: 's2', name: 'Adjustable Dumbbells', category: 'Sports', price: '$299.00', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800', description: 'Save space with a full weight set in a single pair of adjustable bells.' },
  { id: 's3', name: 'Hydration Vest 5L', category: 'Sports', price: '$110.00', img: 'https://images.unsplash.com/photo-1551834961-11961f362ed2?auto=format&fit=crop&q=80&w=800', description: 'Lightweight trail running vest with dual flasks and storage for essentials.' },
  { id: 's4', name: 'Bluetooth Jump Rope', category: 'Sports', price: '$55.00', img: 'https://images.unsplash.com/photo-1593976861512-1741253a6f3e?auto=format&fit=crop&q=80&w=800', description: 'Track your jumps, time, and calories burned with the integrated app.' },
  { id: 's5', name: 'Pickleball Paddle Set', category: 'Sports', price: '$140.00', img: 'https://images.unsplash.com/photo-1626245917164-4ad54c31d7ec?auto=format&fit=crop&q=80&w=800', description: 'Professional-grade carbon fiber paddles for power and control. Set of 2.' },
  { id: 's6', name: 'Massage Gun Pro', category: 'Sports', price: '$180.00', img: 'https://images.unsplash.com/photo-1591572648574-8899881075ba?auto=format&fit=crop&q=80&w=800', description: 'Deep tissue percussion therapy to accelerate muscle recovery and relieve tension.' },
  { id: 's7', name: 'Speed Skipping Rope', category: 'Sports', price: '$25.00', img: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?auto=format&fit=crop&q=80&w=800', description: 'Tangle-free steel cable with ball-bearing handles for maximum speed.' },
  { id: 's8', name: 'Resistance Bands Set', category: 'Sports', price: '$35.00', img: 'https://images.unsplash.com/photo-1598289431512-b97b0917a63e?auto=format&fit=crop&q=80&w=800', description: 'Set of 5 natural latex bands with varying resistance levels for full-body workouts.' },
  { id: 's9', name: 'Lightweight Running Shorts', category: 'Sports', price: '$40.00', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800', description: 'Moisture-wicking, quick-dry fabric with built-in liner and zipper pocket.' },
  { id: 's10', name: 'Compact Home Rower', category: 'Sports', price: '$350.00', img: 'https://images.unsplash.com/photo-1594737625785-a2bad9931c60?auto=format&fit=crop&q=80&w=800', description: 'Efficient full-body workout with magnetic resistance and folding space-saving design.' },

];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopnex-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopnex-wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopnex-orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shopnex-products');
    if (!saved) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(saved);
    
    // Merge: Keep custom added products but ensure all INITIAL_PRODUCTS are present
    // Also, ensure any updated fields (e.g., fixed images or info) in INITIAL_PRODUCTS
    // are synced to the products list.
    const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
    const combined = parsed.map((p: any) => {
      const initial = initialMap.get(p.id);
      if (initial) {
        // Overwrite static fields with updated INITIAL_PRODUCTS values, keeping potential runtime user adjustments
        return { ...p, ...initial };
      }
      return p;
    });

    const combinedIds = new Set(combined.map((p: any) => p.id));
    INITIAL_PRODUCTS.forEach(p => {
      if (!combinedIds.has(p.id)) {
        combined.push(p);
      }
    });

    return combined;
  });
  const [animation, setAnimation] = useState<'cart' | 'order' | null>(null);

  useEffect(() => {
    localStorage.setItem('shopnex-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopnex-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopnex-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopnex-products', JSON.stringify(products));
  }, [products]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQuantity = (id: string, qty: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const showAnimation = (type: 'cart' | 'order' | null) => {
    setAnimation(type);
  };

  // Derive customers from orders
  const customers: Customer[] = orders.reduce((acc: Customer[], order) => {
    const email = order.customerEmail || 'unknown@example.com';
    const name = order.customerName || 'Anonymous';
    
    // Use email as unique identifier for customer
    const existing = acc.find(c => c.email === email);
    
    if (existing) {
      existing.orders += 1;
      existing.totalSpent += order.total;
      // Update last order date if this order is newer
      if (new Date(order.date) > new Date(existing.lastOrder)) {
        existing.lastOrder = order.date;
      }
    } else {
      acc.push({
        id: `cust_${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        email: email,
        orders: 1,
        totalSpent: order.total,
        lastOrder: order.date
      });
    }
    return acc;
  }, []);

  return (
    <AppContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      wishlist, toggleWishlist, orders, placeOrder, deleteOrder, updateOrderStatus,
      products, addProduct, updateProduct, deleteProduct, customers,
      animation, showAnimation 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
