import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import AttackChart from './components/AttackChart';
import TimelineChart from './components/TimelineChart';
import AlertsFeed from './components/AlertsFeed';
import ClientTable from './components/ClientTable';
import RoundsChart from './components/RoundsChart';
import { useStats } from './hooks/useStats';
import './App.css';

export default function App() {
  const { stats, alerts, clients, loading, error, lastUpdated } = useStats();
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // ✅ log BEFORE early return
  console.log('render state:', { stats, alerts, clients, loading, error });

  if (loading || !stats) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span>Connecting to FedGuard backend...</span>
    </div>
  );

  return (
    <div className="app">
      <Navbar lastUpdated={lastUpdated} onThemeToggle={toggleTheme} theme={theme} />
      <main className="main">
        {error && <div className="error-banner">{error}</div>}
        <StatsCards stats={stats} alerts={alerts} clients={clients} />
        <div className="charts-row">
          <AttackChart stats={stats} />
           <RoundsChart />
          <TimelineChart alerts={alerts} />
        </div>
        <div className="charts-row">
          <ClientTable clients={clients} />
          <AlertsFeed alerts={alerts} />
        </div>
      </main>
    </div>
  );
}