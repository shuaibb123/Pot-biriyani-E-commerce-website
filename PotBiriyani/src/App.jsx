// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "animate.css";
import "wowjs";

import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import ContactUsPage from "./pages/ContactUsPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminPage from "./pages/AdminPage";
import PaymentPage from "./pages/PaymentPage";
import PrivacyPolicy from "./components/privacyPolicy";
import ChatBot from "./pages/chatBot";

// ErrorBoundary component definition
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/menupage" element={<MenuPage />} />
              <Route path="/cartpage" element={<CartPage />} />
              <Route path="/contactus" element={<ContactUsPage />} />
              <Route
                path="/ordertrackingpage"
                element={<OrderTrackingPage />}
              />
              <Route path="/adminpage" element={<AdminPage />} />
              <Route path="/paymentpage" element={<PaymentPage />} />
              <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/chatBot" element={<ChatBot />} />

              {/* Add additional routes here if needed */}
            </Routes>
          </ErrorBoundary>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
