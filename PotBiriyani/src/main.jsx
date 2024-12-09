import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router.jsx"; // Import your router configuration
import { CartProvider } from "./contexts/CartContext.jsx"; // Import CartProvider
import { UserProvider } from "./contexts/UserContext.jsx"; // Import UserProvider
import "./index.css"; // Ensure custom CSS is imported
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      {/* Wrap with UserProvider */}
      <CartProvider>
        {/* Wrap with CartProvider */}
        <RouterProvider router={router} />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>,
);
