"use client";

import React from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  "TT", "CAMIONETAS", "SUV", "T1", "T3", "T4-T", 
  "UTV-T", "UTV-R", "RC2N", "RALLY 2 / R5", "PROTO"
];

export default function Marquee() {
  // Duplicamos el array para que el scroll infinito funcione sin saltos
  const items = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  return (
    <div className="w-full bg-gradient-to-r from-orange-700 via-rally-accent to-orange-700 border-y border-white/20 py-4 overflow-hidden relative flex items-center shadow-[0_0_30px_rgba(255,100,0,0.3)] z-20">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-orange-700 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-700 to-transparent z-10"></div>
      
      <motion.div 
        className="flex whitespace-nowrap gap-12 px-6 items-center"
        animate={{
          x: [0, -1035],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        }}
      >
        {items.map((cat, index) => (
          <div key={index} className="flex items-center gap-12">
            <span className="text-xl md:text-2xl font-black italic tracking-widest text-white drop-shadow-md uppercase">
              {cat}
            </span>
            {/* Divisor */}
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
