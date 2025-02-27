import React from 'react';
import Navbar from './Navbar';
import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <div className="body-container">
                <div className="content-wrapper">
                    <p>Plan and organize events easily</p>
                    <button onClick={() => navigate("/events")}>Create Event</button>
                </div>
            </div>
        </>
    );
};

export default HomePage;
