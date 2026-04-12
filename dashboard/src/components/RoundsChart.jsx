import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RoundsChart() {
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    const fetch = () =>
      axios.get('http://localhost:8080/api/fl/rounds')
        .then(r => setRounds(r.data.map(rd => ({
          round: `R${rd.roundNumber}`,
          accuracy: +(rd.globalAccuracy * 100).toFixed(2),
          loss: +rd.globalLoss.toFixed(4),
          clients: rd.participantCount
        }))));
    fetch();
    const id = setInterval(fetch, 6000);
    return () => clearInterval(id);
  }, []);

  if (rounds.length === 0) return (
    <div className="chart-card chart-card--wide">
      <h3 className="chart-title">FL Round Accuracy</h3>
      <div className="chart-empty">
        <span>No FL rounds yet</span>
        <p>Run <code>python app.py</code> to start training</p>
      </div>
    </div>
  );

  return (
    <div className="chart-card chart-card--wide">
      <h3 className="chart-title">FL Round Accuracy
        <span className="chart-sub"> global model performance</span>
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={rounds} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" />
          <XAxis dataKey="round" tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-faint)' }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip formatter={(v, n) => [n === 'accuracy' ? `${v}%` : v, n]} />
          <Legend iconType="circle" iconSize={8}
            formatter={v => <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{v}</span>} />
          <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#4f98a3" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="loss"     name="Loss"       stroke="#e05252" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}