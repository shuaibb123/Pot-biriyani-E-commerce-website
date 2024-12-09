// ChatbotTabs.js
import React, { useState } from "react";
import "./ChatbotTabs.css"; // Add CSS for styling

const ChatbotTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [botResponse, setBotResponse] = useState("");

  // Sample questions and answers
  const questions = [
    {
      question: "What is your name?",
      options: ["Alice", "Bob", "Charlie"],
      responses: {
        Alice: "Nice to meet you, Alice!",
        Bob: "Hello Bob!",
        Charlie: "Hey Charlie!",
      },
    },
    {
      question: "How are you feeling today?",
      options: ["Good", "Okay", "Not Great"],
      responses: {
        Good: "Glad to hear you're doing well!",
        Okay: "Hope things get better soon!",
        NotGreat: "Sorry to hear that, take care!",
      },
    },
    // Add more questions here
  ];

  const handleOptionClick = (option) => {
    setBotResponse(questions[activeTab].responses[option]);
  };

  return (
    <div className="chatbot-container">
      <div className="tabs">
        {questions.map((q, index) => (
          <button
            key={index}
            className={`tab ${index === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {q.question}
          </button>
        ))}
      </div>

      <div className="content">
        <h3>{questions[activeTab].question}</h3>
        <div className="options">
          {questions[activeTab].options.map((option, index) => (
            <button
              key={index}
              className="option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {botResponse && <p className="response">{botResponse}</p>}
      </div>
    </div>
  );
};

export default ChatbotTabs;
