import { useState } from "react";
import axios from "axios";      //Allows connection to backend through API calls
import Navbar from "./Navbar"; // Import Navbar
import "./CreateEventForm.css";

function EventPage() {
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [error, setError] = useState(null);

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
                form.reset(); //Clears form fields
            } else {
                alert("Failed to create event. Please try again.");
            }
        } catch (err) {
            setError("Error creating event. Please try agian later.");
            console.error("Event creation error:", err);
        }
    };

    return (
        <div>
            {/* Add Navbar at the top of the page */}
            <Navbar />

            {/* Add padding to the main content to avoid overlap with Navbar */}
            <div className="event-page-container" style={{ paddingTop: "80px" }}>
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