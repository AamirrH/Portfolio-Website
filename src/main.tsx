import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import './stops.css';
import App from './App';
import { AudioProvider } from './audio/AudioProvider';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><AudioProvider><App /></AudioProvider></React.StrictMode>);
