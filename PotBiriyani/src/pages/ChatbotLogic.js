import React, { useState } from "react";

const useChatbot = () => {
  const [activeTab, setActiveTab] = useState("bot");
  const [botResponse, setBotResponse] = useState("");
  const [questions] = useState([
    {
      question: "What is the menu like?",
      answer:
        "We offer a variety of dishes, including biryani, curries, and more.",
    },
    {
      question: "Do you offer delivery?",
      answer: "Yes, we deliver to your location.",
    },
    {
      question: "What is the address of the Main Branch?",
      answer: "91D, Pepiliyana Road, Dehiwala-Mt-Lavania, Sri Lanka.",
    },
    {
      question: "What is the phone number of the Main Branch?",
      answer: "(+94) 777330938",
    },
    {
      question: "What are the business hours of the Main Branch?",
      answer: "Monday – Friday: 8:00 AM – 5:00 PM, Saturday – Sunday: Closed.",
    },
    {
      question: "What is the address of the Rathmalana Branch?",
      answer: "102B, New Airport Road, Rathmalana, Sri Lanka.",
    },
    {
      question: "What is the phone number of the Rathmalana Branch?",
      answer: "(+94) 777330938",
    },
    {
      question: "What are the business hours of the Rathmalana Branch?",
      answer:
        "Monday – Friday: 9:00 AM – 6:00 PM, Saturday – Sunday: 10:00 AM – 4:00 PM.",
    },
    {
      question: "What is the address of the Battaramulla Branch?",
      answer: "75/A2, Asiri Uyana, 3rd Lane, Battaramulla, Sri Lanka.",
    },
    {
      question: "What is the phone number of the Battaramulla Branch?",
      answer: "(+94) 777330938",
    },
    {
      question: "What are the business hours of the Battaramulla Branch?",
      answer:
        "Monday – Friday: 9:00 AM – 6:00 PM, Saturday – Sunday: 10:00 AM – 4:00 PM.",
    },
    // Cuisines
    {
      question: "What cuisines do you offer?",
      answer:
        "We offer the following cuisines: Sri Lankan, Indian, Indonesian, Arabic.",
    },
    // Events
    {
      question: "What events do you cater to?",
      answer:
        "We cater to the following events: Corporate Events, Weddings, Conversations, Celebrations.",
    },
  ]);

  const handleUserInput = (input) => {
    // Check for "hi" or other input
    if (input.trim().toLowerCase() === "hi") {
      setBotResponse("Hello! Here are some questions you can ask:");
      return true; // Indicate that a greeting was detected
    } else {
      setBotResponse("Sorry, I don't understand that.");
      return false; // Indicate that a greeting was not detected
    }
  };

  const handleOptionClick = (questionIndex) => {
    const selectedQuestion = questions[questionIndex];
    if (selectedQuestion) {
      setBotResponse(selectedQuestion.answer);
    }
  };

  return {
    activeTab,
    botResponse,
    questions,
    setActiveTab,
    handleUserInput,
    handleOptionClick,
  };
};

export default useChatbot;
