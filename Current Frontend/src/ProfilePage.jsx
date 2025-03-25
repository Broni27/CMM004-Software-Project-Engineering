import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for backend requests
import Navbar from './Navbar';
import profileIcon from './assets/profile.svg';
import './EventCard.css'; // Using CSS for event card styles
import './ProfilePage.css'; // Use your CSS for the profile page

const ProfilePage = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        realname: ''
    });

    const [joinedEvents, setJoinedEvents] = useState([]); // State for events in which the user participates
    const [error, setError] = useState(null); // State for Errors
    const [loading, setLoading] = useState(true); // State to load data

    // Stats for modal windows and forms
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [username, setUsername] = useState(profileData.username);
    const [realname, setRealname] = useState(profileData.realname);
    const [email, setEmail] = useState(profileData.email);

    // Loading profile and event data
    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("You are not authenticated. Please log in.");
                return;
            }

            const profileResponse = await axios.get('http://localhost:5088/api/account/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfileData(profileResponse.data);
            setUsername(profileResponse.data.username);
            setRealname(profileResponse.data.realname);
            setEmail(profileResponse.data.email);

            const eventsResponse = await axios.get('http://localhost:5088/api/userevent/joined', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setJoinedEvents(eventsResponse.data);
        } catch (err) {
            setError('Failed to fetch profile or events data.');
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Обработка выхода из события
    const handleLeaveEvent = async (eventId, eventTitle) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("You are not authenticated. Please log in.");
                return;
            }

            const response = await axios.delete(`http://localhost:5088/api/userevent/leave/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert(`You have successfully left the event: ${eventTitle}`);
                await fetchProfileData(); // Обновляем список событий
            } else {
                alert('Failed to leave event. Please try again later.');
            }
        } catch (err) {
            console.error("Error leaving event:", err);
            alert('Failed to leave event. Please try again later.');
        }
    };

    // Opens "Edit Profile" form with current profile data
    // Prevents error where if user edits profile, then cancels, the form will open with their cancelled data
    const handleOpenEditProfileForm = async () => {
        try {
            await fetchProfileData(); // Re-fetch the current profile details
            setShowEditProfileForm(true); // Then open the edit form
        } catch (error) {
            console.error("Error fetching profile data:", error);
            setError("Failed to load current profile details.");
        }
    };

    // Processing profile editing
    const handleEditProfile = async (e) => {
        e.preventDefault();
        if (!username || !realname || !email) {
            setError("All fields are required.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError("You are not authenticated. Please log in.");
            return;
        }

        const confirmUpdate = window.confirm("Are you sure you want to update your profile?");
        if (!confirmUpdate) {
            alert("Profile update canceled.");
            setShowEditProfileForm(false);
            return;
        }

        try {
            const response = await axios.put('http://localhost:5088/api/account/profile/update', 
                {
                    Username: username,
                    Email: email,
                    RealName: realname
                },
                {
                    headers: 
                    { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` 
                    }
                }
            );

            if (response.status === 204) {
                alert("Profile updated successfully.");
                console.log("Profile updated successfully.");
                await fetchProfileData();
                setShowEditProfileForm(false);
                setError("");
            } else {
                setError("Failed to update profile. Please try again later.");
            }
        } catch (error) {
            console.error("Error updating profile:", error.response ? error.response.data : error.message);
            setError("Failed to update profile. Please try again later.");
        }

        console.log("Profile update requested:", { username, realname, email });
        setShowEditProfileForm(false);
        setError("");
    };

    // Handling account deletion
    const handleDeleteAccount = () => {
        if (!deletePassword) {
            setError("Please enter your password to confirm.");
            return;
        }
        // This will be the API call to delete the account
        console.log("Account deletion requested with password:", deletePassword);
        setShowDeleteModal(false);
        setError("");
        setDeletePassword("");
    };

    // Process password change
    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        // Here will be the API call for changing the password
        console.log("Password change requested:", { oldPassword, newPassword });
        setShowChangePasswordForm(false);
        setError("");
    };

    return (
        <>
            <Navbar />
            <div className="profile-container">
                {/* User Information */}
                <div className="user-info">
                    <img src={profileIcon} alt="Profile" className="profile-icon-large" />
                    <span>
                        <p className="user-info-text">Username: {profileData.username}</p>
                        <p className="user-info-text">Real Name: {profileData.realname}</p>
                        <p className="user-info-text">E-Mail: {profileData.email}</p>
                    </span>
                </div>

                {/* Buttons for actions */}
                <button onClick={handleOpenEditProfileForm}>Edit Profile</button>
                <button onClick={() => setShowChangePasswordForm(true)}>Change Password</button>
                <button className="delete-button" onClick={() => setShowDeleteModal(true)}>Delete Account</button>

                {/* List of events in which the user participates */}
                <div className="event-info">
                    <h2>Joined Events</h2>
                    {loading ? (
                        <p>Loading joined events...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : joinedEvents.length === 0 ? (
                        <p>You have not joined any events yet.</p>
                    ) : (
                        <div className="events-list">
                            {joinedEvents.map((event) => (
                                <div key={event.id} className="profile-event-card">
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                    <p><strong>Creator:</strong> {event.creatorName}</p>
                                    <p><strong>Date:</strong> {event.date}</p>
                                    <p><strong>Start Time:</strong> {event.startTime}</p>
                                    <p><strong>End Time:</strong> {event.endTime}</p>
                                    <p><strong>Location:</strong> {event.location}</p>
                                    <button onClick={() => handleLeaveEvent(event.id, event.title)}>Leave Event</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Account deletion modal window */}
                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Delete Account</h3>
                            <p>Are you sure you want to delete your account? This action will permanently delete your account and all events you have created. This cannot be undone.</p>
                            <div className="form-group">
                                <label>Enter your password to confirm:</label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button onClick={() => {
                                setShowDeleteModal(false);
                                setError("");
                            }}>Cancel</button>
                            <button className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    </div>
                )}

                {/* Modal window for changing the password */}
                {showChangePasswordForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Change Password</h3>
                            <form onSubmit={handleChangePassword}>
                                <div className="form-group">
                                    <label>Old Password:</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password:</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password:</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowChangePasswordForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal window for profile editing */}
                {showEditProfileForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Edit Profile</h3>
                            <form onSubmit={handleEditProfile}>
                                <div className="form-group">
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Real Name:</label>
                                    <input
                                        type="text"
                                        value={realname}
                                        onChange={(e) => setRealname(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={() => setShowEditProfileForm(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfilePage;