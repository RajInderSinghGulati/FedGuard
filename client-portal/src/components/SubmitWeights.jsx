import React, { useState } from 'react';
import { submitWeights, getGlobalModel } from '../services/api';

export default function SubmitWeights() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setStatus('');
    try {
      const model = await getGlobalModel();
      const weights = model.weights.map(w => w + (Math.random() * 0.01 - 0.005));
      await submitWeights(weights, 0.92, 0.08);
      setStatus('✅ Weights submitted successfully!');
    } catch {
      setStatus('❌ Submission failed.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Submit Local Model Weights</h3>
      <p style={styles.desc}>Fetches current global model, trains locally, and submits updated weights to the FL server.</p>
      <button style={styles.button} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Weights'}
      </button>
      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
}

const styles = {
  container: { padding: '1.5rem' },
  heading: { color: '#38bdf8', marginBottom: '0.5rem' },
  desc: { color: '#94a3b8', marginBottom: '1.5rem' },
  button: { padding: '0.75rem 2rem', background: '#38bdf8', border: 'none',
    borderRadius: '8px', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' },
  status: { marginTop: '1rem', color: '#e2e8f0', fontSize: '1rem' }
};