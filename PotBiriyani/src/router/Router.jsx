import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import RegisterPage from "../pages/RegisterPage"; // Import RegisterPage
import LoginPage from "../pages/LoginPage";
import UserProfile from "../pages/UserProfile";
import MenuPage from "../pages/MenuPage";
import CartPage from "../pages/CartPage";
import ContactUsPage from "../pages/ContactUsPage";
import OrderTrackingPage from "../pages/OrderTrackingPage";
import AdminPage from "../pages/AdminPage";
import PaymentPage from "../pages/PaymentPage";
import PrivacyPolicy from "../components/privacyPolicy";
import ChatBot from "../pages/chatBot";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />, // Main layout component
    children: [
      {
        path: "/", // Home page route
        element: <Home />,
      },
      {
        path: "register", // Register page route
        element: <RegisterPage />,
      },
      {
        path: "login", // Register page route
        element: <LoginPage />,
      },
      {
        path: "userprofile", // profile page route
        element: <UserProfile />,
      },
      {
        path: "menupage", // Menu page route
        element: <MenuPage />,
      },
      {
        path: "cart", // Menu page route
        element: <CartPage />,
      },
      {
        path: "contactus", // Menu page route
        element: <ContactUsPage />,
      },
      {
        path: "ordertrackingpage", // Menu page route
        element: <OrderTrackingPage />,
      },
      {
        path: "adminpage", // Menu page route
        element: <AdminPage />,
      },
      {
        path: "paymentpage", // Menu page route
        element: <PaymentPage />,
      },
      {
        path: "privacyPolicy", // Menu page route
        element: <PrivacyPolicy />,
      },
      {
        path: "chatBot", // Menu page route
        element: <ChatBot />,
      },
    ],
  },
]);

export default router;
