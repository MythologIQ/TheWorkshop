import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AIProvider } from './runtime/ai/AIProvider';
import './styles/index.css';
import { PreferencesProvider } from './runtime/context/preferencesContext';
import { registerServiceWorker } from './runtime/offline/registerServiceWorker';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PreferencesProvider>
      <AIProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </AIProvider>
    </PreferencesProvider>
  </React.StrictMode>,
);

registerServiceWorker();
