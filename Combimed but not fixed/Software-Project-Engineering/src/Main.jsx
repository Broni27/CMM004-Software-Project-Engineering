import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import './Styles.css';
import background from './assets/background.png';

document.body.style.backgroundImage = `url(${background})`;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
