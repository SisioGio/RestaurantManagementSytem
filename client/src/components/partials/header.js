// client/src/App.js

import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import apiService from "../../services/apiService";
import { dispatchUserContexts, showUserContexts } from "./../../App";

function Header() {
  const userAuthDispatcher = dispatchUserContexts();
  const userAuth = showUserContexts();
  useEffect(() => {
    const checkIfAuthenticated = async () => {
      userAuthDispatcher({
        authenticated: await apiService.isAuthenticated(),
        admin: await apiService.isAuthenticated("admin"),
      });
    };
    checkIfAuthenticated();
  }, [userAuthDispatcher]);
  return (
    <div id="nav-container">
      <nav>
        <div>
          <div id="logo">
            <div>
              <img
                src="https://s21285.s3.amazonaws.com/ether_logo.png"
                alt="TIN10 Logo"
              ></img>
            </div>
            <label>Juventus Shop</label>
          </div>
          <div id="toggle" className="toggle-nav untoggled">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul id="nav-links" className="nav-hidden">
            <li>
              <Link to="/" title="Home">
                HOME
              </Link>
            </li>

            {userAuth.authenticated ? null : (
              <li>
                <Link to="/login" title="Login">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z" />
                  </svg>
                </Link>
              </li>
            )}

            <li>
              <Link to="/about" title="ABOUT">
                ABOUT
              </Link>
            </li>
            {/* 
            <h1>is admin : {userAuth.isAdmin.toString()}</h1> */}

            {userAuth.admin === true ? (
              <li>
                <Link to="/admin" title="ADMIN">
                  ADMIN
                </Link>
              </li>
            ) : userAuth.authenticated ? (
              <li>
                <Link to="/account" title="ACCOUNT">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z" />
                  </svg>
                </Link>
              </li>
            ) : null}

            {userAuth.authenticated ? (
              <li>
                <Link to="/logout" title="LOGOUT">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z" />
                  </svg>
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
