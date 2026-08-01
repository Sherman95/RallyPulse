"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
    }, 5000); // Cambia de imagen cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <Image
            src={slide}
            alt={`Rally slide ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
