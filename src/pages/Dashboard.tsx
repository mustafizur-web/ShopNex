import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Users, 
  Settings, 
  LayoutDashboard, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  HelpCircle, 
  LogOut,
  Mail,
  Lock,
  Loader2,
  X,
  CreditCard,
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronRight,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShoppingCart,
  Home,
  Edit2,
  Trash2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShopNexLogo, ShopNexText } from '../components/brand/Logo';
import { useAppContext } from '../lib/store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();
  const { cart, orders, products, addProduct, updateProduct, deleteProduct, deleteOrder, updateOrderStatus, customers } = useAppContext();

  // Add Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Electronics', price: '', img: '', description: '' });

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Order Received', desc: 'Order #SN-9283 just landed.', time: '2 mins ago', unread: true },
    { id: '2', title: 'Inventory Alert', desc: 'MacBook Pro stock is running low.', time: '1 hour ago', unread: true },
    { id: '3', title: 'System Propagation', desc: 'Global nodes synchronized successfully.', time: '5 hours ago', unread: false },
  ]);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate('/login');
    });

    // Simulate Initialization Sequence
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2500);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    } else {
      setUser(session.user);
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    addProduct({
      id: Math.random().toString(36).substr(2, 9),
      ...newProduct
    });
    toast.success('Entity propagated successfully');
    setNewProduct({ name: '', category: 'Electronics', price: '', img: '', description: '' });
    setShowAddProduct(false);
    
    // Add notification
    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Product Added',
      desc: `${newProduct.name} has been added to inventory.`,
      time: 'Just now',
      unread: true
    }, ...prev]);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) return;
    
    updateProduct(editingProduct);
    setShowEditProduct(false);
    setEditingProduct(null);

    setNotifications(prev => [{
      id: Date.now().toString(),
      title: 'Product Updated',
      desc: `${editingProduct.name} has been modified.`,
      time: 'Just now',
      unread: true
    }, ...prev]);
  };

  // Calculate Real-time metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalSalesCount = orders.length;

  if (loading || isInitializing) {
     // ... (keep same loading screen)
  }

  const renderDashboard = () => (
    <div className="space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Live Insights</h2>
          <p className="text-sm font-bold text-slate-400">Real-time status of your store operations.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white px-6 py-3 rounded-xl border border-slate-200 font-black text-xs text-slate-600 shadow-sm hover:shadow-md transition-all">
            Last 24 Hours
          </button>
        </div>
      </motion.div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Sales', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', color: '#6366f1', icon: CreditCard, count: totalSalesCount },
          { label: 'Cart Status', value: activeCartItems > 0 ? `${activeCartItems} Items` : 'Empty', change: '+8.2%', color: '#8b5cf6', icon: ShoppingCart, count: activeCartItems },
          { label: 'Customer Pulse', value: `${customers.length}`, change: '+15.2%', color: '#10b981', icon: Users },
          { label: 'Fulfillment Rate', value: '98%', change: '+5.1%', color: '#f59e0b', icon: Truck },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", i === 0 ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400")}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black px-3 py-1 bg-green-50 text-green-600 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{stat.value}</h3>
            <p className="text-[10px] font-bold text-slate-400">Updated just now</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sales Area Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-[400px]">
           <h4 className="text-2xl font-black text-slate-900 mb-8">Revenue Analytics</h4>
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={orders.slice(0, 10).reverse().map((o, idx) => ({ name: o.date, value: o.total }))}>
               <defs>
                 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                 itemStyle={{ fontSize: '12px', fontWeight: 800, color: '#6366f1' }}
               />
               <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>

        {/* Categories Pie Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-[400px]">
          <h4 className="text-2xl font-black text-slate-900 mb-8">Orders by Category</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={(() => {
                  const data = Object.entries(
                    orders.flatMap(o => o.items).reduce((acc, item) => {
                      acc[item.category] = (acc[item.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([name, value]) => ({ name, value }));
                  return data.length > 0 ? data : [{ name: 'No Orders', value: 1 }];
                })()}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                 {['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b'].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                 itemStyle={{ fontSize: '10px', fontBlack: '900', textTransform: 'uppercase' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Inventory Management</h2>
          <p className="text-sm font-bold text-slate-400">Total {products.length} products in catalog.</p>
        </div>
        <button 
          onClick={() => setShowAddProduct(true)}
          className="bg-[#6366f1] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/30 flex items-center gap-3"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Product</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Price</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={p.img} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-black text-slate-900">{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">SKU: {p.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="p-1.5 px-3 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase">{p.category}</span>
                </td>
                <td className="p-6 font-black text-slate-900">{p.price}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingProduct(p);
                        setShowEditProduct(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProduct(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900">Add New Product</h3>
                  <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Name</label>
                       <input 
                         required
                         type="text" 
                         value={newProduct.name}
                         onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                       <select 
                         value={newProduct.category}
                         onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                       >
                         {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Gadgets', 'Sports'].map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price</label>
                       <input 
                         required
                         type="text" 
                         placeholder="$0.00"
                         value={newProduct.price}
                         onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                       />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Image URL</label>
                        <input 
                          required
                          type="text" 
                          placeholder="https://..."
                          value={newProduct.img}
                          onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                        <textarea 
                          rows={3}
                          placeholder="Propagate product details..."
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner resize-none"
                        />
                    </div>
                  </div>
                  <button className="w-full bg-[#6366f1] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 mt-4 transition-all hover:bg-indigo-700">
                    Propagate Product
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditProduct && editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProduct(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900">Modify Entity</h3>
                  <button onClick={() => setShowEditProduct(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleEditProduct} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Name</label>
                       <input 
                         required
                         type="text" 
                         value={editingProduct.name}
                         onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                       <select 
                         value={editingProduct.category}
                         onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                       >
                         {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Gadgets', 'Sports'].map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price</label>
                       <input 
                         required
                         type="text" 
                         value={editingProduct.price}
                         onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                       />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Image URL</label>
                        <input 
                          required
                          type="text" 
                          value={editingProduct.img}
                          onChange={(e) => setEditingProduct({...editingProduct, img: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner"
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                        <textarea 
                          rows={3}
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner resize-none"
                        />
                    </div>
                  </div>
                  <button className="w-full bg-[#6366f1] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 mt-4 transition-all hover:bg-indigo-700">
                    Update Entity
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Order Vault</h2>
        <p className="text-sm font-bold text-slate-400">Viewing all {orders.length} transactions.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Customer</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Delivery Info</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Total</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-6 font-black text-slate-900 small-caps">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-700">{o.customerName || 'Guest'}</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">{o.customerEmail || 'No Email'}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-600 line-clamp-1">{o.address || 'N/A'}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{o.city || 'N/A'} {o.postalCode && `(${o.postalCode})`}</span>
                  </div>
                </td>
                <td className="p-6">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <CreditCard size={14} />
                     </div>
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{o.paymentMethod || 'COD'}</span>
                   </div>
                </td>
                <td className="p-6 font-black text-[#6366f1]">${o.total.toFixed(2)}</td>
                <td className="p-6">
                  <span className="p-1 px-3 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                    {o.status}
                  </span>
                </td>
                <td className="p-6 text-xs font-bold text-slate-400">
                  {new Date(o.date).toLocaleDateString()}
                  <br />
                  <span className="text-[9px] text-slate-300 font-medium">
                    {new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td className="p-6 text-xs font-bold text-slate-400">
                  {o.status === 'Delivered' ? (
                    <div className="flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-widest bg-green-50/20 px-3 py-1.5 rounded-xl w-max">
                      <CheckCircle2 size={14} className="text-green-600" />
                      Delivered
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        updateOrderStatus(o.id, 'Delivered');
                        toast.success('Order status updated to Delivered');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      <CheckCircle2 size={14} />
                      Deliver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Customer Universe</h2>
        <p className="text-sm font-bold text-slate-400">Managing {customers.length} unique identities.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identifier</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Orders</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Lifetime Value</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{c.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-black text-slate-900">{c.orders}</td>
                <td className="p-6 font-black text-[#10b981]">${c.totalSpent.toFixed(2)}</td>
                <td className="p-6 text-xs font-bold text-slate-400">{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Neural Analytics</h2>
        <p className="text-sm font-bold text-slate-400">Deep behavioral insights for your ecosystem.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-[400px]">
           <h4 className="text-2xl font-black text-slate-900 mb-8">Sales Velocity</h4>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={[{ name: 'Mon', v: 400 }, { name: 'Tue', v: 300 }, { name: 'Wed', v: 600 }, { name: 'Thu', v: 800 }, { name: 'Fri', v: 500 }, { name: 'Sat', v: 900 }, { name: 'Sun', v: 700 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="v" fill="#6366f1" radius={[10, 10, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-[400px]">
           <h4 className="text-2xl font-black text-slate-900 mb-8">Conversion Funnel</h4>
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={[{ name: 'Oct', v: 2400 }, { name: 'Nov', v: 1398 }, { name: 'Dec', v: 9800 }, { name: 'Jan', v: 3908 }]}>
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="#8b5cf630" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">System Config</h2>
        <p className="text-sm font-bold text-slate-400">Core parameters for your administration node.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
           <h4 className="text-xl font-black text-slate-900">Profile Architecture</h4>
           <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="w-20 h-20 rounded-[28px] bg-slate-100 ring-4 ring-slate-50 flex items-center justify-center">
                  <ShopNexLogo size={40} animated={false} />
               </div>
               <div>
                 <p className="font-black text-slate-900">Admin Entity</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.email}</p>
                 <button className="text-[10px] font-black text-[#6366f1] uppercase mt-2 hover:underline">Change Identity</button>
               </div>
             </div>
             <div className="h-[1px] bg-slate-50" />
             <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Public Username</label>
               <input type="text" value="Super Admin" readOnly className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner outline-none" />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Emergency Email</label>
               <input type="email" value={user?.email || ''} readOnly className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold shadow-inner outline-none" />
             </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
           <h4 className="text-xl font-black text-slate-900">Store Dynamics</h4>
           <div className="space-y-6">
             {[
               { label: 'Cloud Propagation', desc: 'Auto-sync inventory across nodes', enabled: true },
               { label: 'Neural Marketing', desc: 'AI-driven product recommendations', enabled: false },
               { label: 'Instant Fulfillment', desc: 'Skip verification for trusted entities', enabled: true },
             ].map((s, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div>
                   <p className="font-black text-slate-900 text-sm">{s.label}</p>
                   <p className="text-[10px] font-bold text-slate-400 leading-none">{s.desc}</p>
                 </div>
                 <div className={cn("w-12 h-6 rounded-full p-1 transition-colors relative", s.enabled ? "bg-[#6366f1]" : "bg-slate-200")}>
                    <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", s.enabled ? "translate-x-6" : "translate-x-0")} />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderDashboard();
      case 'Products': return renderProducts();
      case 'Orders': return renderOrders();
      case 'Customers': return renderCustomers();
      case 'Analytics': return renderAnalytics();
      case 'Settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen bg-[#f8f9fc] text-slate-800 flex font-sans overflow-hidden"
    >
      {/* Sidebar */}
      <aside className="w-[300px] h-full bg-white border-r border-slate-200 flex flex-col z-50">
        <div className="p-8 h-full flex flex-col">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-10">
              <ShopNexLogo size={40} animated={false} />
              <div>
                <ShopNexText className="text-lg" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin Console</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 font-bold -mx-2 px-2">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all group text-indigo-600 bg-indigo-50 hover:bg-indigo-100 mb-4"
            >
              <Home className="w-5 h-5 text-indigo-600" />
              Go to Store
            </motion.button>
            <div className="h-[1px] bg-slate-100 my-4" />
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Products', icon: Package },
              { name: 'Orders', icon: BarChart3 },
              { name: 'Customers', icon: Users },
              { name: 'Analytics', icon: PieChartIcon },
              { name: 'Settings', icon: Settings },
            ].map((item) => (
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(item.name)}
                key={item.name}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all group",
                  activeTab === item.name 
                    ? "bg-[#6366f1] text-white shadow-xl shadow-indigo-500/30" 
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.name ? "text-white" : "opacity-60")} />
                {item.name}
              </motion.button>
            ))}
          </nav>

          <div className="flex-shrink-0 mt-6 space-y-4 pt-6 border-t border-slate-100">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab('Products'); setShowAddProduct(true); }}
              className="w-full bg-[#f1f5f9] text-slate-900 py-5 rounded-3xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200"
            >
              <Plus size={18} />
              Quick Propagate
            </motion.button>
            
            <div className="h-[1px] bg-slate-100" />
            
            <div className="flex items-center justify-between group p-2">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-[22px] bg-white border border-slate-200 overflow-hidden ring-4 ring-slate-50 flex items-center justify-center">
                  <ShopNexLogo size={32} animated={false} />
                </div>
                <div className="group-hover:translate-x-1 transition-transform truncate max-w-[140px]">
                  <p className="text-[11px] font-black uppercase text-slate-900 truncate">Admin Entity</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{user?.email || 'Super Admin'}</p>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#f8f9fc]">
        {/* Header */}
        <header className="h-24 bg-white/40 backdrop-blur-3xl border-b border-slate-100 px-12 flex items-center sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{activeTab}</span>
            <ChevronRight size={14} className="text-slate-200" />
            <span className="text-xl font-black text-slate-900">Console Hub</span>
          </div>

          <div className="ml-auto flex items-center gap-8">
            <div className="flex items-center gap-2 bg-white/80 p-2 rounded-2xl border border-slate-50">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder={`Query ${activeTab.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent pl-12 pr-6 py-2.5 font-bold text-xs outline-none w-64 text-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.button 
                  whileHover={{ y: -2 }} 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 transition-all shadow-sm"
                >
                  <Bell size={18} />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full ring-4 ring-white" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] border border-slate-100 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">Incoming Event Stream</h4>
                          <button 
                            onClick={() => setNotifications(prev => prev.map(n => ({...n, unread: false})))}
                            className="text-[9px] font-black text-indigo-600 uppercase hover:underline"
                          >
                            Mark All Read
                          </button>
                        </div>
                        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                              <p className="text-xs font-bold text-slate-400">Stream empty.</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className={cn("p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer relative", n.unread && "bg-indigo-50/20")}>
                                {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                                <p className="text-[11px] font-black text-slate-900 mb-1">{n.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 leading-tight mb-2">{n.desc}</p>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{n.time}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-4 bg-slate-50/50 text-center">
                          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                            View All Logs
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <motion.button whileHover={{ y: -2 }} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 transition-all shadow-sm">
                <Moon size={18} />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Grid */}
        <div className="p-12 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </motion.div>
  );
}

