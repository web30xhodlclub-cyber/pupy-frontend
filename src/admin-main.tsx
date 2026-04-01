import React from 'react';
import ReactDOM from 'react-dom/client';
import DatabaseAdmin from './components/DatabaseAdmin';
import './index.css';

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <DatabaseAdmin />
  </React.StrictMode>
);
