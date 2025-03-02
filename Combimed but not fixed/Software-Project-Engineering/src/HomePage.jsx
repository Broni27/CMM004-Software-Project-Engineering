import React from "react";
import { Link } from 'react-router-dom';
import logo from './assets/logo.svg';
import profile from './assets/profile.svg';
import './Styles.css';

const HomePage = () => {
  return (
    <>
      <div className="body-container">
        <p>Plan and organize events easily</p>
        <button onClick={() => (window.location.href = "/profile")}>
          Create Event
        </button>
      </div>
    </>
  );
};

export default HomePage;
