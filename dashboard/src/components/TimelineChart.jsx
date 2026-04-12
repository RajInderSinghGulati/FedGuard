import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useMemo } from 'react';

function bucketByMinute(alerts) {
  const buckets = {};
  alerts.forEach(a => {
    const d = new Date(a.timestamp);
    const key = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    if (!buckets[key]) buckets[key] = { time: key, attacks: 0, benign: 0 };
    if (a.attack) buckets[key].attacks++;
    else          buckets[key].benign++;
  });
  return Object.values(buckets).sort((a, b) => a.time.localeCompare(b.time)).slice(-20);
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <span className="chart-tooltip-label">{label}</span>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontSize: 13 }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TimelineChart({ alerts }) {
  const data = useMemo(() => bucketByMinute(alerts), [alerts]);

  if (data.length === 0) {
    return (
      <div className="chart-card chart-card--wide">
        <h3 className="chart-title">Alert Timeline</h3>
        <div className="chart-empty">
          <span>No timeline data yet</span>
          <p>Alerts will plot here per minute</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card chart-card--wide">
      <h3 className="chart-title">Alert Timeline <span className="chart-sub">last 20 min buckets</span></h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradAttack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#e05252" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#e05252" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gradBenign" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4f98a3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f98a3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="attacks" name="Attacks" stroke="#e05252" strokeWidth={2} fill="url(#gradAttack)" />
          <Area type="monotone" dataKey="benign"  name="Benign"  stroke="#4f98a3" strokeWidth={2} fill="url(#gradBenign)"  />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}