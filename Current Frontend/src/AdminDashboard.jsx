import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';


const AdminDashboard = () => {
    // State for storing user data
    const [users, setUsers] = useState([]);
    // Loading state for API calls
    const [loading, setLoading] = useState(true);
    // Error state for handling API errors
    const [error, setError] = useState(null);

    /**
     * Fetches all users from the API
     * Requires valid admin JWT token
     */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5088/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array means this runs once on mount

    /**
     * Handles user deletion with confirmation
     * @param {number} userId - ID of user to delete
     */
    const handleDeleteUser = async (userId) => {
        if (!window.confirm(`Delete user ${userId}? This cannot be undone.`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5088/api/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update UI by removing deleted user
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    // Loading state UI
    if (loading) return <div className="admin-loading">Loading dashboard...</div>;
    // Error state UI
    if (error) return <div className="admin-error">Error: {error}</div>;

    // Main render
    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <div className="user-management">
                <h2>User Management</h2>
                {/* Responsive table container */}
                <div className="table-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Real Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Map through users array to display each user */}
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.realname}</td>
                                <td>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteUser(user.id)}
                                        aria-label={`Delete user ${user.username}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;