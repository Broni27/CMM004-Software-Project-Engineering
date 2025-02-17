import React from 'react';

const HomePage = () => {
    return (
        <div className="body-container">
            <p>Plan and organize events easily</p>
            <button onClick={() => window.location.href='/profile'}>Create Event</button>
        </div>
    );
};

export default HomePage;
