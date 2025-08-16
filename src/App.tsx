import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState('onboarding');

  const modules = [
    { 
      name: 'Onboarding', 
      key: 'onboarding',
      icon: '👤',
      url: 'https://marvelous-salamander-ad0b63.netlify.app/',
      description: 'User onboarding & skill declaration'
    },
    { 
      name: 'Wallet', 
      key: 'wallet',
      icon: '💰',
      url: 'https://illustrious-conkies-8acc67.netlify.app/',
      description: 'Credit wallet & ledger API'
    },
    { 
      name: 'Post Gig', 
      key: 'post-gig',
      icon: '📝',
      url: 'https://684d1b298370479379eda1a8--candidate-003-talentkonnect-module-po.netlify.app/',
      description: 'Micro-task posting'
    },
    { 
      name: 'Complete Gig', 
      key: 'complete-gig',
      icon: '✅',
      url: 'https://candidate-004-talentkonnect-module-co.netlify.app/',
      description: 'Micro-task matching & completion'
    },
    { 
      name: 'Feed', 
      key: 'feed',
      icon: '📰',
      url: 'https://sweet-phoenix-fee6a2.netlify.app/',
      description: 'Feed & discovery'
    },
    { 
      name: 'Referral', 
      key: 'referral',
      icon: '🤝',
      url: 'https://starlit-blini-d5e2d3.netlify.app/',
      description: 'Referral widget'
    },
    { 
      name: 'Credit Conversion', 
      key: 'credit-conversion',
      icon: '🔄',
      url: 'https://talentkonnect-shujath.netlify.app/',
      description: 'Credit-to-token conversion'
    },
    { 
      name: 'Notifications', 
      key: 'notifications',
      icon: '🔔',
      url: 'https://talentkonnect-assessment.netlify.app/',
      description: 'Notifications & reminders'
    },
    { 
      name: 'Admin Clustering', 
      key: 'admin-clustering',
      icon: '👥',
      url: 'https://talentkonnect-clustering-ayushmaan.netlify.app/',
      description: 'Admin clustering dashboard'
    },
    { 
      name: 'Analytics', 
      key: 'analytics',
      icon: '📊',
      url: 'https://merry-bunny-e481b5.netlify.app/',
      description: 'Analytics & reporting'
    }
  ];

  const currentModule = modules.find(m => m.key === activeModule);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-talent">talent</span>
              <span className="logo-konnect">konnect</span>
            </div>
            <h1>Gamified Micro-Task Marketplace</h1>
          </div>
        </header>

        <div className="app-layout">
          <nav className="sidebar">
            <div className="nav-section">
              <h3>Modules</h3>
              {modules.map((module) => (
                <button 
                  key={module.key} 
                  onClick={() => setActiveModule(module.key)}
                  className={`nav-link ${activeModule === module.key ? 'active' : ''}`}
                >
                  <span className="nav-icon">{module.icon}</span>
                  <span className="nav-text">{module.name}</span>
                </button>
              ))}
            </div>
          </nav>

          <main className="main-content">
            <div className="module-header">
              <h2>{currentModule?.name}</h2>
              <p>{currentModule?.description}</p>
            </div>
            
            <div className="module-frame">
              {currentModule && (
                <iframe
                  key={currentModule.key}
                  src={currentModule.url}
                  title={currentModule.name}
                  className="module-iframe"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
