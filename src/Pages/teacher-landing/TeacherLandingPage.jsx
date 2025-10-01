import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import "./TeacherLandingPage.css";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
let apiUrl = process.env.REACT_APP_API_BASE_URL || "https://polling-system-server.onrender.com";
const socket = io(apiUrl);
const TeacherLandingPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState("60");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectToggle = (index, isCorrect) => {
    const updatedOptions = [...options];
    updatedOptions[index].correct = isCorrect;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", correct: null },
    ]);
  };

  const validateForm = () => {
    if (question.trim() === "") {
      setError("Question cannot be empty");
      return false;
    }

    if (options.length < 2) {
      setError("At least two options are required");
      return false;
    }

    const optionTexts = options.map((option) => option.text.trim());
    if (optionTexts.some((text) => text === "")) {
      setError("All options must have text");
      return false;
    }

    const correctOptionExists = options.some(
      (option) => option.correct === true
    );
    if (!correctOptionExists) {
      setError("At least one correct option must be selected");
      return false;
    }

    setError("");
    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      let teacherUsername = sessionStorage.getItem("username");
      let pollData = { question, options, timer, teacherUsername };
      socket.emit("createPoll", pollData);
      navigate("/teacher-poll");
    }
  };
  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="teacher-landing-container">
      <div className="teacher-landing-content">
        <div className="header-section">
          <button
            className="view-history-btn"
            onClick={handleViewPollHistory}
          >
            <img src={eyeIcon} alt="" />
            View Poll history
          </button>
        </div>

        <div className="main-content">
          <div className="brand-section">
            <button className="intervue-btn">
              <img src={stars} alt="Poll Icon" /> Intervue Poll
            </button>
          </div>

          <div className="title-section">
            <h1 className="main-title">
              Let's <strong>Get Started</strong>
            </h1>
            <p className="description">
              you'll have the ability to create and manage polls, ask questions, and
              monitor your students' responses in real-time.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="question-section">
            <div className="question-header">
              <label htmlFor="question" className="section-label">
                Enter your question
              </label>
              <div className="timer-dropdown">
                <select
                  className="timer-select"
                  value={timer}
                  onChange={handleTimerChange}
                >
                  <option value="60">60 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="90">90 seconds</option>
                </select>
              </div>
            </div>
            <div className="question-input-container">
              <textarea
                id="question"
                className="question-input"
                onChange={handleQuestionChange}
                maxLength="100"
                placeholder="Please enter your question"
                rows="3"
              />
              <div className="char-counter">{question.length}/100</div>
            </div>
          </div>

          <div className="options-section">
            <div className="options-header">
              <label className="section-label">Edit Options</label>
              <label className="correct-label">Is it Correct?</label>
            </div>
            <div className="options-list">
              {options.map((option, index) => (
                <div key={option.id} className="option-item">
                  <div className="option-number">{index + 1}</div>
                  <input
                    type="text"
                    className="option-input"
                    placeholder="Please enter your option"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <div className="correct-options">
                    <div className="radio-group">
                      <input
                        className="radio-input"
                        type="radio"
                        name={`correct-${index}`}
                        checked={option.correct === true}
                        onChange={() => handleCorrectToggle(index, true)}
                        required="required"
                      />
                      <label className="radio-label">Yes</label>
                    </div>
                    <div className="radio-group">
                      <input
                        className="radio-input"
                        type="radio"
                        name={`correct-${index}`}
                        checked={option.correct === false}
                        onChange={() => handleCorrectToggle(index, false)}
                        required="required"
                      />
                      <label className="radio-label">No</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="add-option-btn" onClick={addOption}>
              + Add More option
            </button>
          </div>

          <div className="action-section">
            <button className="ask-question-btn" onClick={askQuestion}>
              Ask Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLandingPage;
