import React from 'react';
import { Link } from 'react-router-dom';
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
                <Link to="/home" className="navbar-link">Home</Link>
                <Link to="/events" className="navbar-link">Events</Link>
                <Link to="/profile" className="navbar-link">
                    <img src={profile} alt="Profile" className="navbar-icon-img" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
