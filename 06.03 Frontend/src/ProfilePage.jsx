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

    const [joinedEvents, setJoinedEvents] = useState([]);   //State for storing joined events
    const [error, setError] = useState(null);

    //Fetches profile data from database to display correct user details
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token'); //Gets token from localStorage
                const profileResponse = await axios.get('http://localhost:5088/api/account/profile',{
                    headers: {
                        Authorization: `Bearer ${token}`    //Attaches token in Authorization header
                    }
                })

                setProfileData(profileResponse.data);   //Set profile data

                const eventsResponse = await axios.get('http://localhost:5088/api/account/joined-events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setJoinedEvents(eventsResponse.data);   //Set joined events
            } catch (err) {
                setError('Failed to fetch profile or events data.');
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
                    <p>Joined Events</p>
                    <div className="event-box">
                        {joinedEvents.length === 0 ? (
                            <p>You have not joined any events yet.</p>
                        ) : (
                            joinedEvents.map((event) => (
                                <div key={event.id} className="event-item">
                                    <h4>{event.title}</h4>
                                    <p>{event.description}</p>
                                    <p><strong>Creator:</strong> {event.creatorName}</p>
                                    <button>Leave</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;