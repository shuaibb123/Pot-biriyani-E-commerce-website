// layout/Main.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Main = () => {
  const location = useLocation();

  // Check if the current path is the register or login page
  const isAuthPage =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/userprofile" ||
    location.pathname === "/adminpage" ||
    location.pathname === "/paymentpage" ||
    location.pathname === "/privacyPolicy";

  return (
    <div>
      {!isAuthPage && <Navbar />}{" "}
      {/* Render Navbar only if not on Register or Login Page */}
      <main>
        <Outlet /> {/* Renders the matched child route */}
      </main>
      {!isAuthPage && <Footer />}{" "}
      {/* Render Footer only if not on Register or Login Page */}
    </div>
  );
};

export default Main;
