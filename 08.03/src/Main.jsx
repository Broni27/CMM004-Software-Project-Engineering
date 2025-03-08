import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import EventPage from './EventPage';
import Navbar from './Navbar';
import './Styles.css';
import background from './assets/background.png';

document.body.style.backgroundImage = `url(${background})`;

// Component to check authentication
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Check if user is authenticated
    return token ? children : <Navigate to="/auth" />; // Redirect to /auth if not authenticated
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Navbar /> {/* Navbar is now outside Routes to be visible on all pages */}
            <Routes>
                {/* Default route redirects to /home */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Public routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Private routes */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <PrivateRoute>
                            <EventPage />
                        </PrivateRoute>
                    }
                />

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    </React.StrictMode>
);