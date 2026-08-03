import React from 'react';

export default function SafetyBanner() {
  return (
    <div className="w-full relative overflow-hidden shadow-2xl border-t-2 border-black/80 flex items-center h-8 bg-black">
      {/* Patrón de cinta realista roja y negra con efecto de textura/suciedad */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'repeating-linear-gradient(45deg, #0f0f0f, #0f0f0f 10px, #b91c1c 10px, #b91c1c 20px)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
        }}
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grunge-wall.png')] opacity-40 mix-blend-multiply pointer-events-none z-0" />
      
      {/* Contenedor oscuro central para que el texto sea legible */}
      <div className="absolute inset-y-[1px] inset-x-0 bg-black/80 z-10 border-y border-red-900/30 shadow-[inset_0_0_10px_rgba(0,0,0,1)]" />

      {/* Capa base para animación */}
      <div className="relative z-20 w-full h-full flex items-center overflow-hidden">
        
        {/* El texto desplazándose tipo LED Ticker */}
        <div className="animate-marquee whitespace-nowrap flex items-center w-max">
          {/* Triplicamos el contenido para garantizar que el loop infinito cubra toda la pantalla */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-6 px-6 shrink-0">
              
              <div className="flex items-center gap-2">
                <div className="text-red-600 animate-pulse drop-shadow-[0_0_5px_rgba(220,38,38,1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 3.06 1.7 5.72 4.22 7.08L7.5 20.5l2.25-1.5h4.5l2.25 1.5-0.72-3.42C18.3 15.72 20 13.06 20 10c0-4.42-3.58-8-8-8zm-2.5 9c-1.38 0-2.5-1.12-2.5-2.5S8.12 6 9.5 6s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm5 0c-1.38 0-2.5-1.12-2.5-2.5S13.12 6 14.5 6s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    <path d="M10.5 14h3v2h-3z" />
                  </svg>
                </div>
                <span className="text-red-500 font-black text-xs tracking-widest uppercase drop-shadow-md">
                  ADVERTENCIA: ZONA NO SEGURA
                </span>
              </div>

              <span className="text-gray-300 font-bold text-[10px] tracking-wide uppercase drop-shadow-sm">
                RESPETA LAS CINTAS DE SEGURIDAD. FUERON COLOCADAS PARA PROTEGER TU VIDA. BUSCA OTRO PUNTO DE OBSERVACIÓN.
              </span>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
