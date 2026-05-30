"use client";

import React, { useState, useCallback } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DashboardContainer from "@/components/layout/DashboardContainer";
import LiveDashboard from "@/components/dashboard/LiveDashboard";
import { LiveStatus } from '@/hooks/useLiveResults';

export default function Home() {
  const [status, setStatus] = useState<LiveStatus>('ACTUALIZANDO');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleStatusChange = useCallback((newStatus: LiveStatus, newLastUpdated: Date | null) => {
    setStatus(newStatus);
    setLastUpdated(newLastUpdated);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-rally-bg text-rally-text font-sans antialiased selection:bg-rally-accent/20 selection:text-rally-text">
      
      {/* El Header reacciona a los cambios de estado de la red enviados por LiveDashboard */}
      <Header status={status} lastUpdated={lastUpdated} />
      
      <DashboardContainer>
        {/* Aquí se monta toda la magia reactiva: fetching periódico, tabs, y filtrado */}
        <LiveDashboard onStatusChange={handleStatusChange} />
      </DashboardContainer>

      <Footer />
    </div>
  );
}
