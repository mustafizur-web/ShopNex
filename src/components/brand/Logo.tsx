import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const ShopNexLogo = ({ className = "", size = 48, animated = true }: LogoProps) => {
  return (
    <motion.svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : false}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <defs>
        <linearGradient id="shopnex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background X Shape (Purple Accents) */}
      <motion.path
        d="M25 75 L45 55 M75 25 L55 45"
        stroke="url(#shopnex-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : false}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="opacity-40"
      />

      {/* Main Converging Path */}
      <motion.path
        d="M20 20 C40 20 45 45 50 50 C45 55 40 80 20 80"
        stroke="url(#shopnex-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : false}
        transition={{ duration: 1 }}
      />

      {/* Arrow Stem and Head */}
      <motion.path
        d="M50 50 L80 50"
        stroke="url(#shopnex-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : false}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
      <motion.path
        d="M70 35 L85 50 L70 65"
        stroke="url(#shopnex-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animated ? { pathLength: 0, opacity: 0 } : false}
        animate={animated ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      
      {/* Visual X Completion */}
      <motion.path
        d="M75 75 L60 60"
        stroke="url(#shopnex-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={animated ? { pathLength: 1 } : false}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="opacity-60"
      />
    </motion.svg>
  );
};

export const ShopNexText = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center font-black ${className}`}>
    <span className="text-slate-900">Shop</span>
    <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Nex</span>
  </div>
);
