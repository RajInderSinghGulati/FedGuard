export default function ClientTable({ clients }) {
  if (clients.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Federated Clients</h3>
        <div className="chart-empty">
          <span>No clients registered</span>
          <p>Clients appear after their first prediction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Federated Clients</h3>
      <div className="alerts-table-wrap">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Rounds</th>
              <th>Accuracy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id}>
                <td className="cell-mono">{c.clientId}</td>
                <td>{c.roundsParticipated}</td>
                <td>{c.localAccuracy ? (c.localAccuracy * 100).toFixed(1) + '%' : '—'}</td>
                <td>
                  <span className={`badge ${c.status === 'ACTIVE' ? 'badge--benign' : 'badge--neutral'}`}>
                    {c.status ?? 'UNKNOWN'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}