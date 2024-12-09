import "./ContactUsPage.css";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast"; // Import Toaster and toast from react-hot-toast
import "animate.css"; // Import Animate.css for animations
import WOW from "wowjs"; // Import Wow.js

const branches = [
  {
    id: 1,
    name: "Main Branch",
    address: "91D, Pepiliyana Road, Dehiwala-Mt-Lavania, Sri Lanka.",
    phone: "(+94) 777330938",
    hours: "Monday – Friday: 8:00 AM – 5:00 PM\nSaturday – Sunday: Closed",
  },
  {
    id: 2,
    name: "Branches",
    address: "102B, New Airport Road, Rathmalana, Sri Lanka.",
    phone: "(+94) 777330938",
    hours:
      "Monday – Friday: 9:00 AM – 6:00 PM\nSaturday – Sunday: 10:00 AM – 4:00 PM",
  },
  {
    id: 3,
    name: "Branches",
    address: "75/A2, Asiri Uyana, 3rd Lane, Battaramulla, Sri Lanka.",
    phone: "(+94) 777330938",
    hours:
      "Monday – Friday: 9:00 AM – 6:00 PM\nSaturday – Sunday: 10:00 AM – 4:00 PM",
  },
];

new WOW.WOW({
  live: false, // Ensures animations trigger only once
}).init();

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!", {
          position: "top-center", // Position of the toast
        });
        setFormData({ name: "", email: "", message: "" }); // Clear the form
      } else {
        toast.error("Failed to send message.", {
          position: "top-center", // Position of the toast
        });
      }
    } catch (error) {
      toast.error("An error occurred.", {
        position: "top-center", // Position of the toast
      });
    }
  };

  return (
    <div className="container-fluid contactus-main-container">
      <div className="row gy-3 gy-md-4 align-items-start justify-content-center ">
        {/* Get in Touch Section */}
        <div className="col-12 col-md-6 col-lg-9">
          <div className="border rounded shadow-sm overflow-hidden p-4 p-xl-5 wow animate__animated animate__fadeInUp">
            <h2 className="h1 mb-3 text-center text-warning wow animate__animated animate__fadeInUp">
              Get in touch
            </h2>
            <p className="lead fs-4 text-secondary mb-5 text-center wow animate__animated animate__fadeInUp">
              We're always on the lookout to work with new clients. If you're
              interested in working with us, please get in touch in one of the
              following ways.
            </p>

            <div className="branch-lis wow animate__animated animate__fadeInUpt">
              {branches.map((branch) => (
                <div key={branch.id} className="branch-container">
                  <h3 className="branch-name text-warning">{branch.name}</h3>

                  <div className="branch-info">
                    <div className="d-flex align-items-start mb-4">
                      <div className="me-3 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-geo"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-2">Address</h4>
                        <address className="mb-0 text-secondary text-white">
                          {branch.address}
                        </address>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div className="me-3 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-telephone-outbound"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034c-.645.645-1.585.84-2.363.447a16.565 16.565 0 0 1-5.584-3.283 16.566 16.566 0 0 1-3.283-5.584c-.393-.778-.198-1.718.447-2.363L1.884.511z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-2">Phone</h4>
                        <address className="mb-0 text-secondary text-white">
                          {branch.phone}
                        </address>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div className="me-3 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          fill="currentColor"
                          className="bi bi-clock"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 3.5a.5.5 0 0 1 .5.5v4.793l3.147 1.574a.5.5 0 0 1-.447.894l-4-2a.5.5 0 0 1-.293-.447V4a.5.5 0 0 1 .5-.5z" />
                          <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm0 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="mb-2">Business Hours</h4>
                        <p className="mb-0 text-secondary text-white">
                          {branch.hours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="col-12 col-md-6 col-lg-9 wow animate__animated animate__fadeInUp">
          <div className="border rounded shadow-sm overflow-hidden p-4 p-xl-5">
            <h2 className="h1 mb-3 text-center text-warning">Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-warning">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster /> {/* Add the Toaster component to render the notifications */}
    </div>
  );
};

export default ContactUsPage;
