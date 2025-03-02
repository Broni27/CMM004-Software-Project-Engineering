import React, { useState } from "react";
import logo from "./assets/logo.svg";
import profile from "./assets/profile.svg";
import "./Styles.css";

const Navbar = ({ onPageChange }) => {
  const handleLinkClick = (event, page) => {
    event.preventDefault();
    onPageChange(page);
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="navbar-logo-img" />
      </div>
      <div className="navbar-links">
        <a
          href="#"
          className="navbar-link"
          onClick={(e) => handleLinkClick(e, "page1")}
        >
          Home
        </a>
        <a href="/events" className="navbar-link">
          Events
        </a>
        <a href="/profile" className="navbar-link">
          <img src={profile} alt="Profile" className="navbar-icon-img" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
