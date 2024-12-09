import React, { useState } from "react";
import axios from "axios";
import "./OrderTrackingPage.css";
import "animate.css"; // Import Animate.css for animations
import WOW from "wowjs"; // Import Wow.js

const statusColors = {
  Shipped: "text-success",
  Delivered: "text-secondary",
  Pending: "text-warning",
  Cancelled: "text-danger",
};

new WOW.WOW({
  live: false, // Ensures animations trigger only once
}).init();

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const fetchOrderDetails = async (id) => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/orderTracking/${id}`,
      );
      setOrderDetails(response.data);
      setError("");
    } catch (err) {
      setOrderDetails(null);
      setError("No order found with this ID.");
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const handleSearch = () => {
    if (orderId.trim()) {
      fetchOrderDetails(orderId.trim());
    } else {
      setError("Please enter an order ID.");
    }
  };

  return (
    <div className="container-fluid tracking-box">
      <h2 className="text-center mb-4 text-warning wow animate__animated animate__fadeInUp">
        Order Tracking
      </h2>
      <div className="container-fluid row wow animate__animated animate__fadeInUp">
        <div className="col-lg-6 mx-auto">
          <div className="container-fluid card shadow border-light">
            <div className="container-fluid card-body">
              <h5 className="card-title mb-4 text-warning">Track Your Order</h5>
              <div className="mb-3">
                <label htmlFor="orderIdInput" className="form-label">
                  Enter Order ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="orderIdInput"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. 12345"
                />
              </div>
              <button className="btn btn-primary" onClick={handleSearch}>
                Track Order
              </button>
              {error && (
                <div className="alert alert-danger mt-3 text-black">
                  {error}
                </div>
              )}
              {loading && <div className="text-info mt-3">Loading...</div>}{" "}
              {/* Loading indicator */}
            </div>
          </div>
        </div>
      </div>
      {orderDetails && (
        <div className="row mt-5 wow animate__animated animate__fadeInUp">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow border-light">
              <div className="card-body">
                <h5 className="card-title text-warning">Order Details</h5>
                <div className="order-details text-warning">
                  <p>
                    <strong className="text-warning">Order ID:</strong>{" "}
                    <span className="detail-value">{orderDetails.orderId}</span>{" "}
                    {/* Use orderId instead of _id */}
                  </p>
                  <p>
                    <strong className="text-warning">Status:</strong>{" "}
                    <span
                      className={`detail-value ${statusColors[orderDetails.status]}`}
                    >
                      {orderDetails.status}
                    </span>
                  </p>
                  <p>
                    <strong className="text-warning">Total Amount Due:</strong>{" "}
                    <span className="detail-value">
                      {orderDetails.totalPrice || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong className="text-warning">Items:</strong>
                  </p>
                  <ul className="list-unstyled">
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                      orderDetails.items.map((item, index) => (
                        <li
                          key={index}
                          className="d-flex justify-content-between"
                        >
                          <span>{item.name}</span>
                          <span>{item.quantity} pcs</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-black">No items found.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
