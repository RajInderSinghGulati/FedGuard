import { useState, useCallback } from 'react';
import { fetchStats, fetchAlerts, fetchClients } from '../api/api';
import { usePolling } from './usePolling';

export function useStats() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [statsRes, alertsRes, clientsRes] = await Promise.all([
        fetchStats().catch(() => null),
        fetchAlerts().catch(() => ({ data: [] })),
        fetchClients().catch(() => ({ data: [] })),
      ]);

      if (statsRes) setStats(statsRes.data);
      setAlerts(alertsRes.data ?? []);
      setClients(clientsRes.data ?? []);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setError('Cannot reach backend. Is Spring Boot running on :8080?');
    } finally {
      setLoading(false);
    }
  }, []);

  usePolling(refresh, 6000);
  return { stats, alerts, clients, loading, error, lastUpdated, refresh };
}