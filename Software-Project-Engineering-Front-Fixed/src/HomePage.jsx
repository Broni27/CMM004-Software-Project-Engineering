import React from 'react';
import Navbar from './Navbar';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <div className="body-container">
                <div className="content-wrapper">
                    <p>Plan and organize events easily</p>
                    <button onClick={() => window.location.href='/profile'}>Create Event</button>
                </div>
            </div>
        </>
    );
};

export default HomePage;
