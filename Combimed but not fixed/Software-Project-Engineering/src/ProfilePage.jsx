import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.svg";
import profile from "./assets/profile.svg";
import "./Styles.css";

const ProfilePage = () => {
  return (
    <>
      <div className="body-container">
        <div className="user-info">
          <img src="./img/Frame 10.png" alt="" />
          <span>
            <p>Name : Example Example</p>
            <p>E-Mail : example@example.com</p>
          </span>
        </div>
        <div className="event-info">
          <p>Nearest Event</p>
          <div className="event-box">
            <div className="event-head">
              <h4>Event Name</h4>
            </div>
            <div className="event-description">
              <img src="./img/img-icon.png" alt="" />
              <span>
                <h5>Description</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Labore sed laboriosam ex quam rem est reprehenderit similique!
                  Architecto, asperiores dolore provident error tenetur
                  praesentium a ratione et assumenda ea aperiam.
                </p>
              </span>
            </div>
            <div className="event-footer">
              <span className="event-footer-span">
                <p>Event Organizer :</p>
                <img src="./img/Frame 10.png" alt="" />
                <span>
                  <p>Name</p>
                </span>
              </span>
              <button id="join-btn">Join</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
