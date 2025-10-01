import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import "./StudentPollPage.css";
import stopwatch from "../../assets/stopwatch.svg";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/spark.svg";
let apiUrl = process.env.REACT_APP_API_BASE_URL || "https://polling-system-server.onrender.com";
const socket = io(apiUrl);

const StudentPollPage = () => {
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const [kickedOut, setKickedOut] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const username = sessionStorage.getItem("username");
      if (username) {
        socket.emit("submitAnswer", {
          username: username,
          option: selectedOption,
          pollId: pollId,
        });
        setSubmitted(true);
      } else {
        console.error("No username found in session storage!");
      }
    }
  };

  useEffect(() => {
    const handleKickedOut = () => {
      setKickedOut(true);
      sessionStorage.removeItem("username");
      navigate("/kicked-out");
    };

    socket.on("kickedOut", handleKickedOut);

    return () => {
      socket.off("kickedOut", handleKickedOut);
    };
  }, [navigate]);

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  // If kicked out, show only the kickout message
  if (kickedOut) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="kicked-out-icon mb-4">
            <div className="kicked-out-symbol">🚫</div>
          </div>
          <h2 className="kicked-out-title mb-4">
            You have been <span className="text-danger">kicked out</span> of the classroom
          </h2>
          <p className="kicked-out-message mb-4">
            The teacher has removed you from the current session.
          </p>
          <button 
            className="btn continue-btn"
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/';
            }}
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-poll-container">
      <ChatPopover />
      {pollQuestion === "" && timeLeft === 0 && (
        <div className="waiting-container">
          <div className="waiting-content">
            <button className="intervue-btn">
              <img src={stars} alt="" />
              Intervue Poll
            </button>
            <div className="spinner-container">
              <div className="spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h3 className="waiting-title">
              Wait for the teacher to ask questions..
            </h3>
          </div>
        </div>
      )}
      {pollQuestion !== "" && (
        <div className="poll-container">
          <div className="poll-content">
            <div className="question-header">
              <h2 className="question-title">Question</h2>
              <div className="timer-container">
                <img src={stopwatch} alt="Stopwatch" className="timer-icon" />
                <span className="timer-text">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="question-bar">
              <span className="question-text">{pollQuestion}?</span>
            </div>

            <div className="options-container">
              {pollOptions.map((option, index) => {
                const isSelected = selectedOption === option.text;
                const voteCount = votes[option.text] || 0;
                const percentage = calculatePercentage(voteCount);
                const isSubmitted = submitted;
                
                return (
                  <div
                    key={option.id}
                    className={`option-item ${isSelected ? 'selected' : ''} ${isSubmitted ? 'submitted' : ''}`}
                    style={{
                      cursor: submitted || timeLeft === 0 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (!submitted && timeLeft > 0) {
                        handleOptionSelect(option.text);
                      }
                    }}
                  >
                    <div className="option-number">{index + 1}</div>
                    <div className="option-content">
                      <div className="option-text">{option.text}</div>
                      {isSubmitted && (
                        <div className="option-percentage">{Math.round(percentage)}%</div>
                      )}
                    </div>
                    {isSubmitted && (
                      <div className="progress-container">
                        <div 
                          className="progress-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submitted && selectedOption && timeLeft > 0 && (
              <div className="submit-section">
                <button
                  type="submit"
                  className="submit-btn"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            )}

            {submitted && (
              <div className="waiting-message">
                <h6>Wait for the teacher to ask a new question...</h6>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPollPage;
