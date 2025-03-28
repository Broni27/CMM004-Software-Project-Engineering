import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import profile from './assets/profile.svg';
import './Styles.css';
import userService from "./API/UserService.js";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [targetPage, setTargetPage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem('token');

    // Check admin status when token changes
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(payload.role === 'ADMIN');
            } catch (err) {
                console.error('Error decoding token:', err);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    }, [token]);

    const handleLoginPrompt = (e, page) => {
        if (!token) {
            setTargetPage(page);
            setShowLoginPrompt(true);
        } else {
            navigate(`/${page}`);
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
        setIsAdmin(false);
        navigate('/home');
    };

    useEffect(() => {
        if (!token && location.pathname !== '/auth' && location.pathname !== '/home') {
            navigate('/auth');
        }

        if (showLoginPrompt) {
            const timer = setTimeout(() => {
                setShowLoginPrompt(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [token, location.pathname, showLoginPrompt, navigate]);

    return (
        <div>
            {/* Login Prompt */}
            {showLoginPrompt && location.pathname !== '/auth' && (
                <div className="login-prompt">
                    <p>You need to be logged in to access this page.</p>
                    <button onClick={handleLoginRedirect}>Log in</button>
                    <button className="cancel" onClick={handleCancel}>Cancel</button>
                </div>
            )}

            {showLoginPrompt && location.pathname === '/auth' && (
                <div className="login-prompt">
                    <p>Please log in below</p>
                </div>
            )}

            <nav className="navbar">
                <div className="navbar-left"></div>

                <div className="navbar-center">
                    <Link to="/home" className="navbar-link">Home</Link>
                    <button
                        onClick={(e) => handleLoginPrompt(e, 'events')}
                        className="navbar-link"
                    >
                        Manage Events
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/admin')}
                            className="navbar-link admin-link"
                        >
                            Admin Dashboard
                        </button>
                    )}
                </div>

                <div className="navbar-right">
                    <button
                        onClick={(e) => handleLoginPrompt(e, 'profile')}
                        className="navbar-link"
                    >
                        <img src={profile} alt="Profile" className="navbar-icon-img" />
                    </button>
                    {token ? (
                        <button className="logout" onClick={logout}>Log Out</button>
                    ) : (
                        <Link to="/auth" className="navbar-link">Login</Link>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;