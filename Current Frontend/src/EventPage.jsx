import { useState, useEffect } from "react";
import axios from "axios"; // Allows connection to backend through API calls
import Navbar from "./Navbar"; // Import Navbar
import "./CreateEventForm.css"; // Import CSS for the form
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function EventPage() {
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [events, setEvents] = useState([]); // Stores created events
    const [error, setError] = useState(null);   //State for errors
    const [editingEventId, setEditingEventId] = useState(null);    //State for editing events

    //State for holding form data whilst editing event
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        capacity: "",
    });

    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchUserEvents();
    }, []);

    const fetchUserEvents = async () => {
        const token = localStorage.getItem("token");

        // Axios must retrieve token for GET request to work
        if (!token) {
            setError("Unexpected authentication error. Please log in again");
            return;
        }

        try {
            const response = await axios.get("http://localhost:5088/api/event/created", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEvents(response.data);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to load events. Please try again later.");
        }
    };

    const handleEditEvent = (event) => {
        /*Formatting fix for time fields (frontend - 00:00, backend - 00:00:00)
        This would cause issues when editing events, when creating an event a :00 is appended automatically to allow for backend storing
        But, upon editing another :00 would append, causing only 1 edit to be possible on an event
        This fixes that*/
        const formattedStartTime = event.startTime && event.startTime.length > 5
            ? event.startTime.substring(0, 5)
            : event.startTime;
        const formattedEndTime = event.endTime && event.endTime.length > 5
            ? event.endTime.substring(0, 5)
            : event.endTime;

        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            location: event.location,
            capacity: event.capacity,
        });
        setEditingEventId(event.id);    //Stores which event is being edited
        setShowForm(true);
    };

    const handleDeleteEvent = async (eventId) => {
        //Get event details to allow for display of event name in confirmation message
        const eventToDelete = events.find(ev => ev.id === eventId);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unexpected authentication error. Please log in again");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete the event?: ${eventToDelete?.title || 'Unknown Event'}`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5088/api/event/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            //Remove deleted event from state with no refresh
            setEvents(events.filter(event => event.id !== eventId));
            alert(`You have successfully deleted the event: ${eventToDelete?.title || 'Unknown Event'}!`);
        } catch (err) {
            console.error("Error deleting event:", err.response ? err.response.data : err.message);
            alert(`Failed to delete event. Server responded with: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
        }
    };

    //Handles event create and edit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const isFormValid = Array.from(form.elements).every((element) => {
            return (
                (element.tagName !== "INPUT" &&
                    element.tagName !== "TEXTAREA" &&
                    element.tagName !== "SELECT") ||
                element.checkValidity()
            );
        });

        if (!isFormValid) {
            alert("Please fill all fields");
            return;
        }

        const eventData = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            startTime: formData.startTime + ":00",
            endTime: formData.endTime + ":00",
            location: formData.location,
            capacity: parseInt(formData.capacity, 10),
            rating: null // Omitted in form as of 09/03, backend still expects so it's here for now
        };

        // Axios must retrieve token for POST/PUT request to work
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unexpected authentication error. Please log in again.");
            return;
        }

        try {
            let response;

            if (editingEventId) {
                //Edit event using PUT
                response = await axios.put(
                    `http://localhost:5088/api/event/${editingEventId}`,
                    eventData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
            } else {
                //Create new event using POST
                response = await axios.post(
                    "http://localhost:5088/api/event",
                    eventData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
            }

            if (response.status >= 200 && response.status < 300) //Detects all success codes
            {
                alert(editingEventId ? "Event edited successfully!" : "Event created successfully!");
                setShowForm(false); // Hide the form after submission
                //Reset form data
                setEditingEventId(null);
                setFormData({
                    title: "",
                    description: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    location: "",
                    capacity: "",
                });
                fetchUserEvents(); // Refresh event list
            } else {
                alert("Failed to submit event. Please try again.");
            }
        } catch (err) {
            setError("Error submitting event. Please try again later.");
            console.error("Event submission error:", err);
        }
    };

    return (
        <div>
            {/* Add Navbar at the top of the page */}
            <Navbar />

            {/* Add padding to the main content to avoid overlap with Navbar */}
            <div className="event-page-container" style={{ paddingTop: "80px" }}>
                {/* Show created events list only if form is NOT open */}
                {!showForm && (
                    <div>
                        <h2>Your Created Events</h2>
                        {events.length === 0 ? (
                            <p>You haven't created any events yet! Click the button below to start creating events</p>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="event-card">
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                    <p><strong>Creator:</strong> {event.creatorName}</p>
                                    <p><strong>Date:</strong> {event.date}</p>
                                    <p><strong>Start Time:</strong> {event.startTime}</p>
                                    <p><strong>End Time:</strong> {event.endTime}</p>
                                    <p><strong>Capacity:</strong> {event.capacity || 'Event is currently full!'}</p>
                                    <p><strong>Location:</strong> {event.location}</p>
                                    {/*<p><strong>Rating:</strong> {event.rating || 'N/A'}</p>*/}

                                    <button className="submit-button"
                                        onClick={() => handleEditEvent(event)}>Edit Event</button>

                                    <button className="submit-button"
                                        onClick={() => handleDeleteEvent(event.id)}>Delete Event</button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Show "Create Event" button if form is not visible */}
                {!showForm && (
                    <button className="create-event-button"
                        onClick={() => {
                            //Resets form for new event creation
                            setEditingEventId(null);
                            setFormData({
                                title: "",
                                description: "",
                                date: "",
                                startTime: "",
                                endTime: "",
                                location: "",
                                capacity: "",
                            });
                            setShowForm(true);
                        }}
                    >
                        Create Events
                    </button>
                )}

                {/* Show the form when "Create Event" button is clicked */}
                {showForm && (
                    <form className="create-event-form" onSubmit={handleFormSubmit}>
                        {/* Back button to return to the events list */}
                        <button
                            type="button"
                            className="back-button"
                            // Hide the form and return to the events list
                            onClick={() => {
                                setShowForm(false);
                                setEditingEventId(null);
                            }}
                        >
                            Back to Events
                        </button>

                        <div className="form-group">
                            <label htmlFor="eventName">Event Name:</label>
                            <input
                                type="text"
                                id="eventName"
                                name="eventName"
                                placeholder="Enter event name"
                                //Fill edit form with values of existing event
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventDescription">Event Description:</label>
                            <textarea
                                id="eventDescription"
                                name="eventDescription"
                                placeholder="Describe your event"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventDate">Event Date:</label>
                            <input
                                type="date"
                                id="eventDate"
                                name="eventDate"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="startTime">Start Time:</label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endTime">End Time:</label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventLocation">Event Location:</label>
                            <input
                                type="text"
                                id="eventLocation"
                                name="eventLocation"
                                placeholder="Enter event location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="numberOfAttendees">Event Capacity</label>
                            <input
                                type="number"
                                id="numberOfAttendees"
                                name="numberOfAttendees"
                                placeholder="Enter event capacity"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EventPage;