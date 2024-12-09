import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "./LoginPage.css";
import "animate.css";
import WOW from "wowjs";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const wow = new WOW.WOW();
  wow.init();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      toast.error("Passwords do not match"); // Show error toast
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        email,
        password,
      });
      toast.success(response.data.message); // Show success toast
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to register"); // Show error toast
    }
  };

  return (
    <div className="flex flex-col login-container-main justify-center font-[sans-serif] sm:h-screen p-4 wow animate__animated animate__fadeInUp">
      <div className="max-w-md login-container1 w-full mx-auto border border-gray-300 rounded-2xl p-8 wow animate__animated animate__fadeInUp">
        <div className="text-center mb-10 ff-secondary text-warning fw-normal text-4xl">
          Pot Biriyani
        </div>
        <div className="text-left mb-3 text-warning font-bold text-2xl">
          Register
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="text-warning text-sm mb-2 block">
                Email Id
              </label>
              <input
                name="email"
                type="text"
                className="text-warning bg-black border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-warning text-sm mb-2 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="text-warning bg-black border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-warning text-sm mb-2 block">
                Confirm Password
              </label>
              <input
                name="cpassword"
                type="password"
                className="text-warning bg-black border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-warning border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="text-warning ml-3 block text-sm"
              >
                I accept the{" "}
                <a
                  href="javascript:void(0);"
                  className="text-warning font-semibold hover:underline ml-1"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>
          <div className="!mt-12">
            <button
              type="submit"
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md login-Btn focus:outline-none"
            >
              Create an account
            </button>
          </div>
          <p className="text-warning text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-warning font-semibold hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Add ToastContainer */}
    </div>
  );
};

export default RegisterPage;
