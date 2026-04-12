import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { ATTACK: '#e05252', BENIGN: '#4f98a3' };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <span className="chart-tooltip-label">{payload[0].name}</span>
        <span className="chart-tooltip-value">{payload[0].value}</span>
      </div>
    );
  }
  return null;
};

export default function AttackChart({ stats }) {
  const attacks = stats?.totalAttacks ?? 0;
  const benign  = stats?.totalBenign  ?? 0;

  if (attacks + benign === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Traffic Classification</h3>
        <div className="chart-empty">
          <span>No predictions yet</span>
          <p>Send traffic to <code>/api/predict</code></p>
        </div>
      </div>
    );
  }

  const data = [
    { name: 'ATTACK', value: attacks },
    { name: 'BENIGN', value: benign },
  ].filter(d => d.value > 0);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Traffic Classification</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
            {data.map(entry => <Cell key={entry.name} fill={COLORS[entry.name]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8}
            formatter={v => <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}