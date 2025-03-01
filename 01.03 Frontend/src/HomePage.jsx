import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem('token');

    const handleEventJoin = () => {
        if (isAuthenticated) {
            // If user authenticated, "Join Event" button will work
            alert('You have joined the event!');
        } else {
            // If user not logged in, shows a prompt asking to login
            setShowLoginPrompt(true);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/auth');  // Redirect to AuthPage.jsx
    };

    const handleCancel = () => {
        setShowLoginPrompt(false);
    }

    //Hide the login prompt after 3 seconds
    useEffect(() => {
        if (showLoginPrompt) {
            const timer = setTimeout(() => {
                setShowLoginPrompt(false);
            }, 3000); //3000 ms

            return () => clearTimeout(timer); // Clean up the timeout if the prompt disappears or user interacts with it
        }
    }, [showLoginPrompt]);

    return (
        <div>
            <Navbar />
            <h1>All Available Events</h1>
            <p>A list of events will be displayed here, based on the contents of the Events database table</p>
            <h3>Sample Event 1</h3>
            <button onClick={handleEventJoin}>Join Event 1</button>
            <h3>Sample Event 2</h3>
            <button onClick={handleEventJoin}>Join Event 2</button>

            {showLoginPrompt && (
                <div className="login-prompt">
                    <p>You need to be logged in to see this page.</p>
                    <button onClick={handleLoginRedirect}>Log in</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default HomePage;