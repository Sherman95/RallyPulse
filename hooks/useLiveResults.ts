import { useState, useEffect, useCallback } from 'react';
import { EnrichedProcessedResults } from '@/lib/mergeDrivers';

export type LiveStatus = 'CULMINADO' | 'LIVE' | 'ACTUALIZANDO' | 'ERROR TEMPORAL';

export function useLiveResults() {
  const [data, setData] = useState<EnrichedProcessedResults | null>(null);
  const [status, setStatus] = useState<LiveStatus>('ACTUALIZANDO');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const fetchResults = useCallback(async (silent = false) => {
    try {
      if (!isFirstLoad && !silent) {
        setStatus('ACTUALIZANDO');
      }

      const res = await fetch('/api/results');
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      const jsonData: EnrichedProcessedResults = await res.json();
      
      setData(jsonData);
      setLastUpdated(new Date());
      setStatus('LIVE');
    } catch (error) {
      console.error('Error in useLiveResults:', error);
      setStatus('ERROR TEMPORAL');
      // No borramos la data anterior, se mantiene visible para evitar parpadeos
    } finally {
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
  }, [isFirstLoad]);

  useEffect(() => {
    // Primera carga
    fetchResults();

    // Polling cada 30 segundos de fondo (silencioso)
    const interval = setInterval(() => {
      fetchResults(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchResults]);

  return {
    data,
    status,
    lastUpdated,
    isFirstLoad
  };
}
