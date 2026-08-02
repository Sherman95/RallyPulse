"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  '/carousel/slide1.jpg',
  '/carousel/slide2.webp',
  '/carousel/slide3.jpg',
  '/carousel/slide4.jpg',
  '/carousel/slide5.jpg'
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000); // 6 segundos por slide para disfrutar el efecto
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
      <AnimatePresence initial={true}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 10, ease: "linear" }
          }}
          className="absolute inset-0 z-0 origin-center"
        >
          <Image
            src={slides[currentIndex]}
            alt={`Rally slide ${currentIndex + 1}`}
            fill
            className="object-cover object-center"
            priority={true}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
