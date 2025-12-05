import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AIProvider } from './runtime/ai/AIProvider';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AIProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AIProvider>
  </React.StrictMode>,
);
