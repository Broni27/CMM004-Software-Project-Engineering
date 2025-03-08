import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './EventCard.css'; // Import the new CSS file for event cards

const HomePage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);                       // State for storing events
    const [loading, setLoading] = useState(true);                   // Loading state for events
    const [error, setError] = useState(null);                       // Error handling state
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);  // State for login prompts
    const [registerMessage, setRegisterMessage] = useState('');     // State for register message
    const [showRegisterMessage, setShowRegisterMessage] = useState(false);

    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem('token');

    // Fetch events from backend API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5088/api/event');
                setEvents(response.data);   // Update state with event data
            } catch (err) {
                setError("Failed to fetch events");
            } finally {
                setLoading(false);  // Sets loading to false once data is fetched
            }
        };

        fetchEvents();
    }, []);

    // Registration success message
    useEffect(() => {
        const message = sessionStorage.getItem('registerMessage');
        if (message) {
            setRegisterMessage(message);
            setShowRegisterMessage(true);
            sessionStorage.removeItem('registerMessage');

            const timer = setTimeout(() => {
                setShowRegisterMessage(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleEventJoin = async (eventId) => {
        if (isAuthenticated) {
            // If user authenticated, attempt to join event
            try {
                const token = localStorage.getItem('token');
                await axios.post(
                    `http://localhost:5088/api/userevent/join/${eventId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert('You have successfully joined the event!');
            } catch (err) {
                alert('Failed to join event. Please try again later.');
            }
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

    // Hide the login prompt after 5 seconds
    useEffect(() => {
        if (showLoginPrompt) {
            const timer = setTimeout(() => {
                setShowLoginPrompt(false);
            }, 5000); // 5000 ms = 5 seconds

            return () => clearTimeout(timer); // Clean up the timeout if the prompt disappears or user interacts with it
        }
    }, [showLoginPrompt]);

    return (
        <div>
            <Navbar />
            {showRegisterMessage && (
                <div className="login-prompt">
                    <p>{registerMessage}</p>
                </div>
            )}
            <h1>All Available Events</h1>

            {/* Error Handling */}
            {error && <p style={{ color: 'red' }}> {error}</p>}

            {/* Loading Indicator */}
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <>
                {/* Display events from database */}
                {events.length === 0 ? (
                    <p>No events available at the moment. Please check back later.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p><strong>Creator:</strong> {event.creatorName}</p>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Start Time:</strong> {event.startTime}</p>
                            <p><strong>End Time:</strong> {event.endTime}</p>
                            <p><strong>Capacity:</strong> {event.capacity}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Rating:</strong> {event.rating || 'N/A'}</p>
                            <button onClick={() => handleEventJoin(event.id)}>
                                Join Event
                            </button>
                        </div>
                    ))
                )}
                </>
            )}

            {showLoginPrompt && (
                <div className="login-prompt">
                    <p>You need to be logged in to join events.</p>
                    <button onClick={handleLoginRedirect}>Log in</button>
                    <button className="cancel" onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default HomePage;