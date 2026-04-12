import React, { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [clientId, setClientId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(clientId, apiKey);
      onLogin();
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>FedGuard Client Portal</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Client ID" value={clientId}
            onChange={e => setClientId(e.target.value)} />
          <input style={styles.input} placeholder="API Key" type="password"
            value={apiKey} onChange={e => setApiKey(e.target.value)} />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0f172a' },
  card: { background:'#1e293b', padding:'2rem', borderRadius:'12px', width:'360px' },
  title: { color:'#38bdf8', textAlign:'center', marginBottom:'1.5rem' },
  input: { width:'100%', padding:'0.75rem', marginBottom:'1rem', borderRadius:'8px',
    border:'1px solid #334155', background:'#0f172a', color:'#fff', boxSizing:'border-box' },
  button: { width:'100%', padding:'0.75rem', background:'#38bdf8', border:'none',
    borderRadius:'8px', color:'#0f172a', fontWeight:'bold', cursor:'pointer' },
  error: { color:'#f87171', marginBottom:'0.5rem' }
};