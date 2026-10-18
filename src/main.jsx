import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { registerProvider } from './analytics/analytics.js';
import { consoleProvider } from './analytics/providers.js';
import './index.css';

// Simulated analytics: events are logged to the browser console only.
registerProvider(consoleProvider);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
