import React from 'react';
import Navbar from './Navbar';
import {useNavigate} from "react-router-dom";

const EventPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return (
        <>
            <Navbar />
            <div className="body-container">
                <div className="content-wrapper">
                    <p>Events</p>
                    <button onClick={() => navigate("/events")}>Create Event</button>
                </div>
            </div>
        </>
    );
};

export default EventPage;