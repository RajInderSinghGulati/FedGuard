export default function Navbar({ lastUpdated, onThemeToggle, theme }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <svg aria-label="FedGuard" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L4 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7L14 2z"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 14l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="navbar-title">FedGuard</span>
        <span className="navbar-tag">IDS Dashboard</span>
      </div>
      <div className="navbar-right">
        {lastUpdated && (
          <span className="navbar-updated">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
        <div className="live-dot" title="Live polling active">
          <span className="live-pulse" />
          Live
        </div>
        <button className="theme-btn" onClick={onThemeToggle} aria-label="Toggle theme">
          {theme === 'dark'
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
      </div>
    </header>
  );
}