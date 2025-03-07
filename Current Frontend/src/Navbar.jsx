import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/logo.svg';
import profile from './assets/profile.svg';
import './Styles.css';
import './LoginPrompt.css'; // Импортируем стили для уведомления
import userService from "./API/UserService.js";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [targetPage, setTargetPage] = useState('');
    let token = localStorage.getItem('token');

    const handleLoginPrompt = (e, page) => {
        if (!token) {
            console.log("Showing login prompt"); // Debug log
            setTargetPage(page);
            setShowLoginPrompt(true);
        } else {
            if (page === 'events') {
                navigate('/events');
            } else if (page === 'profile') {
                navigate('/profile');
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/auth');
        setShowLoginPrompt(false);
    };

    const handleCancel = () => {
        setShowLoginPrompt(false);
    };

    const logout = () => {
        userService.logout();
        navigate('/home');
    };

    useEffect(() => {
        if (!token && location.pathname !== '/auth' && location.pathname !== '/home') {
            navigate('/auth');
        }

        if (showLoginPrompt) {
            const timer = setTimeout(() => {
                console.log("Hiding login prompt"); // Debug log
                setShowLoginPrompt(false);
            }, 10000); // 10 секунд

            return () => clearTimeout(timer);
        }
    }, [token, location.pathname, showLoginPrompt]);

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src={logo} alt="Logo" className="navbar-logo-img" />
                </div>

                <div className="navbar-links">
                    <Link to="/home" className="navbar-link">Home</Link>
                    <button
                        onClick={(e) => handleLoginPrompt(e, 'events')}
                        className="navbar-link"
                    >
                        Manage Events
                    </button>
                    <button
                        onClick={(e) => handleLoginPrompt(e, 'profile')}
                        className="navbar-link"
                    >
                        <img src={profile} alt="Profile page" className="navbar-icon-img" />
                    </button>
                    {token && <button className="logout" onClick={logout}>Log Out</button>}
                    {!token && <Link to="/auth" className="navbar-link">Login</Link>}
                </div>
            </nav>

            {/* Login Prompt */}
            {showLoginPrompt && location.pathname !== '/auth' && (
                <div className="login-prompt">
                    <p>You need to be logged in to access this page.</p>
                    <button onClick={handleLoginRedirect}>Log in</button>
                    <button className="cancel" onClick={handleCancel}>Cancel</button>
                </div>
            )}

            {/* Display different message if user is already on AuthPage */}
            {showLoginPrompt && location.pathname === '/auth' && (
                <div className="login-prompt">
                    <p>Please log in below</p>
                </div>
            )}
        </div>
    );
};

export default Navbar;