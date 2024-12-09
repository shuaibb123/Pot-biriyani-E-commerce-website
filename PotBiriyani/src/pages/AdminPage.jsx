import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminPage.css";
import styles from "./Orders.module.css";
import { Toaster, toast } from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orderDetails, setOrderDetails] = useState(null); // State for order details
  const [confirmDelete, setConfirmDelete] = useState(null); // For confirmation dialog
  const [pastOrders, setPastOrders] = useState([]); // State for past orders
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dishesCount, setDishesCount] = useState([]);
  const [dishChartData, setDishChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Orders",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async (endpoint, setData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(`Failed to fetch data from ${endpoint}`);
    }
  };

  useEffect(() => {
    switch (activeSection) {
      case "users":
        fetchData("http://localhost:3000/admin/users", setUsers);
        break;
      case "orders":
        fetchData("http://localhost:3000/admin/orders", setOrders);
        break;
      case "settings":
        fetchData("http://localhost:3000/admin/settings", setSettings);
        break;
      case "menu":
        fetchData("http://localhost:3000/admin/menu-items", setMenuItems);
        break;
      default:
        break;
    }
  }, [activeSection]);

  useEffect(() => {
    let interval;
    if (activeSection === "menu") {
      interval = setInterval(() => {
        fetchData("http://localhost:3000/admin/menu-items", setMenuItems);
      }, 1000); // Refresh every 10 seconds
    }
    return () => clearInterval(interval);
  }, [activeSection]);

  useEffect(() => {
    let interval;
    if (activeSection === "orders") {
      interval = setInterval(() => {
        fetchData("http://localhost:3000/admin/orders", setOrders);
      }, 1000); // Refresh every 10 seconds
    }
    return () => clearInterval(interval);
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSettingsUpdate = async (updatedSettings) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      await axios.put("http://localhost:3000/admin/settings", updatedSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(updatedSettings);
      setSuccess("Settings updated successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update settings");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      setError("Invalid user ID");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
      setSuccess("User deleted successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleAddMenuItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      let imageUrl = newMenuItem.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await axios.post(
          "http://localhost:3000/admin/upload-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      const response = await axios.post(
        "http://localhost:3000/admin/menu-items",
        {
          ...newMenuItem,
          image: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setMenuItems((prevMenuItems) => [...prevMenuItems, response.data]);

      setNewMenuItem({ name: "", description: "", price: "", image: "" });
      setImageFile(null);
      setSuccess("Menu item added successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to add menu item");
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem?._id) {
      setError("Invalid menu item");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      let imageUrl = newMenuItem.image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await axios.post(
          "http://localhost:3000/admin/upload-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      await axios.put(
        `http://localhost:3000/admin/menu-items/${editingItem._id}`,
        {
          ...newMenuItem,
          image: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((item) =>
          item._id === editingItem._id
            ? { ...item, ...newMenuItem, image: imageUrl }
            : item,
        ),
      );
      setEditingItem(null);
      setNewMenuItem({ name: "", description: "", price: "", image: "" });
      setImageFile(null);
      setSuccess("Menu item updated successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to update menu item");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/orders/${orderId}`,
        { status: newStatus },
      );

      if (newStatus === "cancelled") {
        setConfirmDelete(orderId); // Trigger confirmation dialog
      } else {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
        setSuccess("Order status updated successfully");
      }
    } catch (err) {
      setError("Failed to update order status");
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/admin/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
      setConfirmDelete(null); // Close confirmation dialog
      setSuccess("Order deleted successfully");
    } catch (err) {
      setError("Failed to delete order");
      console.error(err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null); // Close confirmation dialog
  };

  const handleEditMenuItem = (item) => {
    setEditingItem(item);
    setNewMenuItem({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });
  };

  const [staff, setStaff] = useState([]);
  const [staffDetails, setStaffDetails] = useState(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    position: "",
    salary: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/staff");
        setStaff(response.data);
      } catch (err) {
        setError("Failed to fetch staff");
        console.error(err);
      }
    };

    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5173/api/admin/staff",
        newStaff, // Ensure newStaff.position matches one of the enum values
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStaff((prevStaff) => [...prevStaff, response.data]);
      setNewStaff({
        name: "",
        email: "",
        position: "",
        salary: "",
        phone: "",
        address: "",
        status: "active",
      });
      setSuccess("Staff added successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Failed to add staff:", err); // Log the error
      setError("Failed to add staff");
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff?._id) {
      setError("Invalid staff member");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/admin/staff/${editingStaff._id}`,
        newStaff,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStaff((prevStaff) =>
        prevStaff.map((staff) =>
          staff._id === editingStaff._id ? { ...staff, ...newStaff } : staff,
        ),
      );
      setEditingStaff(null);
      setNewStaff({
        name: "",
        email: "",
        position: "",
        salary: "",
        phone: "",
        address: "",
        status: "active",
      });
      setSuccess("Staff updated successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to update staff");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!staffId) {
      setError("Invalid staff ID");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/admin/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStaff((prevStaff) =>
        prevStaff.filter((staff) => staff._id !== staffId),
      );
      setSuccess("Staff deleted successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to delete staff");
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/admin/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Set order details state here
      setOrderDetails(response.data);
    } catch (err) {
      setError("Failed to fetch order details");
    }
  };

  const handleViewDetails = async (staffId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/staff/${staffId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStaffDetails(response.data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch staff details");
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      email: staff.email,
      position: staff.position,
      salary: staff.salary,
      phone: staff.phone,
      address: staff.address,
      status: staff.status,
    });
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!itemId) {
      setError("Invalid menu item ID");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/admin/menu-items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMenuItems((prevMenuItems) =>
        prevMenuItems.filter((item) => item._id !== itemId),
      );
      setSuccess("Menu item deleted successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to delete menu item");
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/messages");
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        setError("Failed to fetch messages");
      }
    } catch (err) {
      setError("An error occurred while fetching messages");
    }
  };

  // Fetch messages from the backend
  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle delete message
  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessages(messages.filter((message) => message._id !== id));

        // Show toast notification for successful deletion
        toast.success("Message deleted successfully.", {
          position: "top-right",
        });
      } else {
        // Show toast notification for failure
        toast.error("Failed to delete message.", {
          position: "top-right",
        });
      }
    } catch (err) {
      // Show toast notification for error
      toast.error("An error occurred while deleting the message.", {
        position: "bottom-center",
      });
    }
  };

  const fetchPastOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage (or wherever it's stored)

      const response = await fetch("http://localhost:3000/admin/past-orders", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        // You might want to redirect the user to the login page here.
      } else {
        const data = await response.json();
        setPastOrders(data); // Set the fetched past orders
      }
    } catch (err) {
      setError("Failed to fetch past orders");
    }
  };

  const handleViewPastOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage

      const response = await fetch(
        `http://localhost:3000/admin/past-orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        // You might want to redirect the user to the login page here.
      } else if (!response.ok) {
        throw new Error("Failed to fetch past order details");
      } else {
        const data = await response.json();
        setOrderDetails(data); // Set the order details to show in the modal or details section
      }
    } catch (err) {
      setError("Failed to fetch past order details");
    }
  };

  function handleGenerateReport() {
    // Prepare the report data with the desired columns
    const reportData = orders.map((order) => ({
      id: order.orderId,
      status: order.status,
      items: order.items
        .map((item) => `${item.name} (Qty: ${item.quantity})`)
        .join(", "), // Concatenate item names with quantities
      total: order.totalPrice.toFixed(2),
    }));

    // Create CSV content with column headers
    const csvContent = [
      ["OrderID", "Status", "Items Ordered", "Total Price"], // Column titles
      ...reportData.map((e) => [e.id, e.status, e.items, e.total]), // Map data rows
    ]
      .map((e) => e.join(",")) // Join each row by commas
      .join("\n"); // Join rows by new lines

    // Create a URI and trigger a download
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "order_report.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click(); // Trigger the download
  }
  const filteredOrders = orders.filter(
    (order) => order.orderId && order.orderId.includes(searchQuery),
  );

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  useEffect(() => {
    fetchPastOrders();
    fetchTotalData(); // Call fetchTotalOrders when the component mounts
    fetchOrdersByDate();
    fetchDishCounts();
  }, []);

  const fetchTotalData = async () => {
    try {
      const response = await fetch("http://localhost:3000/totalOrders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch total orders and amount");
      }

      const data = await response.json();
      setTotalOrders(data.totalOrders); // Update state with total orders count
      setTotalAmount(data.totalAmount); // Update state with total amount
    } catch (err) {
      setError("Failed to fetch total data");
      console.error(err); // Log the error for debugging
    }
  };

  const fetchOrdersByDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/ordersByDate", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const labels = data.map((order) => order._id); // Dates
      const totals = data.map((order) => order.totalOrders); // Total orders

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Total Orders",
            data: totals,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching orders by date:", error);
    }
  };

  const newchartData = {
    labels: dishesCount.map((dish) => dish._id), // Dish names
    datasets: [
      {
        label: "Total Dishes Sold",
        data: dishesCount.map((dish) => dish.total), // Corresponding totals
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const fetchDishCounts = async () => {
    try {
      const response = await fetch("http://localhost:3000/totalDishesSold", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dish counts");
      }

      const data = await response.json();

      const labels = data.map((dish) => dish.name); // Get dish names
      const totals = data.map((dish) => dish.total); // Get quantities sold

      setDishChartData({
        labels,
        datasets: [
          {
            label: "Total Dishes Sold",
            data: totals,
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Change to a distinct color
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching dish counts:", error);
      // Handle error (e.g., show error message)
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-section card">
            <div className="card-body">
              <p className="card-title">Admin Dashboard</p>
              <p>
                Welcome to the admin dashboard. Use the sidebar to navigate
                through different sections.
              </p>
              {error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className="totals-container">
                  <div className="total-orders">
                    <h3>
                      Total Orders:
                      <span className="unique-badge">{totalOrders}</span>
                    </h3>
                  </div>
                  <div className="total-amount">
                    <h3>Total Amount: LKR {totalAmount.toFixed(2)}</h3>
                  </div>
                </div>
              )}

              {/* Chart for Total Orders */}
              <p className="plot-Titles">Total Orders</p>
              <div style={{ marginTop: "20px", height: "400px" }}>
                {chartData.labels.length > 0 && (
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                )}
              </div>

              {/* Chart for Total Dishes Sold */}
              <p className="plot-Titles">Total Dishes Sold</p>
              <div style={{ marginTop: "20px", height: "400px" }}>
                {dishChartData.labels.length > 0 && (
                  <Bar
                    data={dishChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="users-section card">
            <div className="card-body">
              <h1 className="card-title">Manage Users</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Search Bar */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <ul className="users-section-list-group">
                {filteredUsers.length === 0 ? (
                  <li>No users found.</li>
                ) : (
                  filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="users-section-list-group-item d-flex justify-content-between align-items-center"
                    >
                      {user.email}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className={styles.ordersSection}>
            <div className="card-body">
              <h1 className="card-title">Manage Orders</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Search Bar */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Order ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Report Generation Button */}
              <button
                className="btn btn-primary mb-3"
                onClick={handleGenerateReport}
              >
                Generate Report
              </button>

              {filteredOrders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <ul className="list-group">
                  {filteredOrders.map((order) => (
                    <li
                      key={order._id}
                      className="orders-list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong className="text-black">Order ID:</strong>{" "}
                        {order.orderId} <br />
                        <strong className="text-black">Status:</strong>{" "}
                        {order.status} <br />
                        <strong className="text-black">Total:</strong> LKR{" "}
                        {order.totalPrice.toFixed(2)} <br />
                      </div>
                      <div>
                        <button
                          className="btn btn-info btn-sm mr-2"
                          onClick={() => handleViewOrderDetails(order._id)}
                        >
                          View Details
                        </button>
                        <select
                          className="order-form-control text-black"
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Order details modal or section */}
              {orderDetails && (
                <div className={styles.orderDetails}>
                  <h2>Order Details</h2>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setOrderDetails(null)}
                  >
                    Close
                  </button>
                  <p>
                    <strong>Order ID:</strong> {orderDetails._id}
                  </p>
                  <p>
                    <strong>Status:</strong> {orderDetails.status}
                  </p>
                  <p>
                    <strong>Total Price:</strong> LKR{" "}
                    {orderDetails.totalPrice?.toFixed(2)}
                  </p>
                  <h3>Items:</h3>
                  <ul>
                    {orderDetails.items?.map((item, index) => (
                      <li key={index}>
                        <strong>{item.name}</strong>
                        <br />
                        Description: {item.description}
                        <br />
                        Price: LKR {item.price?.toFixed(2)}
                        <br />
                        Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <h3>Shipping Details:</h3>
                  <p>
                    {orderDetails.shippingDetails?.address},{" "}
                    {orderDetails.shippingDetails?.city},{" "}
                    {orderDetails.shippingDetails?.state},{" "}
                    {orderDetails.shippingDetails?.postalCode},{" "}
                    {orderDetails.shippingDetails?.country}
                  </p>
                </div>
              )}

              {/* Confirmation dialog for deletion */}
              {confirmDelete && (
                <div className="confirmation-dialog mt-4 p-3 border rounded">
                  <h3>Are you sure you want to delete this order?</h3>
                  <button
                    className="btn btn-danger mr-2"
                    onClick={() => handleDeleteOrder(confirmDelete)}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Past Orders Section */}
              <h1 className="card-title mt-5">Past Orders</h1>
              {pastOrders.length === 0 ? (
                <p>No past orders found.</p>
              ) : (
                <ul className="list-group">
                  {pastOrders.map((order) => (
                    <li
                      key={order._id}
                      className="orders-list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong className="text-black">Order ID:</strong>{" "}
                        {order._id} <br />
                        <strong className="text-black">Status:</strong>{" "}
                        {order.status} <br />
                        <strong className="text-black">Total:</strong> LKR{" "}
                        {order.totalPrice.toFixed(2)} <br />
                      </div>
                      <div>
                        <button
                          className="btn btn-info btn-sm mr-2"
                          onClick={() => handleViewPastOrderDetails(order._id)}
                        >
                          View Past Details
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case "StaffManagement":
        return (
          <div className="StaffManagement-container">
            <div className="staff-list">
              {staff.length === 0 ? (
                <p className="text-muted">No staff members found.</p>
              ) : (
                <ul className="list-group">
                  {staff.map((member) => (
                    <li
                      key={member._id}
                      className="StaffManagement-list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="staff-summary">
                        <strong className="text-black">Staff ID:</strong>{" "}
                        {member._id} <br />
                        <strong className="text-black">Name:</strong>{" "}
                        {member.name} <br />
                        <strong className="text-black">Status:</strong>{" "}
                        {member.status} <br />
                        <strong className="text-black">Salary:</strong> LKR{" "}
                        {Number(member.salary).toFixed(2)} <br />
                      </div>
                      <div className="staff-actions">
                        <button
                          className="btn btn-info btn-sm mr-6"
                          onClick={() => handleViewDetails(member._id)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-warning btn-sm mr-2"
                          onClick={() => handleEditStaff(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteStaff(member._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add/Edit Staff Form */}
            {(editingStaff || newStaff) && (
              <div className="staff-form mt-4">
                <h2>{editingStaff ? "Edit Staff" : "Add New Staff"}</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    editingStaff ? handleUpdateStaff() : handleAddStaff();
                  }}
                >
                  <div className="form-group text-black">
                    <label>Name</label>
                    <input
                      type="text"
                      className="staff-column"
                      value={newStaff.name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group text-black">
                    <label>Email</label>
                    <input
                      type="email"
                      className="staff-column"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group text-black">
                    <label>Position</label>
                    <select
                      className="staff-column"
                      value={newStaff.position}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, position: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="Restaurant Manager">
                        Restaurant Manager
                      </option>
                      <option value="Head Chef (Biryani Specialist)">
                        Head Chef (Biryani Specialist)
                      </option>
                      <option value="Sous Chef">Sous Chef</option>
                      <option value="Biryani Cook">Biryani Cook</option>
                      <option value="Prep Cook">Prep Cook</option>
                      <option value="Server/Waiter">Server/Waiter</option>
                      <option value="Host/Hostess">Host/Hostess</option>
                      <option value="Busser">Busser</option>
                      <option value="Dishwasher">Dishwasher</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Delivery Driver">Delivery Driver</option>
                    </select>
                  </div>
                  <div className="form-group text-black">
                    <label>Salary</label>
                    <input
                      type="number"
                      className="staff-column"
                      value={newStaff.salary}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, salary: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group text-black">
                    <label>Phone</label>
                    <input
                      type="text"
                      className="staff-column"
                      value={newStaff.phone}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group text-black">
                    <label>Address</label>
                    <input
                      type="text"
                      className="staff-column"
                      value={newStaff.address}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group text-black">
                    <label>Status</label>
                    <select
                      className="staff-column"
                      value={newStaff.status}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingStaff ? "Update Staff" : "Add Staff"}
                  </button>
                </form>
              </div>
            )}

            {/* Staff Details Modal or Section */}
            {staffDetails && (
              <div className="staff-details mt-4 p-3 border rounded">
                <h2>Staff Details</h2>
                <button
                  className="btn btn-secondary"
                  onClick={() => setStaffDetails(null)}
                >
                  Close
                </button>
                <div className="staff-details-content mt-2">
                  <p>
                    <strong>Staff ID:</strong> {staffDetails._id}
                  </p>
                  <p>
                    <strong>Name:</strong> {staffDetails.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {staffDetails.email}
                  </p>
                  <p>
                    <strong>Status:</strong> {staffDetails.status}
                  </p>
                  <p>
                    <strong>Salary:</strong> LKR{" "}
                    {staffDetails.salary.toFixed(2)}
                  </p>
                  <p>
                    <strong>Phone:</strong> {staffDetails.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {staffDetails.address}
                  </p>
                  <p>
                    <strong>Position:</strong> {staffDetails.position}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="settings-section card">
            <div className="card-body">
              <h1 className="card-title">Settings</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {settings ? (
                <div>
                  <div className="form-group">
                    <label htmlFor="siteTitle">Site Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="siteTitle"
                      value={settings.siteTitle}
                      onChange={(e) =>
                        setSettings({ ...settings, siteTitle: e.target.value })
                      }
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSettingsUpdate(settings)}
                  >
                    Save Settings
                  </button>
                </div>
              ) : (
                <p>Loading settings...</p>
              )}
            </div>
          </div>
        );

      case "menu":
        return (
          <div className="menu-section card">
            <div className="card-body">
              <h1 className="card-title">
                {editingItem ? "Update Menu Item" : "Add Menu Item"}
              </h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <div className="form-group text-black">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="menu-form-control"
                  id="name"
                  value={newMenuItem.name}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group text-black">
                <label htmlFor="description">Description</label>
                <textarea
                  className="menu-form-control"
                  id="description"
                  value={newMenuItem.description}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="form-group text-black">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="menu-form-control"
                  id="price"
                  value={newMenuItem.price}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, price: e.target.value })
                  }
                />
              </div>
              <div className="form-group text-black">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="menu-form-control"
                  id="image"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <button
                className={`btn btn-custom ${editingItem ? "btn-edit" : "btn-primary"}`}
                onClick={editingItem ? handleUpdateMenuItem : handleAddMenuItem}
              >
                {editingItem ? "Update Menu Item" : "Add Menu Item"}
              </button>
              <ul className="list-group mt-3">
                {menuItems.map((item) => (
                  <li
                    key={item._id}
                    className="menu-list-group-item d-flex justify-content-between align-items-center"
                  >
                    <img
                      src={`http://localhost:3000${item.image}`}
                      alt={item.name}
                      width="50"
                    />
                    {item.name} - LKR {item.price}
                    <div>
                      <button
                        className="btn btn-custom btn-edit btn-sm"
                        onClick={() => handleEditMenuItem(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-custom btn-delete btn-sm ml-2"
                        onClick={() => handleDeleteMenuItem(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="message-manager card">
            <div className="card-body">
              <h1 className="card-title">Manage Messages</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <ul className="list-group mt-3">
                {messages.map((message) => (
                  <li
                    key={message._id}
                    className="message-manager-list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{message.name}</strong> ({message.email})
                      <p>{message.message}</p>
                    </div>
                    <button
                      className="btn btn-custom btn-delete btn-sm"
                      onClick={() => handleDeleteMessage(message._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <Toaster position="top-right" reverseOrder={false} />{" "}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="adminpage-container">
      <div className="sidebar">
        <h3>Admin Menu</h3>
        <ul className="list-group">
          <li
            className={`list-group-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={`list-group-item ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            User Management
          </li>
          <li
            className={`list-group-item ${activeSection === "orders" ? "active" : ""}`}
            onClick={() => setActiveSection("orders")}
          >
            Order Management
          </li>
          <li
            className={`list-group-item ${activeSection === "StaffManagement" ? "active" : ""}`}
            onClick={() => setActiveSection("StaffManagement")}
          >
            Staff Management
          </li>
          <li
            className={`list-group-item ${activeSection === "settings" ? "active" : ""}`}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </li>
          <li
            className={`list-group-item ${activeSection === "menu" ? "active" : ""}`}
            onClick={() => setActiveSection("menu")}
          >
            Menu Management
          </li>
          <li
            className={`list-group-item ${activeSection === "messages" ? "active" : ""}`}
            onClick={() => setActiveSection("messages")}
          >
            User Responses
          </li>
          <li className="list-group-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="content">{renderSection()}</div>
    </div>
  );
};

export default AdminPage;
