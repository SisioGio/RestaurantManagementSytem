import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div id="footer-content">
        <div className="link">
          <h3>Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="support">
          <h3>Support</h3>

          <ul>
            <li>
              <Link to="/how-to-buy-ether">How to pay with ether</Link>
            </li>
            <li>
              <Link to="/tickets">Open a ticket</Link>
            </li>
          </ul>
        </div>
        <div className="social">
          <h3>Contacts</h3>
          <div className="" id="social">
            <a href="#@JuventusEthShop">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="#@JuventusEthShop">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#@JuventusEthShop">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#@JuventusEthShop">
              <i className="fa fa-envelope"></i>
            </a>
            <a href="#@JuventusEthShop">
              <i className="fa fa-phone"></i>
            </a>
          </div>
          <h5>Developed by @Alessio Giovannini</h5>
          <h5>Via S. Agostino 42, 01100, Viterbo (VT)</h5>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
