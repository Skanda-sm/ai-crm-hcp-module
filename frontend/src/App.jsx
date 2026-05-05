import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import InteractionForm from './components/InteractionForm';
import AIAssistant from './components/AIAssistant';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <main className="main-content">
          <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Log HCP Interaction</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Healthcare Professional Relationship Management</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary">Cancel</button>
              <button className="btn-primary">Save Draft</button>
            </div>
          </header>
          
          <InteractionForm />
        </main>
        
        <AIAssistant />
      </div>
    </Provider>
  );
}

export default App;
