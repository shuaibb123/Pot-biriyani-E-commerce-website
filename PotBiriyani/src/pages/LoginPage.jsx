import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css";
import "animate.css";
import WOW from "wowjs";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const wow = new WOW.WOW();
  wow.init();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Store token and user email in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("userId", response.data.user.id);

        // Success notification
        toast.success("Login successful!");

        console.log("Token:", localStorage.getItem("token"));
        console.log("User Email:", localStorage.getItem("userEmail"));
        console.log("User ID:", localStorage.getItem("userId"));

        // Redirect to profile page after delay
        setTimeout(() => {
          navigate("/userprofile");
        }, 2000);
      }
    } catch (err) {
      console.error(
        "Login request error:",
        err.response ? err.response.data : err,
      );
      if (err.response && err.response.data.errors) {
        toast.error(
          err.response.data.errors.map((error) => error.msg).join(", "),
        );
      } else if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col login-container-main justify-center font-[sans-serif] sm:h-screen p-4 wow animate__animated animate__fadeInUp">
      <ToastContainer
        position="top-right"
        autoClose={3000} // Notification will disappear after 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-md w-full login-container1 mx-auto border border-gray-300 rounded-2xl p-8 wow animate__animated animate__fadeInUp">
        <div className="text-center mb-10 ff-secondary text-warning fw-normal text-4xl">
          Pot Biriyani
        </div>
        <div className="text-left mb-3 text-warning font-bold text-2xl">
          Login
        </div>
        <form onSubmit={handleLogin}>
          <div className="space-y-6">
            <div>
              <label
                className="text-warning text-sm mb-2 block"
                htmlFor="email"
              >
                Email Id
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="text-warning bg-black border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="text-warning text-sm mb-2 block"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="text-warning bg-black border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="!mt-12">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md focus:outline-none login-Btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <p className="text-warning text-sm mt-6 text-center">
            Ain't got an account?{" "}
            <Link
              to="/register"
              className="text-warning font-semibold hover:underline ml-1"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
