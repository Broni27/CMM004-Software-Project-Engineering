import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import './Styles.css';
import background from './assets/background.png';
import EventPage from "./EventPage.jsx";

document.body.style.backgroundImage = `url(${background})`;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/events" element={<EventPage/>} />
            </Routes>
        </Router>
    </React.StrictMode>
);
