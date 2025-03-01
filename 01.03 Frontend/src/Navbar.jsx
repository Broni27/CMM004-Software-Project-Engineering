import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/logo.svg';
import profile from './assets/profile.svg';
import './Styles.css';
import userService from "./API/UserService.js";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); //Understands your current page location (needed for correct redirects based on certain conditions)
    const [showLoginPrompt, setShowLoginPrompt] = useState(false); //Controls navigation prompt visibility
    const [targetPage, setTargetPage] = useState('');              //Keeps track of which page the user is trying to access
    let token = localStorage.getItem('token')

    const handleLoginPrompt = (e, page) => {
        if (!token) {
            //If user not authenticated, show login prompt
            setTargetPage(page);    //Save page user is trying to visit
            setShowLoginPrompt(true);   //Show login prompt
        } else {
            if (page === 'events') {
                navigate('/events');  //Absolute path for events (fixes line 79)
            } else if (page === 'profile') {
                navigate('/profile'); //Absolute path for profile (fixes line 87)
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/auth');
        setShowLoginPrompt(false);      //Hides login prompt after redirect
    };

    const handleCancel = () => {
        setShowLoginPrompt(false);      //Hides login prompt when user cancels
    }

    const logout = () => {
        userService.logout();
        navigate('/home');
    }

    useEffect(() => {
        //Redirect to AuthPage.jsx if not authenticated and user tries to access any page other than home page or login
        if (!token && location.pathname !== '/auth' && location.pathname !== '/home') {
            navigate('/auth');
        }

        // Hide login prompt after 3 seconds if it is shown and no interaction
        if (showLoginPrompt) {
            const timer = setTimeout(() => {
                setShowLoginPrompt(false);
            }, 3000); // 3000ms

            return () => clearTimeout(timer); // Cleanup the timeout if the component is unmounted or prompt is hidden
        }
    }, [token, location.pathname, showLoginPrompt]);

    return (
        <div>
            {/*Login Prompt (does not trigger if already on AuthPage)*/}
            {showLoginPrompt && location.pathname !== '/auth' && (
                <div className="login-prompt">
                    <p>You need to be logged in to access this page.</p>
                    <button onClick={handleLoginRedirect}>Log in</button>
                    <button className="cancel" onClick={handleCancel}>Cancel</button>
                </div>
            )}

            {/*Display different message if user already on AuthPage*/}
            {showLoginPrompt && location.pathname === '/auth' && (
                <div className="login-prompt">
                    <p>Please log in below</p>
                </div>
            )}

            <nav className="navbar">
                <div className="navbar-logo">
                    <img src={logo} alt="Logo" className="navbar-logo-img" />
                </div>

                <div className="navbar-links">
                    {/*Home page is public i.e. always accessible*/}
                    <Link to="/home" className="navbar-link">Home</Link>

                    {/*Manage Events button with prompt functionality*/}
                    <button
                        onClick={(e) => handleLoginPrompt(e, 'events')}
                        className="navbar-link"
                    >
                        Manage Events
                    </button>

                    {/*Profile button with prompt functionality*/}
                    <button
                        onClick={(e) => handleLoginPrompt(e, 'profile')}
                        className="navbar-link"
                    >
                        <img src={profile} alt="Profile page" className="navbar-icon-img" />
                    </button>

                    {/*Log out button*/}
                    {token && <button className="logout" onClick={logout}>Log Out</button>}

                    {/*Log in button (only appears when not logged in)*/}
                    {!token && <Link to="/auth" className="navbar-link">Login</Link>}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;