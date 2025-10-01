import React from "react";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/spark.svg";
import "./KickedOutPage.css";

const KickedOutPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Clear any remaining session data
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="kicked-out-container text-center">
        <button className="btn btn-sm intervue-btn mb-5">
          <img src={stars} className="px-1" alt="" />
          Intervue Poll
        </button>
        
        <div className="kicked-out-icon mb-4">
          <div className="kicked-out-symbol">🚫</div>
        </div>
        
        <h2 className="kicked-out-title mb-4">
          You have been <span className="text-danger">kicked out</span> of the classroom
        </h2>
        
        <p className="kicked-out-message mb-4">
          The teacher has removed you from the current session. 
          You can join again when the teacher allows it.
        </p>
        
        <div className="kicked-out-actions">
          <button 
            className="btn continue-btn"
            onClick={handleGoHome}
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default KickedOutPage;

