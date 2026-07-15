import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Loader2, 
  ArrowLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

import { ShopNexLogo, ShopNexText } from '../components/brand/Logo';

export default function Login() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();



  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = authMode === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ 
            email, 
            password,
            options: { data: { role: 'admin' } }
          });

      if (authError) {
        setError(authError.message.toUpperCase());
        setLoading(false);
        return;
      }

      if (data.user) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      setError("CONNECTION ERROR. PLEASE TRY AGAIN.");
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) setError(error.message.toUpperCase());
    } catch (err) {
      setError("GOOGLE AUTH FAILED.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-500/20">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          </div>
          <h2 className="text-[28px] font-black text-slate-900 mb-2">Authenticated</h2>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Launching Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 flex items-center justify-center p-4 md:p-8 lg:p-12 relative font-sans overflow-x-hidden">
      <div className="w-full max-w-[480px] relative z-10 flex flex-col items-center">
        
        <Link 
          to="/" 
          className="self-start inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-[#8b5cf6] hover:text-[#7c3aed] transition-all mb-6 group active:scale-95"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO STORE
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white border border-slate-100 p-6 md:p-7 rounded-[32px] md:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.03)] flex flex-col items-center relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8b5cf6]/5 blur-[64px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-400/5 blur-[64px] rounded-full" />

          <ShopNexLogo size={48} className="mb-5 md:mb-6" />
          
          <div className="text-center mb-6">
            <h1 className="text-[24px] font-black tracking-tight mb-1 flex flex-col items-center">
              <ShopNexText />
              <span className="text-slate-900 -mt-1">Member</span>
            </h1>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto opacity-80">
              Enter your credentials to access your store.
              <span className="text-[10px] text-[#8b5cf6] font-bold block mt-1.5 bg-[#8b5cf6]/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Demo Active: Any email & password works
              </span>
            </p>
          </div>

          <form onSubmit={handleAuth} className="w-full space-y-3.5">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1 group"
            >
              <label className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 px-1 group-focus-within:text-[#8b5cf6] transition-colors">EMAIL ADDRESS</label>
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-slate-100 rounded-xl md:rounded-[18px] px-5 py-3 md:py-3.5 outline-none focus:bg-white focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all text-sm font-bold placeholder:text-slate-300 hover:border-slate-200"
                  placeholder="hello@example.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-1 group"
            >
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 group-focus-within:text-[#8b5cf6] transition-colors">PASSWORD</label>
                <button type="button" className="text-[9px] font-black uppercase text-[#8b5cf6] hover:text-[#7c3aed] transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-slate-100 rounded-xl md:rounded-[18px] px-5 py-3 md:py-3.5 outline-none focus:bg-white focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all text-sm font-bold placeholder:text-slate-300 hover:border-slate-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 p-2.5 rounded-xl"
              >
                <p className="text-[9px] uppercase font-black text-red-500 text-center tracking-wider leading-relaxed">{error}</p>
              </motion.div>
            )}

            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl uppercase tracking-[0.2em] text-[13px] font-black shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 mt-1"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                 authMode === 'login' ? 'SIGN IN' : 'AUTHENTICATE'
              )}
            </motion.button>
          </form>

          <div className="w-full mt-6">
            <div className="relative flex items-center justify-center mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative bg-white px-4 text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">OR CONTINUE WITH</span>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full py-3.5 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.05em] shadow-sm hover:shadow-md transition-all active:scale-[0.98] border-slate-100/60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
              </svg>
              GOOGLE LOGIN
            </button>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-[9px] uppercase tracking-[0.1em] font-black text-slate-400 hover:text-[#8b5cf6] transition-all"
            >
              {authMode === 'login' ? "DON'T HAVE AN ACCOUNT? SIGN UP" : "ALREADY A MEMBER? SIGN IN"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

