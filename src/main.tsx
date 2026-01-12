import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Vite buscará App.tsx automáticamente
import '../style.css'; // Esto soluciona el error 404 del CSS

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No se encontró el elemento root');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
