import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';  // Correct import
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from '@material-tailwind/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <HelmetProvider>
    <ThemeProvider>
        <App />      
    </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
