import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaCog,
  FaBox,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [shippingDetails, setShippingDetails] = useState(null);
  const [shippingError, setShippingError] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/userprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      setError("Failed to fetch user profile");
    }
  };

  const fetchShippingDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShippingError("No token found");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:3000/shipping-details",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShippingDetails(response.data);
      setAddress(response.data.address || "");
      setCity(response.data.city || "");
      setState(response.data.state || "");
      setPostalCode(response.data.postalCode || "");
      setCountry(response.data.country || "");
    } catch (err) {
      setShippingError("Failed to fetch shipping details");
    }
  };

  useEffect(() => {
    if (activeSection === "profile") {
      fetchUserProfile();
    } else if (activeSection === "shipping") {
      fetchShippingDetails();
    } else if (activeSection === "orders") {
      fetchOrders();
    }
  }, [activeSection]);

  const handleEmailChange = (e) => setNewEmail(e.target.value);

  const handleEmailUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setEmailError("No token found");
      return;
    }
    if (!newEmail) {
      setEmailError("Email cannot be empty");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:3000/userprofile",
        { email: newEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUser((prevUser) => ({ ...prevUser, email: response.data.email }));
      localStorage.setItem("token", response.data.token);
      setEmailSuccess("Email updated successfully");
      setEmailError("");
    } catch (err) {
      setEmailError(err.response?.data?.error || "Failed to update email");
      setEmailSuccess("");
    }
  };

  const handlePasswordChange = (e) => {
    if (e.target.name === "oldPassword") {
      setOldPassword(e.target.value);
    } else if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    }
  };

  const handlePasswordUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPasswordError("No token found");
      return;
    }
    if (!oldPassword || !newPassword) {
      setPasswordError("Both fields are required");
      return;
    }
    try {
      await axios.put(
        "http://localhost:3000/change-password",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPasswordSuccess("Password updated successfully");
      setPasswordError("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.error || "Failed to update password",
      );
      setPasswordSuccess("");
    }
  };

  const handleShippingDetailsChange = (e) => {
    switch (e.target.name) {
      case "address":
        setAddress(e.target.value);
        break;
      case "city":
        setCity(e.target.value);
        break;
      case "state":
        setState(e.target.value);
        break;
      case "postalCode":
        setPostalCode(e.target.value);
        break;
      case "country":
        setCountry(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleShippingDetailsUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShippingError("No token found");
      return;
    }
    try {
      await axios.put(
        "http://localhost:3000/shipping-details",
        { address, city, state, postalCode, country },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShippingDetails({ address, city, state, postalCode, country });
      setShippingError("");
    } catch (err) {
      setShippingError(
        err.response?.data?.error || "Failed to update shipping details",
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      await axios.delete("http://localhost:3000/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete account");
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("No token or user ID found");
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/orders/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const renderSection = () => {
    if (activeSection === "profile") {
      return (
        <div className="profile-section">
          <p className="profile-section-title">Profile</p>
          {user ? (
            <div className="profile-card">
              <div className="profile-info">
                <p className="text-warning">
                  <strong className="text-warning">Email:</strong> {user.email}
                </p>
                <div className="update-form text-warning">
                  <h3 className="text-warning">Update Email</h3>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <div className="alert alert-danger">{emailError}</div>
                  )}
                  {emailSuccess && (
                    <div className="alert alert-success">{emailSuccess}</div>
                  )}
                  <button className="profile-Btn" onClick={handleEmailUpdate}>
                    Update Email
                  </button>
                </div>
                <div className="update-form-pswd text-warning">
                  <h3 className="text-warning">Change Password</h3>
                  <input
                    type="password"
                    name="oldPassword"
                    className="form-control"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={handlePasswordChange}
                  />
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                  />
                  {passwordError && (
                    <div className="alert alert-danger">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="alert alert-success">{passwordSuccess}</div>
                  )}
                  <button
                    className="profile-Btn"
                    onClick={handlePasswordUpdate}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
    }

    if (activeSection === "settings") {
      return (
        <div className="settings-section-content">
          <p className="settings-section-title">Settings</p>
          <div className="settings-actions">
            <button
              className="lg-settings-Btn"
              onClick={handleLogout}
              aria-label="Log out of your account"
              title="Log out of your account"
            >
              <FaSignOutAlt /> Logout
            </button>
            <p className="btn-description text-warning">
              Log out to end your session.
            </p>

            <button
              className="del-settings-Btn"
              onClick={handleDeleteAccount}
              aria-label="Delete your account permanently"
              title="Delete your account permanently"
            >
              <FaTrash /> Delete Account
            </button>
            <p className="btn-description text-warning">
              This will permanently delete your account and all associated data.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>
      );
    }

    if (activeSection === "orders") {
      return (
        <div className="orders-section-content">
          <p className="orders-section-title">My Orders</p>
          {loadingOrders ? (
            <div className="alert alert-info">Loading orders...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : orders.length > 0 ? (
            <ul className="list-group">
              {orders.map((order) => {
                const orderDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A";
                const orderTotal = order.totalPrice
                  ? order.totalPrice.toFixed(2)
                  : "N/A";
                const orderStatus = order.status || "N/A";
                const orderId = order.orderId || "N/A"; // Fetching and displaying the orderId

                return (
                  <li
                    className="orders-section-list-group-item"
                    key={order._id}
                  >
                    <h5 className="text-warning">Order ID: {orderId}</h5>{" "}
                    {/* Displaying orderId */}
                    <p className="text-warning">
                      <strong className="text-warning">Date:</strong>{" "}
                      {orderDate}
                    </p>
                    <p className="text-warning">
                      <strong className="text-warning">Total:</strong> LKR{" "}
                      {orderTotal}
                    </p>
                    <p className="text-warning">
                      <strong className="text-warning">Status:</strong>{" "}
                      {orderStatus}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="alert alert-info">No orders found</div>
          )}
        </div>
      );
    }

    if (activeSection === "shipping") {
      return (
        <div className="shipping-section-content">
          <p className="shipping-section-title">Shipping Details</p>
          {shippingError && (
            <div className="alert alert-danger">{shippingError}</div>
          )}
          {shippingDetails ? (
            <div className="shipping-details">
              <p className="text-warning">
                <strong className="text-warning">Address:</strong>{" "}
                {shippingDetails.address}
              </p>
              <p className="text-warning">
                <strong className="text-warning">City:</strong>{" "}
                {shippingDetails.city}
              </p>
              <p className="text-warning">
                <strong className="text-warning">State:</strong>{" "}
                {shippingDetails.state}
              </p>
              <p className="text-warning">
                <strong className="text-warning">Postal Code:</strong>{" "}
                {shippingDetails.postalCode}
              </p>
              <p className="text-warning">
                <strong className="text-warning">Country:</strong>{" "}
                {shippingDetails.country}
              </p>
              <div className="update-form text-warning">
                <h3 className="text-warning">Update Shipping Details</h3>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Address"
                  value={address}
                  onChange={handleShippingDetailsChange}
                />
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="City"
                  value={city}
                  onChange={handleShippingDetailsChange}
                />
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  placeholder="State"
                  value={state}
                  onChange={handleShippingDetailsChange}
                />
                <input
                  type="text"
                  name="postalCode"
                  className="form-control"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={handleShippingDetailsChange}
                />
                <input
                  type="text"
                  name="country"
                  className="form-control"
                  placeholder="Country"
                  value={country}
                  onChange={handleShippingDetailsChange}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleShippingDetailsUpdate}
                >
                  Update Shipping Details
                </button>
              </div>
            </div>
          ) : (
            <div className="alert alert-danger">
              No shipping details found. Please enter your shipping details.
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="section-content">
        <p>Select a section from the sidebar.</p>
      </div>
    );
  };

  return (
    <div className="user-profile">
      <div className="user-profile-sidebar">
        <button
          className="btn btn-light"
          onClick={() => setActiveSection("profile")}
        >
          <FaUser /> Profile
        </button>
        <button
          className="btn btn-light"
          onClick={() => setActiveSection("settings")}
        >
          <FaCog /> Settings
        </button>
        <button
          className="btn btn-light"
          onClick={() => setActiveSection("orders")}
        >
          <FaBox /> Orders
        </button>
        <button
          className="btn btn-light"
          onClick={() => setActiveSection("shipping")}
        >
          <FaMapMarkerAlt /> Shipping
        </button>
      </div>
      <div className="content">{renderSection()}</div>
    </div>
  );
};

export default UserProfile;
