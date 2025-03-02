import { useState } from "react";
import "./CreateEventForm.css";

function CreateEventForm({ onSubmit }) {
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
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="event-form">
      <div>
        <label htmlFor="eventName">Event Name:</label>
        <input type="text" id="eventName" name="eventName" required />
      </div>
      <div>
        <label htmlFor="eventDescription">Event Description:</label>
        <textarea id="eventDescription" name="eventDescription" required />
      </div>
      <div>
        <label htmlFor="eventDate">Event Date:</label>
        <input type="date" id="eventDate" name="eventDate" required />
      </div>
      <div>
        <label htmlFor="startTime">Start Time:</label>
        <input type="time" id="startTime" name="startTime" required />
      </div>
      <div>
        <label htmlFor="endTime">End Time:</label>
        <input type="time" id="endTime" name="endTime" required />
      </div>
      <div>
        <label htmlFor="eventLocation">Event Location:</label>
        <input type="text" id="eventLocation" name="eventLocation" required />
      </div>
      <div>
        <label htmlFor="organizerName">Organizer Name:</label>
        <input type="text" id="organizerName" name="organizerName" required />
      </div>
      <div>
        <label htmlFor="contactEmail">Contact Email:</label>
        <input type="email" id="contactEmail" name="contactEmail" required />
      </div>
      <div>
        <label htmlFor="numberOfAttendees">Number of Attendees:</label>
        <input
          type="number"
          id="numberOfAttendees"
          name="numberOfAttendees"
          required
        />
      </div>
      <div>
        <label htmlFor="priority">Priority:</label>
        <select id="priority" name="priority" required>
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="eventType">Event Type:</label>
        <select id="eventType" name="eventType" required>
          <option value="">Select Event Type</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CreateEventForm;
