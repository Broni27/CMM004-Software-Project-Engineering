import React from 'react';
import Navbar from './Navbar';
import profileIcon from './assets/profile.svg';

const ProfilePage = () => {
    return (
        <>
            <Navbar />
            <div className="body-container">
                <div className="user-info">
                    <img src={profileIcon} alt="Profile" className="profile-icon-large" />
                    <span>
            <p className="user-info-text">Username: {localStorage.getItem("username")}</p>
            <p className="user-info-text">Real Name: Example Example</p>
            <p className="user-info-text">E-Mail: example@example.com</p>
          </span>
                </div>
                <div className="event-info">
                    <p>Nearest Event</p>
                    <div className="event-box">
                        <h4 className="event-title">Event Name</h4>
                        <div className="event-description">
                            <h5>Description:</h5>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore sed laboriosam ex quam rem est reprehenderit similique! Architecto, asperiores dolore provident error tenetur praesentium a ratione et assumenda ea aperiam.
                            </p>
                        </div>
                        <div className="event-footer">
              <span className="event-footer-info">
                <p>Event Creator:</p>
                <p>Creator Name</p>
              </span>
                            <button id="leave-btn">Leave</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
