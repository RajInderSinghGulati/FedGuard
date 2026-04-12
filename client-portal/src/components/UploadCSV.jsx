import React, { useState } from 'react';
import { uploadAndPredict } from '../services/api';

export default function UploadCSV() {
  const [text, setText] = useState('1,2,3,4,5');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const features = text
        .split(',')
        .map(v => Number(v.trim()))
        .filter(v => Number.isFinite(v));

      const res = await uploadAndPredict(features);
      setResult(res);
    } catch (e) {
      setError('Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ color: '#38bdf8' }}>Test Prediction</h3>
      <textarea
        rows={8}
        style={{ width: '100%', marginBottom: '1rem' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Predicting...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}