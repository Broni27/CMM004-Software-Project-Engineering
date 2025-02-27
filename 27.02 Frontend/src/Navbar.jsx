import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from './assets/logo.svg';
import profile from './assets/profile.svg';
import './Styles.css';
import userService from "./API/UserService.js";

const Navbar = () => {
    const navigate = useNavigate();
    let token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            // userService.logout();
            navigate('/auth');
        }
    }, []);
    const logout = () => {
        userService.logout()
        navigate('/auth')
    }


    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Logo" className="navbar-logo-img" />
            </div>
            {/*{token ?*/}
                <div className="navbar-links">
                    <Link to="/home" className="navbar-link">Home</Link>
                    <Link to="/events" className="navbar-link">Events</Link>
                    <Link to="/profile" className="navbar-link">
                        <img src={profile} alt="Profile" className="navbar-icon-img" />
                    </Link>
                    {token && <button className="logout" onClick={logout}>LogOut</button>}
                </div>
            {/*:*/}
            {/*<div className="navbar-links">*/}
            {/*    <Link to="/auth" className="navbar-link">Login</Link>*/}
            {/*</div>}*/}

        </nav>
    );
};

export default Navbar;
