import { useState, useEffect } from "react";
import axios from "axios";      //Allows connection to backend through API calls
import Navbar from "./Navbar"; // Import Navbar
import "./CreateEventForm.css";

function EventPage() {
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [events, setEvents] = useState([]);        //Stores created events
    const [error, setError] = useState(null);

    const fetchUserEvents = async () => {
        const token = localStorage.getItem("token");

        //axios must retrieve token for get request to work
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

    useEffect(() => {
        fetchUserEvents();
    }, []);

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

        const formData = new FormData(form);
        const eventData = {
            title: formData.get("eventName"),
            description: formData.get("eventDescription"),
            date: formData.get("eventDate"),
            startTime: formData.get("startTime") + ":00",
            endTime: formData.get("endTime") + ":00",
            location: formData.get("eventLocation"),
            capacity: parseInt(formData.get("numberOfAttendees"), 10), //10 converts the int using base 10 decimal
            rating: null //Omitted in form as of 09/03, backend still expects so it's here for now
        };

        //axios must retrieve token for post request to work
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unexpected authentication error. Please log in again.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5088/api/event",
                eventData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 201) {
                alert("Event created successfully!");
                console.log("Form submitted");
                setShowForm(false); // Hide the form after submission
                form.reset();       //Clears form fields
                fetchUserEvents();  //Refresh event list
            } else {
                alert("Failed to create event. Please try again.");
            }
        } catch (err) {
            setError("Error creating event. Please try again later.");
            console.error("Event creation error:", err);
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
                                        onClick={() => handleDeleteEvent(event.id)}>Delete Event</button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Show "Create Event" button if form is not visible */}
                {!showForm && (
                    <button className="create-event-button" onClick={() => setShowForm(true)}>
                        Create Events
                    </button>
                )}

                {/* Show the form when "Create Event" button is clicked */}
                {showForm && (
                    <form className="create-event-form" onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="eventName">Event Name:</label>
                            <input
                                type="text"
                                id="eventName"
                                name="eventName"
                                placeholder="Enter event name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventDescription">Event Description:</label>
                            <textarea
                                id="eventDescription"
                                name="eventDescription"
                                placeholder="Describe your event"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventDate">Event Date:</label>
                            <input
                                type="date"
                                id="eventDate"
                                name="eventDate"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="startTime">Start Time:</label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endTime">End Time:</label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
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