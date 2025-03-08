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
    const [loading, setLoading] = useState(true);

    //Fetches profile data and user's joined events
    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token'); //Gets token from localStorage
            const profileResponse = await axios.get('http://localhost:5088/api/account/profile', {
                headers: {
                    Authorization: `Bearer ${token}`    //Attaches token in Authorization header
                }
            })

            setProfileData(profileResponse.data);   //Set profile data

            const eventsResponse = await axios.get('http://localhost:5088/api/userevent/joined', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setJoinedEvents(eventsResponse.data);   //Set joined events
        } catch (err) {
            setError('Failed to fetch profile or events data.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfileData();
    }, []);

    //Leaving events handler
    const handleLeaveEvent = async (eventId, eventTitle) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5088/api/userevent/leave/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Leave event response:", response);

            //If response successful, Re-fetch all joined events after leaving
            if (response.status === 200) {
                alert(`You have successfully left the event: ${eventTitle}`);
                await fetchProfileData();
            } else {
                alert('Failed to leave event. Please try again later.');
            }
        } catch (err) {
            console.log("Error leaving event:", err);
            alert('Failed to leave event. Please try again later.');
        }
    };

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
                        {loading ? (
                            <p>Loading joined events...</p>
                        ) : joinedEvents.length === 0 ? (
                            <p>You have not joined any events yet.</p>
                        ) : (
                            joinedEvents.map((event) => (
                                <div key={event.id} className="event-item">
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                    <p><strong>Creator: </strong> {event.creatorName}</p>
                                    <p><strong>Date: </strong> {event.date}</p>
                                    <p><strong>Start Time: </strong> {event.startTime}</p>
                                    <p><strong>End Time: </strong> {event.endTime}</p>
                                    <p><strong>Location: </strong> {event.location}</p>
                                    <p><strong>Rating: </strong> {event.rating || 'N/A'}</p>
                                    <button onClick={() => handleLeaveEvent(event.id, event.title)}>Leave Event</button>
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