import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for internal routing
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import "@fortawesome/fontawesome-free/css/all.min.css"; // Ensure FontAwesome is included if you use its icons
import "./Footer.css"; // Import custom CSS

const Footer = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [message, setMessage] = useState(""); // State for feedback message

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    // Logic for handling email submission (e.g., API call)
    console.log("Email submitted:", email);

    // Provide feedback
    setMessage("Thank you for signing up!"); // Update with a success message
    setEmail(""); // Clear the input field after submission

    // Reset the message after a few seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="footer container-fluid">
      <div className="container-fluid">
        <div className="footer-content">
          <div className="footer-menu">
            <a href="#">Home</a>
            <Link to="/privacyPolicy">Privacy Policy</Link>
            <a href="#">Help</a>
            <a href="#">FAQs</a>
          </div>

          {/* Email Sign-Up Section */}
          <div className="email-signup">
            <h5 className="text-light">Sign Up for Email Updates</h5>
            <p>
              Stay ahead of the crowd with updates on our latest products,
              special promotions, exclusive content, events, and more!
            </p>
            <form onSubmit={handleEmailSubmit} className="d-flex">
              <label htmlFor="emailInput" className="visually-hidden">
                Email address
              </label>
              <input
                type="email"
                id="emailInput"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer-btn1 ms-2">
                Sign Up
              </button>
            </form>
            {message && <div className="mt-2 text-light">{message}</div>}{" "}
            {/* Display feedback message */}
          </div>

          <div className="copyright">
            2024 &copy; <a href="#">Pot Biriyani</a>, All Rights Reserved.
          </div>

          <div className="social-icons">
            <a
              className="btn btn-outline-dark btn-social"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const isMobile = /iPhone|iPad|iPod|Android/i.test(
                  navigator.userAgent,
                );
                const url = isMobile
                  ? "https://m.facebook.com/PotBiriyaniLK/"
                  : "https://web.facebook.com/PotBiriyaniLK/?_rdc=1&_rdr";
                window.location.href = url;
              }}
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              className="btn btn-outline-dark btn-social"
              href="https://www.instagram.com/potbiriyani.lk/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              className="btn btn-outline-dark btn-social"
              href="https://www.linkedin.com/company/potbiriyani/?originalSubdomain=lk"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
