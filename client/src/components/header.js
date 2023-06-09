import "./../style/header.css";
import { React, useState } from "react";
import { Link } from "react-router-dom";
function Navigation() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="header">
      <header>
        <div class="container">
          <div class="title">My Website</div>
          <a className="toggle-menu " onClick={() => setExpanded(!expanded)}>
            <span></span>
            <span></span>
            <span></span>
          </a>
          <nav>
            <ul class={`nav-links ${expanded ? " visible" : ""}`}>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/signin">Sign in</Link>
              </li>
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navigation;
