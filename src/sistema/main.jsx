import React from 'react';
import { createRoot } from 'react-dom/client';
import Sistema from './Sistema.jsx';
import '../styles/base.css';
import './sistema.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sistema />
  </React.StrictMode>
);
