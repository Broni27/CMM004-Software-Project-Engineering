import React from 'react';
import Navbar from './Navbar';
import {useNavigate} from "react-router-dom";

const EventPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <div className="body-container">
                <div className="content-wrapper">
                    <p>Events</p>
                </div>
            </div>
        </>
    );
};

export default EventPage;