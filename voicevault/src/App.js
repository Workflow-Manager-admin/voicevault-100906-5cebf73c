import React from 'react';
import './App.css';
import VoiceVaultContainer from './VoiceVaultContainer';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';

// Renders navbar with logout/user info (if logged in)
function NavigationBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div className="logo">
            <span className="logo-symbol">*</span> KAVIA AI
          </div>
          {user && (
            <div style={{ display: 'flex', gap: 10, alignItems: "center" }}>
              <img alt={user.name} src={user.avatarUrl} width={32} height={32}
                style={{ borderRadius: '50%', objectFit: 'cover', border: "1.5px solid #aaa" }} />
              <span style={{ color: '#fff', fontWeight: 500 }}>{user.name}</span>
              <button className="btn" style={{ padding: '7px 15px', background: '#1976D2' }} onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// App wrapper with AuthProvider
function AppContainer() {
  const { user } = useAuth();

  return (
    <div className="app">
      <NavigationBar />
      <main>
        {user ? (
          <div className="container">
            <VoiceVaultContainer />
          </div>
        ) : (
          <LoginPage />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContainer />
    </AuthProvider>
  );
}

export default App;