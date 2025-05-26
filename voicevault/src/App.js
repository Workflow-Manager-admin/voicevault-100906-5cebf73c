import React from 'react';
import './App.css';
import VoiceVaultContainer from './VoiceVaultContainer';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            {/* Remove template nav button for clean look */}
          </div>
        </div>
      </nav>
      <main>
        <div className="container">
          <VoiceVaultContainer />
        </div>
      </main>
    </div>
  );
}

export default App;