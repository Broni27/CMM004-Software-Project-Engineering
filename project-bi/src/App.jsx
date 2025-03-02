import { useState } from "react";
import "./App.css";
import CreateEventForm from "./CreateEventForm";

function App() {
  const [showForm, setShowForm] = useState(false);

  const handleCreateEventClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
  };

  return (
    <div className="card">
      {!showForm && (
        <button
          className="create-event-button"
          onClick={handleCreateEventClick}
        >
          Create Event
        </button>
      )}
      {showForm && <CreateEventForm onSubmit={handleFormSubmit} />}
    </div>
  );
}

export default App;
