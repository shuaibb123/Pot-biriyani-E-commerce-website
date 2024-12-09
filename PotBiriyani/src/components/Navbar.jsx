import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";
import icon2 from "../contexts/img/biryani.png";

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { cartItems } = useCart();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      setHidden(currentScroll > lastScrollTop);
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:3000/userprofile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser({ email: data.email });
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUserAuth();
  }, [setUser]);

  const handleAuthButtonClick = () => {
    if (user) {
      navigate("/userprofile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${hidden ? "hidden" : ""}`}>
      <a
        href="/"
        className="navbar-brand p-0 logo-margin d-flex align-items-center"
      >
        <img
          src={icon2}
          alt="Quality Food Icon"
          style={{
            width: "50px",
            height: "50px",
            marginTop: "0px",
          }}
        />
        <h1
          className="custom-logo m-0 ms-2 ff-secondary"
          style={{ fontSize: "2rem" }}
        >
          Pot Biriyani
        </h1>
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span
          className="fa fa-bars"
          aria-hidden="true"
          style={{ fontSize: "1.5rem" }}
        ></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav d-flex justify-content-center flex-grow-1">
          <Link
            to="/"
            className="nav-item nav-link nav-link-home"
            style={{ fontSize: "1.1rem" }}
          >
            Home
          </Link>
          <Link
            to="/menupage"
            className="nav-item nav-link nav-link-menu"
            style={{ fontSize: "1.1rem" }}
          >
            Menu
          </Link>
          <Link
            to="/contactus"
            className="nav-item nav-link nav-link-contact"
            style={{ fontSize: "1.1rem" }}
          >
            Contact Us
          </Link>

          <Link
            to="/ordertrackingpage"
            className="nav-item nav-link nav-link-contact"
            style={{ fontSize: "1.1rem" }}
          >
            Services
          </Link>
        </div>
        <div className="d-flex align-items-center">
          <Link
            to="/cart"
            className="btn btn-outline-dark position-relative me-2"
            style={{ fontSize: "1.1rem" }}
          >
            <i className="fa fa-shopping-cart"></i>
            {cartItems.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge custom-badge">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
          </Link>
          <button
            className="btn btn-primary py-2 px-4 regButton"
            style={{ fontSize: "1.1rem" }}
            onClick={handleAuthButtonClick}
          >
            {user ? "Profile" : "Register"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
