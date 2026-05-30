import React, { ReactNode } from 'react';

interface DashboardContainerProps {
  children: ReactNode;
}

export default function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <main className="flex-1 w-full flex flex-col bg-zinc-950">
      {/* 
        Contenedor centralizado para maximizar legibilidad en pantallas grandes 
        y aprovechar todo el espacio en pantallas móviles.
      */}
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 sm:py-8 flex-1 flex flex-col">
        {children}
      </div>
    </main>
  );
}
