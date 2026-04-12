import React from 'react';

export default function PredictionTable({ results }) {
  const attacks = results.filter(r => r.prediction === 'ATTACK').length;
  const benign = results.filter(r => r.prediction === 'BENIGN').length;

  return (
    <div>
      <div style={styles.summary}>
        <span style={styles.attack}>⚠ Attacks: {attacks}</span>
        <span style={styles.benign}>✓ Benign: {benign}</span>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Prediction</th>
              <th style={styles.th}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ background: r.prediction === 'ATTACK' ? '#450a0a' : '#052e16' }}>
                <td style={styles.td}>{i + 1}</td>
                <td style={{ ...styles.td, color: r.prediction === 'ATTACK' ? '#f87171' : '#4ade80', fontWeight: 'bold' }}>
                  {r.prediction}
                </td>
                <td style={styles.td}>{(r.confidence * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  summary: { display:'flex', gap:'2rem', marginBottom:'1rem' },
  attack: { color:'#f87171', fontWeight:'bold', fontSize:'1.1rem' },
  benign: { color:'#4ade80', fontWeight:'bold', fontSize:'1.1rem' },
  tableWrapper: { maxHeight:'400px', overflowY:'auto' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: { background:'#1e293b', color:'#94a3b8', padding:'0.75rem', textAlign:'left' },
  td: { padding:'0.6rem 0.75rem', color:'#e2e8f0', borderBottom:'1px solid #1e293b' }
};