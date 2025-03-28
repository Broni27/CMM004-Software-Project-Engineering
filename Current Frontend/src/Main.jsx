import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import EventPage from './EventPage';
import AdminDashboard from './AdminDashboard';
import Navbar from './Navbar';
import './Styles.css';
import background from './assets/background.png';

document.body.style.backgroundImage = `url(${background})`;

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/auth" />;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'ADMIN') {
            console.warn('Access denied - Admin role required');
            return <Navigate to="/home" />;
        }
        return children;
    } catch (error) {
        console.error('Invalid token:', error);
        return <Navigate to="/auth" />;
    }
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/events" element={<PrivateRoute><EventPage /></PrivateRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    </React.StrictMode>
);