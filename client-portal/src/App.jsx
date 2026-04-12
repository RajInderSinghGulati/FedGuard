import React, { useState } from 'react';
import Login from './components/Login';
import UploadCSV from './components/UploadCSV';
import SubmitWeights from './components/SubmitWeights';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [tab, setTab] = useState('upload');

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🛡 FedGuard</h2>
        <p style={styles.clientId}>Client: {localStorage.getItem('clientId')}</p>
        <button style={tab === 'upload' ? styles.activeTab : styles.tab}
          onClick={() => setTab('upload')}>📂 Upload CSV</button>
        <button style={tab === 'weights' ? styles.activeTab : styles.tab}
          onClick={() => setTab('weights')}>🔁 Submit Weights</button>
        <button style={styles.logout} onClick={() => {
          localStorage.clear(); setLoggedIn(false);
        }}>Logout</button>
      </div>
      <div style={styles.main}>
        {tab === 'upload' && <UploadCSV />}
        {tab === 'weights' && <SubmitWeights />}
      </div>
    </div>
  );
}

const styles = {
  app: { display:'flex', height:'100vh', background:'#0f172a', color:'#e2e8f0' },
  sidebar: { width:'220px', background:'#1e293b', padding:'1.5rem', display:'flex',
    flexDirection:'column', gap:'0.75rem' },
  logo: { color:'#38bdf8', margin:'0 0 0.5rem' },
  clientId: { color:'#64748b', fontSize:'0.85rem', marginBottom:'1rem' },
  tab: { padding:'0.6rem 1rem', background:'transparent', border:'1px solid #334155',
    borderRadius:'8px', color:'#94a3b8', cursor:'pointer', textAlign:'left' },
  activeTab: { padding:'0.6rem 1rem', background:'#38bdf8', border:'none',
    borderRadius:'8px', color:'#0f172a', fontWeight:'bold', cursor:'pointer', textAlign:'left' },
  logout: { marginTop:'auto', padding:'0.6rem', background:'#450a0a', border:'none',
    borderRadius:'8px', color:'#f87171', cursor:'pointer' },
  main: { flex:1, overflowY:'auto', padding:'1.5rem' }
};