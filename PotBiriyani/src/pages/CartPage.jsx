import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useCart } from "../contexts/CartContext";
import "./CartPage.css"; // Import the CSS file

const CartPage = () => {
  const {
    cartItems,
    clearCart,
    getTotalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <div className="container-fluid py-5 mt-5">
      <h1 className="text-center mb-4 text-warning ff-secondary cart-title">
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-white">Your cart is empty.</p>
      ) : (
        <div className="cart-items-container">
          <ul className="list-group">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={
                      item.image
                        ? `http://localhost:3000${item.image}`
                        : "/path/to/placeholder.jpg"
                    }
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="ms-3">
                    <h5>{item.name}</h5>
                    <p>
                      Quantity:
                      <button
                        className="quantity-btn decrease"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        className="quantity-btn increase"
                        onClick={() => increaseQuantity(item._id)}
                      >
                        +
                      </button>
                    </p>
                  </div>
                </div>
                <div>
                  <span className="badge bg-primary rounded-pill">
                    LKR {(item.quantity * item.price).toFixed(2)}
                  </span>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="total-price-container mt-4">
            <h3 className="total-price">
              Total Price: LKR {totalPrice.toFixed(2)}
            </h3>
            <Link to="/paymentpage">
              <button className="btn btn-success btn-lg mt-3 checkout-btn">
                Checkout
              </button>
            </Link>
          </div>
          <div className="text-center mt-4">
            <button
              className="btn btn-danger btn-lg clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
