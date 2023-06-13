import "./../style/header.css";
import { React, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ShowUserContexts } from "../App";
import { DispatchUserContexts } from "../App";
import apiService from "../api/apiService";

function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const userContext = ShowUserContexts();
  const UserDispatcher = DispatchUserContexts();
  const [logOut, setLogOut] = useState(false);
  const checkIfUserIsAuthenticated = () => {
    const user = apiService.getUser();
    if (user) {
      UserDispatcher({
        authenticated: true,
        data: user,
      });
    }
  };

  const signout = () => {
    apiService.logout();
    UserDispatcher({
      authenticated: false,
      data: {},
    });
    setLogOut(true);
  };
  useEffect(() => {
    checkIfUserIsAuthenticated();
  }, []);
  useEffect(() => {}, [userContext]);
  return (
    <div id="header">
      {/* {logOut && <Navigate to="/" />} */}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z" />
                </svg>
                {userContext.data && (
                  <a href="#" className="user-name">
                    {userContext.data.name}
                  </a>
                )}
              </li>

              {userContext.data &&
              (userContext.data.role == "WAITER" ||
                userContext.data.role == "CHEF") ? (
                <li>
                  <Link to="/order-items">Order Items</Link>
                </li>
              ) : null}

              {userContext.data && userContext.data.role == "WAITER" ? (
                <li>
                  <Link to="/reservations">All Reservations</Link>
                </li>
              ) : null}

              {userContext.data && userContext.data.role == "CUSTOMER" ? (
                <li>
                  <Link
                    to="/make-reservation"
                    className="btn btn-success text-white"
                  >
                    Make Reservation
                  </Link>
                </li>
              ) : null}
              {userContext.data && userContext.data.role == "CUSTOMER" ? (
                <li>
                  <Link to="/customerPortal">My Reservations</Link>
                </li>
              ) : null}
              {userContext.authenticated && (
                <li>
                  <Link onClick={() => signout()}>Sign out</Link>
                </li>
              )}
              {!userContext.authenticated && (
                <li>
                  <Link to="/signin">Sign in</Link>
                </li>
              )}
              {!userContext.authenticated && (
                <li>
                  <Link to="/signup">Sign up</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Navigation;
