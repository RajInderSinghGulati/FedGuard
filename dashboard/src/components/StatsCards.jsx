import { ShieldAlert, ShieldCheck, Activity, Users } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon--${color}`}><Icon size={20} /></div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value ?? '—'}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

export default function StatsCards({ stats, alerts, clients }) {
  const attackRate = stats
    ? stats.totalAlerts > 0
      ? ((stats.totalAttacks / stats.totalAlerts) * 100).toFixed(1) + '%'
      : '0%'
    : '—';
  const activeClients = clients.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="stats-grid">
      <StatCard icon={ShieldAlert} label="Total Attacks"  value={stats?.totalAttacks ?? '—'} color="red"    sub="detected this session" />
      <StatCard icon={ShieldCheck} label="Benign Traffic" value={stats?.totalBenign ?? '—'}  color="green"  sub="clean samples" />
      <StatCard icon={Activity}    label="Attack Rate"    value={attackRate}                  color="orange" sub={`of ${stats?.totalAlerts ?? 0} total`} />
      <StatCard icon={Users}       label="Active Clients" value={activeClients || clients.length || '—'} color="blue" sub="federated nodes" />
    </div>
  );
}