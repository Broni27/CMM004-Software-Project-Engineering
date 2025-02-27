import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import profileIcon from './assets/profile.svg';
import axios from 'axios';

const ProfilePage = () => {
    //Sets up state for storing profile data, and error state
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        realname: ''
    });
    
    const [error, setError] = useState(null);

    //Fetches profile data from database to display correct user details
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token'); //Gets token from localStorage
                const response = await axios.get('http://localhost:5088/api/account/profile',{
                    headers: {
                        Authorization: `Bearer ${token}`    //Attaches token in Authorization header
                    }
                })

                setProfileData(response.data); //Set profile data in state
            } catch(err){
                setError("Failed to fetch profile data. Please try logging in again.");
            } finally {
                setLoading(false);  //Once data fetched, set loading to false
            }
        };

        fetchProfileData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="body-container">
                <div className="user-info">
                    <img src={profileIcon} alt="Profile" className="profile-icon-large" />
                    <span>
            <p className="user-info-text">Username: {profileData.username}</p>
            <p className="user-info-text">Real Name: {profileData.realname}</p>
            <p className="user-info-text">E-Mail: {profileData.email}</p>
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