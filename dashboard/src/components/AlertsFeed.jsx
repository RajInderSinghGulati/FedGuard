import { formatDistanceToNow } from 'date-fns';

function Badge({ attack }) {
  return (
    <span className={`badge ${attack ? 'badge--attack' : 'badge--benign'}`}>
      {attack ? 'ATTACK' : 'BENIGN'}
    </span>
  );
}

export default function AlertsFeed({ alerts }) {
  const sorted = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50);

  if (sorted.length === 0) {
    return (
      <div className="chart-card chart-card--wide">
        <h3 className="chart-title">Live Alerts Feed</h3>
        <div className="chart-empty">
          <span>No alerts yet</span>
          <p>Predictions will appear here in real time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card chart-card--wide">
      <h3 className="chart-title">
        Live Alerts Feed
        <span className="chart-sub">{sorted.length} total</span>
      </h3>
      <div className="alerts-table-wrap">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Client</th>
              <th>Label</th>
              <th>Confidence</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(alert => (
              <tr key={alert.id} className={alert.attack ? 'row--attack' : ''}>
                <td><Badge attack={alert.attack} /></td>
                <td className="cell-mono">{alert.clientId}</td>
                <td>{alert.label}</td>
                <td className="cell-mono">{(alert.confidence * 100).toFixed(1)}%</td>
                <td className="cell-muted">
                  {alert.timestamp
                    ? formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}