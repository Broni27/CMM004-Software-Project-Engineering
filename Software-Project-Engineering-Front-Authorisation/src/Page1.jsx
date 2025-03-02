import React from "react";

function Page1() {
  return (
    <>
      {/* <section id="navbar">
        <nav className="navbar">
          <div className="nav-data">
            <div className="nav-icon">
              <a href="#">
                <img src="./img/Calender.png" alt="Calender" />
              </a>
            </div>
            <div className="nav-search">
              <ul>
                <li>
                  <a href="#" onclick="redirectToHome('page-1.html')">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#">Events</a>
                </li>
              </ul>
              <a href="#">
                <img src="./img/Frame 10.png" alt="" />
              </a>
            </div>
          </div>
        </nav>
      </section> */}
      <section id="body">
        <div className="body-container">
          <p>Plan and organize events easily</p>
          <button onclick="redirectToPage('page-2.html')">Create Event</button>
        </div>
      </section>
    </>
  );
}

export default Page1;
