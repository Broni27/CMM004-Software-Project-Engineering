import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './AuthPage';
import './Styles.css';
import background from './assets/background.png'
document.body.style.backgroundImage = `url(${background})`;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthPage />
    </React.StrictMode>
);