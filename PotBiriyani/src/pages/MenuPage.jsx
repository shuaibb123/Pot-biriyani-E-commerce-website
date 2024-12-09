import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import { Toaster, toast } from "react-hot-toast";
import "./MenuPage.css"; // Ensure this is imported
import "animate.css"; // Import Animate.css for animations
import WOW from "wowjs"; // Import Wow.js

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const [showSearchSort, setShowSearchSort] = useState(false); // State to control visibility
  const { addToCart } = useCart();

  // Initialize WOW.js for scroll animations
  useEffect(() => {
    new WOW.WOW({
      live: false, // Ensures animations trigger only once
    }).init();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("/api/menu-items");
        console.log("Fetched menu items:", response.data);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <p className="text-light">Loading...</p>;
  if (error) return <p className="text-light">Error: {error}</p>;

  const handleAddToCart = (item) => {
    if (item._id) {
      addToCart(item._id);
      toast.success(`${item.name} added to cart!`, {
        position: "bottom-center",
      });
    } else {
      console.error("Item ID is undefined");
    }
  };

  // Function to handle sorting
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Filter and sort menu items based on search term and sort order
  const filteredItems = menuItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price,
    );

  // Toggle search and sort controls visibility
  const toggleSearchSort = () => {
    setShowSearchSort((prev) => !prev);
  };

  return (
    <div className="container-xxl py-12">
      <div className="container-fluid">
        <div
          className="text-center wow animate__animated animate__fadeInUp"
          data-wow-delay="0.1s"
        >
          <h3 className="section-title ff-secondary text-warning fw-normal mt-5">
            Our Menu
          </h3>
          <h1 className="section-subheading mb-5 mt-4 wow animate__animated animate__fadeInUp">
            Delicious Dishes
          </h1>
        </div>
        <div className="menu-search-sort-section wow animate__animated animate__fadeInUp">
          {/* Search and Sort Button */}
          <button
            className="menu-search-sort-button wow animate__animated animate__fadeInUp"
            onClick={toggleSearchSort}
          >
            Search and Sort
          </button>

          {/* Conditionally render search and sort controls */}
          {showSearchSort && (
            <div className="menu-search-sort-container wow animate__animated animate__fadeInUp">
              <input
                type="text"
                placeholder="Search menu items..."
                className="menu-search-input" // Unique class
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select menu-sort-select" // Unique class
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
        <div className="row">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="col-lg-3 col-md-6 mb-4 wow animate__animated animate__fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="card bg-dark text-light border-light">
                  <img
                    src={
                      item.image
                        ? `http://localhost:3000${item.image}`
                        : "/path/to/placeholder.jpg"
                    }
                    className="card-img-top"
                    alt={item.name}
                  />
                  <div className="menu-card-body">
                    <p className="menu-card-title text-white">{item.name}</p>
                    <p className="card-text">{item.description}</p>
                    <p className="card-price">LKR {item.price}</p>
                    <div className="d-flex justify-content-start mt-3">
                      <button
                        className="menuBtn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No menu items available.</p>
          )}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
};

export default MenuPage;
