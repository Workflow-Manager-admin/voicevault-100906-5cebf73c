import React from 'react';
import './App.css';
import VoiceVaultContainer from './VoiceVaultContainer';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';

// Import react-router-dom v6+ APIs
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// PUBLIC_INTERFACE
// Navigation Bar with user info and logout button
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

// PUBLIC_INTERFACE
// Wrapper for authentication-protected routes
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
// Routing-aware Application Container
function AppRouterContainer() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        <NavigationBar />
        <main>
          <Routes>
            {/* Main Vault: authenticated access only */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="container">
                    <VoiceVaultContainer />
                  </div>
                </PrivateRoute>
              }
            />
            {/* Login page */}
            <Route
              path="/login"
              element={
                user ? <Navigate to="/" replace /> : <LoginPage />
              }
            />
            {/* Catch-all: redirect to main */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// PUBLIC_INTERFACE
// App root with AuthProvider and routing
function App() {
  return (
    <AuthProvider>
      <AppRouterContainer />
    </AuthProvider>
  );
}

export default App;