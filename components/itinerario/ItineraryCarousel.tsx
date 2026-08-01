"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Flyer {
  src: string;
  alt: string;
  label?: string;
  desc?: string;
}

interface ItineraryCarouselProps {
  flyers: Flyer[];
}

export default function ItineraryCarousel({ flyers }: ItineraryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < flyers.length - 1 ? prev + 1 : prev));
  }, [flyers.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed && e.key === 'Escape') setIsZoomed(false);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isZoomed]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 animate-in fade-in duration-700">
      
      {/* Lightbox Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
            aria-label="Cerrar zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image 
              src={flyers[currentIndex].src} 
              alt={flyers[currentIndex].alt} 
              fill
              className="object-contain animate-in zoom-in duration-300"
            />
          </div>
        </div>
      )}

      {/* Main Carousel Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] bg-rally-surface2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-rally-border group">
        
        {/* Blurred Backgrounds for premium effect */}
        {flyers.map((flyer, idx) => (
          <div 
            key={`blur-${idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
              idx === currentIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <Image 
              src={flyer.src} 
              alt="" 
              fill 
              className="object-cover scale-110 blur-2xl saturate-150" 
              priority={idx === 0}
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 z-10 pointer-events-none" />

        {/* Crisp Foreground Images with cross-fade */}
        {flyers.map((flyer, idx) => (
          <div 
            key={`img-${idx}`}
            onClick={() => { if (idx === currentIndex) setIsZoomed(true); }}
            className={`absolute inset-0 transition-all duration-700 ease-in-out z-20 flex items-center justify-center p-4 sm:p-8 cursor-zoom-in ${
              idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full drop-shadow-2xl">
              <Image 
                src={flyer.src} 
                alt={flyer.alt} 
                fill
                className="object-contain"
                priority={idx === 0}
              />
            </div>
          </div>
        ))}

        {/* Hover Navigation Controls */}
        <button 
          onClick={goPrev} 
          disabled={currentIndex === 0}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/20 hover:bg-rally-accent backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={goNext} 
          disabled={currentIndex === flyers.length - 1}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/20 hover:bg-rally-accent backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Info Overlay (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 z-30 flex justify-between items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
          <div>
            <span className="px-2.5 py-0.5 bg-rally-accent/90 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 inline-block backdrop-blur-sm shadow-[0_0_10px_rgba(255,100,0,0.5)]">
              Etapa {currentIndex} de {flyers.length - 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-lg tracking-tight mb-0.5">
              {flyers[currentIndex].label || flyers[currentIndex].alt}
            </h2>
            {flyers[currentIndex].desc && (
              <p className="text-gray-300 font-medium text-xs sm:text-sm drop-shadow-md max-w-xl">
                {flyers[currentIndex].desc}
              </p>
            )}
          </div>
        </div>

        {/* Touch zones for mobile (invisible) */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-[25] sm:hidden" onClick={goPrev} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-[25] sm:hidden" onClick={goNext} />
      </div>

      {/* Thumbnails Track */}
      <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1 mt-4">
        {flyers.map((flyer, idx) => (
          <button
            key={`thumb-${idx}`}
            onClick={() => setCurrentIndex(idx)}
            className="group flex flex-col items-center gap-2 shrink-0 snap-center focus:outline-none"
          >
            <div className={`relative h-16 w-24 sm:h-20 sm:w-32 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
              idx === currentIndex 
                ? 'border-rally-accent ring-4 ring-rally-accent/20 scale-100 opacity-100 shadow-lg' 
                : 'border-transparent opacity-50 group-hover:opacity-100 scale-95 group-hover:scale-100'
            }`}>
              <Image 
                src={flyer.src} 
                alt={`Thumbnail ${idx}`} 
                fill 
                className="object-cover" 
              />
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-rally-accent/10" />
              )}
            </div>
            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
              idx === currentIndex ? 'text-rally-accent' : 'text-rally-muted group-hover:text-rally-txt'
            }`}>
              {flyer.label || flyer.alt.replace('Flyer ', '')}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
