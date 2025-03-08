import { useState } from "react";
import Navbar from "./Navbar"; // Import Navbar
import "./CreateEventForm.css";

function EventPage() {
    const [showForm, setShowForm] = useState(false); // State to control form visibility

    const handleFormSubmit = (event) => {
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
        console.log("Form submitted");
        setShowForm(false); // Hide the form after submission
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
                        Create Event
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