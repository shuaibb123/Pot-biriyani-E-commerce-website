import React from "react";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.css";
import { useCart } from "../contexts/CartContext";
import "animate.css";
import WOW from "wowjs";
import icon1 from "../contexts/img/icon1.png";
import icon2 from "../contexts/img/icon2.png";
import icon3 from "../contexts/img/icon3.png";
import icon4 from "../contexts/img/icon4.png";
import icon5 from "../contexts/img/icon5.png";
import icon6 from "../contexts/img/icon6.png";
import icon7 from "../contexts/img/icon7.png";
import icon8 from "../contexts/img/icon8.png";
import icon9 from "../contexts/img/icon9.png";
import dummyicon from "../contexts/img/biriyanibg1.jpg";
import dummyicon2 from "../contexts/img/c1.jpg";
import user1 from "../contexts/img/u1.png";
import user2 from "../contexts/img/u2.png";
import user3 from "../contexts/img/u3.png";
import user4 from "../contexts/img/u4.png";
import useChatbot from "./ChatbotLogic"; // Adjust the path as necessary

const Home = () => {
  const [foodItems, setFoodItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { addToCart } = useCart();
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const { botResponse, questions, handleUserInput, handleOptionClick } =
    useChatbot();

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };

  React.useEffect(() => {
    // Initialize WOW.js
    const wow = new WOW.WOW();
    wow.init();

    const fetchFoodItems = async () => {
      try {
        const response = await fetch("/api/menu-items");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching the food data:", error);
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
  };

  const testimonials = [
    {
      quote: "Dolor et eos labore, stet justo sed est sed.",
      name: "Client Name",
      profession: "Profession",
      image: user1,
    },
    {
      quote: "Amazing service and delicious food!",
      name: "Jane Doe",
      profession: "Food Critic",
      image: user4,
    },
    {
      quote: "Dolor et eos labore, stet justo sed est sed.",
      name: "Client Name",
      profession: "Profession",
      image: user2,
    },
    {
      quote: "Amazing service and delicious food!",
      name: "Jane Doe",
      profession: "Food Critic",
      image: user3,
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Get only the first 4 food items
  const displayedFoodItems = foodItems.slice(0, 4);

  const handleSend = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      // Add user message to the chat
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Check for "hi" and respond accordingly
      if (input.toLowerCase() === "hi") {
        const botMessage = {
          text: "Hello! Here are some questions I can help you with:",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Add the question options as clickable buttons
        questions.forEach((question, index) => {
          const questionMessage = {
            text: question.question,
            sender: "bot",
            isQuestion: true,
            index: index, // Include the index for handling clicks
          };
          setMessages((prevMessages) => [...prevMessages, questionMessage]);
        });
      } else {
        const botMessage = {
          text: "Sorry, I didn't understand that.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }

      setInput("");
    }
  };

  const handleQuestionClick = (index) => {
    // Add the selected question as a user message
    const selectedQuestionMessage = {
      text: questions[index].question,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, selectedQuestionMessage]);

    // Set the bot's response to the selected question
    const botResponseMessage = {
      text: questions[index].answer,
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, botResponseMessage]);
  };

  return (
    <div>
      <div
        className="container-fluid py-5 hero-header mb-5 wow animate__animated animate__fadeInUp"
        style={{ backgroundColor: "rgba(245, 245, 245, 0.9)" }}
      >
        <div className="container-fluid my-5 py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-3 text-white wow animate__animated animate__fadeInLeft">
                Enjoy Our
                <br />
                Exquisite Biryani
              </h1>
              <p className="text-white mb-4 pb-2 wow animate__animated animate__fadeInLeft">
                Indulge in our luxurious biryani, crafted with the finest spices
                and ingredients to offer an authentic taste of tradition. Each
                bite promises a rich, flavorful experience that will transport
                your taste buds to new heights. Perfectly cooked rice, succulent
                meat, and aromatic herbs come together to create a dish that’s
                as beautiful as it is delicious.
              </p>
              <a
                href="#"
                className="homepage-btn2 wow animate__animated animate__fadeInUp"
              >
                Make an Order
              </a>
            </div>
            <div className="col-lg-6 text-center text-lg-end overflow-hidden">
              <img className="img-fluid" src="img/hero.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="text-center section-heading-container">
          <h5 className="section-title ff-secondary text-center fs-1 text-warning">
            Our Distinctive Edge
          </h5>
          <p className="section-subheading">
            We are committed to excellence in all aspects of our service.
          </p>
        </div>
        <div className="main-container container-fluid py-5 values-container">
          <div className="row g-4 justify-content-center">
            {/* Value Items */}
            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 values-container-ch1 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon2}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    Our biryani is slow-cooked over a traditional wood fire for
                    an unmatched, authentic flavor.
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon1}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    We focus on a select few dishes to ensure top-tier quality
                    and flavor.
                  </h1>
                </div>
              </div>
            </div>
            {/* Add more value items similarly... */}
            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon3}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    Every biryani is made with care, guaranteeing consistent
                    taste every time.
                  </h1>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon4}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    Our kitchen follows strict hygiene standards to protect food
                    quality.
                  </h1>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon5}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    Our Pots lock in flavor, delivering biryani as fresh as from
                    the kitchen.
                  </h1>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon6}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    Each biryani is crafted by hand, ensuring every layer is
                    packed with authentic flavor and care.
                  </h1>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon7}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    We hand-select every spice and ingredient for rich,
                    authentic taste.
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3 yellow-border">
                <div className="p-4 text-center">
                  <img
                    src={icon8}
                    alt="Quality Food Icon"
                    style={{
                      width: "80px",
                      height: "80px",
                      marginBottom: "20px",
                      margin: "auto",
                    }}
                  />{" "}
                  <h1>
                    We improve our food and service based on your feedback to
                    keep raising the bar.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section with Image and Description */}
      <div className="container-fluid">
        <div className="row g-0">
          <div className="col-lg-6 bg-image">
            {/* Background image will be applied through CSS */}
          </div>
        </div>
      </div>

      {/* New Section with text on left and button on right */}
      <div className="d-flex justify-content-between align-items-center mt-5 custom-section">
        <h4 className="custom-heading ">
          Savor the perfect blend of aromatic spices, tender meats, and fragrant
          rice, cooked to perfection.
        </h4>
        <img
          src={icon9}
          alt="Quality Food Icon"
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "20px",
            marginRight: "40px",
            margin: "auto",
          }}
        />{" "}
      </div>

      <div className="container-xxl py-5">
        <div className="container-fluid">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center fs-1 text-warning fw-normal">
              Most Popular Items
            </h5>
            <h1 className="section-subheading mb-5 mt-4">Top Dishes</h1>
          </div>

          <div className="main-container2 container-fluid py-5">
            <div className="row">
              {displayedFoodItems.length > 0 ? (
                displayedFoodItems.map((item) => (
                  <div key={item._id} className="col-lg-3 col-md-6 mb-4">
                    <div className="card">
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
                        <p className="menu-card-title text-white">
                          {item.name}
                        </p>
                        <p className="card-text">{item.description}</p>
                        <p className="card-price">LKR {item.price}</p>
                        <div className="d-flex justify-content-start mt-3">
                          <button
                            className="homepage-btn"
                            onClick={() => {
                              if (item._id) {
                                addToCart(item._id);
                              } else {
                                console.error("Item ID is undefined");
                              }
                            }}
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
        </div>
      </div>

      <div className="container-fluid d-md-flex flex-md-equal w-100 my-md-3 pl-md-3 justify-content-center mt-5">
        <div className="bg-black flex-fill pt-3 px-3 pt-md-5 px-md-5 text-center text-warning overflow-hidden rounded mx-md-2">
          <div className="description-container container-fluid my-3 py-3">
            <p className="display-5 ff-secondary text-warning">
              Flavor Infused{" "}
            </p>
            <p className="lead text-warning">
              we serve tradition, passion, and love in a pot.
            </p>

            <img
              src={dummyicon2}
              alt="Quality Food Icon"
              style={{
                width: "100%", // Responsive width
                height: "auto", // Maintain aspect ratio
                maxHeight: "300px", // Max height constraint
                marginBottom: "20px",
                margin: "auto",
                display: "block", // Center the image horizontally
              }}
            />
          </div>
        </div>

        <div className="bg-black flex-fill pt-3 px-3 pt-md-5 px-md-5 text-center text-warning overflow-hidden rounded mx-md-1">
          <div className="description-container my-3 p-3">
            <p className="display-5 text-warning ff-secondary">
              Freshness Sealed{" "}
            </p>
            <p className="lead text-warning">
              Indulge in a symphony of flavors
            </p>
            <img
              src={dummyicon}
              alt="Quality Food Icon"
              style={{
                width: "100%", // Responsive width
                height: "auto", // Maintain aspect ratio
                maxHeight: "300px", // Max height constraint
                marginBottom: "20px",
                margin: "auto",
                display: "block", // Center the image horizontally
              }}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <div className="container-fluid">
          <div className="text-center">
            <h5 className="section-title ff-secondary text-center text-warning fs-1 fw-normal">
              Testimonial
            </h5>
            <h1 className="mb-5 section-subheading mt-3">
              Our Customers Say!!!
            </h1>
          </div>
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-item-container">
                <div className="testimonial-item bg-transparent border rounded p-4">
                  <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                  <p>{testimonial.quote}</p>
                  <div className="d-flex align-items-center">
                    <img
                      className="img-fluid flex-shrink-0 rounded-circle"
                      src={testimonial.image}
                      style={{ width: "50px", height: "50px" }}
                      alt={testimonial.name}
                    />
                    <div className="ps-3">
                      <h5 className="mb-1">{testimonial.name}</h5>
                      <small>{testimonial.profession}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* New Section with text on left and button on right */}
      <div className="d-flex justify-content-between align-items-center mt-5 custom-section">
        <h4 className="custom-heading">
          Indulge in a delightful array of dishes awaiting your presence. Don't
          wait!
        </h4>
        <button className="custom-btn">
          <i className="fas fa-shopping-cart"></i> Order Now
        </button>{" "}
      </div>

      <div>
        <div className="unique-chatbot-icon" onClick={toggleChatbot}></div>

        {/* Chatbot Window */}
        {isChatbotOpen && (
          <div className="unique-chatbot-container">
            <div className="unique-chatbot-header">
              <h4>Chatbot</h4>
              <button className="unique-close-chatbot" onClick={toggleChatbot}>
                &times;
              </button>
            </div>
            <div className="unique-chatbot-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`unique-chatbot-message ${msg.sender}`}
                >
                  {msg.isQuestion ? (
                    <button
                      className="unique-question-button"
                      onClick={() => handleQuestionClick(msg.index)}
                    >
                      {msg.text}
                    </button>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>
            <div className="unique-chatbot-input">
              <input
                className="unique-chatbot-input-field"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleSend} // Handle key press
                placeholder="Type a message..."
              />
              <button className="unique-send-button" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
