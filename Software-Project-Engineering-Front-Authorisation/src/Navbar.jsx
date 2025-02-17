import React from 'react';
import logo from './assets/logo.svg';
import profile from './assets/profile.svg';
import './Styles.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Logo" className="navbar-logo-img" />
            </div>
            <div className="navbar-links">
                <a href="/" className="navbar-link">Home</a>
                <a href="/events" className="navbar-link">Events</a>
                <a href="/profile" className="navbar-link">
                    <img src={profile} alt="Profile" className="navbar-icon-img" />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
