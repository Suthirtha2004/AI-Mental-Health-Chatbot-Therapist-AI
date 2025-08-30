import React, { useState } from "react";
import "./CrisisSupport.css";

const CrisisSupport = () => {
  const [showResources, setShowResources] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const crisisResources = [
    {
      id: "national",
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 free and confidential support for people in distress",
      available: "24/7",
      type: "phone",
    },
    {
      id: "crisis-text",
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free 24/7 crisis counseling via text message",
      available: "24/7",
      type: "text",
    },
    {
      id: "trevor",
      name: "The Trevor Project",
      number: "1-866-488-7386",
      description: "Crisis intervention and suicide prevention for LGBTQ+ youth",
      available: "24/7",
      type: "phone",
    },
    {
      id: "veterans",
      name: "Veterans Crisis Line",
      number: "1-800-273-8255",
      description: "Confidential support for veterans and their families",
      available: "24/7",
      type: "phone",
    },
    {
      id: "domestic",
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "Support for those experiencing domestic violence",
      available: "24/7",
      type: "phone",
    },
  ];

  return (
    <div className="crisis-support">
      <div className="crisis-header">
        <div className="crisis-alert">
          <h1>Crisis Support</h1>
        </div>
        <p>You're not alone. Help is available 24/7.</p>
      </div>

      <div className="emergency-section">
        <div className="emergency-card">
          <h2 style={{ color: "#dc2626", textAlign: "center" }}>
            Need Immediate Help?
          </h2>
          <p style={{ textAlign: "center" }}>
            If you're in crisis or having thoughts of self-harm, please reach out
            now.
          </p>
          <div className="emergency-buttons">
            <a
              href="tel:988"
              className="emergency-btn primary"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              <span role="img" aria-label="phone">
                📞
              </span>{" "}
              Call 988 Now
            </a>
            <a
              href="https://www.crisistextline.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="emergency-btn secondary"
              style={{ background: "#3b82f6", color: "#fff" }}
            >
              <span role="img" aria-label="text">
                💬
              </span>{" "}
              Text Crisis Line
            </a>
          </div>
          <div
            className="emergency-note"
            style={{
              textAlign: "center",
              fontSize: "0.95rem",
              color: "#555",
            }}
          >
            <span>
              These services are free, confidential, and available 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Centered title above grid */}
      <h2 className="coping-title">Immediate Coping Strategies</h2>
      <div className="support-grid">
        <div className="support-section">
          <div className="coping-grid">
            <div className="coping-card">
              <div className="coping-icon">🧘‍♂️</div>
              <h3>Deep Breathing</h3>
              <p>Take slow, deep breaths to calm your mind and body.</p>
            </div>
            <div className="coping-card">
              <div className="coping-icon">✍️</div>
              <h3>Journaling</h3>
              <p>Write down your thoughts and feelings to process them.</p>
            </div>
            <div className="coping-card">
              <div className="coping-icon">🎵</div>
              <h3>Listen to Music</h3>
              <p>Play your favorite song to shift your mood.</p>
            </div>
            <div className="coping-card">
              <div className="coping-icon">🚶‍♂️</div>
              <h3>Go for a Walk</h3>
              <p>Change your environment and get some fresh air.</p>
            </div>
          </div>
        </div>
        <div className="safety-plan">
          <div className="safety-header">
            <h2>Safety Plan</h2>
          </div>
          <ul className="safety-list">
            <li>Your Safety Matters</li>
            <li>Reach out to a trusted friend or family member</li>
            <li>Remove harmful objects from your environment</li>
            <li>Use crisis resources above if needed</li>
          </ul>
        </div>
      </div>

      <div className="resources-section">
        <div className="section-header">
          <h2>Helpful Resources</h2>
          <button
            className="toggle-btn"
            onClick={() => setShowResources((prev) => !prev)}
          >
            {showResources ? "Hide Resources" : "Show Resources"}
          </button>
        </div>
        {showResources && (
          <div className="resources-grid">
            {crisisResources.map((resource) => (
              <div
                key={resource.id}
                className="resource-card"
                onClick={() => setSelectedResource(resource)}
                style={{
                  border: selectedResource?.id === resource.id ? "2px solid #3b82f6" : "1px solid #ddd",
                  cursor: "pointer",
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="resource-header">
                  <h3>{resource.name}</h3>
                  <span className="availability">{resource.available}</span>
                </div>
                <p>{resource.description}</p>
                <div className="resource-contact">
                  <span className="contact-number">{resource.number}</span>
                  {resource.type === "phone" ? (
                    <a
                      href={`tel:${resource.number.replace(/[^0-9]/g, "")}`}
                      className="contact-btn phone"
                      style={{ marginLeft: "10px" }}
                    >
                      Call
                    </a>
                  ) : (
                    <a
                      href="https://www.crisistextline.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-btn text"
                      style={{ marginLeft: "10px" }}
                    >
                      Text
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-section">
        <h2>Mini Games & Other Options</h2>
        <div className="nav-options">
          <div className="nav-option">
            <span role="img" aria-label="dashboard">🏠</span> Dashboard
          </div>
          <div className="nav-option">
            <span role="img" aria-label="mood">💖</span> Mood Tracker
          </div>
          <div className="nav-option">
            <span role="img" aria-label="chat">💬</span> AI Chat
          </div>
          <div className="nav-option">
            <span role="img" aria-label="games">🎮</span> Mini Games
          </div>
          <div className="nav-option">
            <span role="img" aria-label="plant">🌱</span> Virtual Plant
          </div>
          <div className="nav-option">
            <span role="img" aria-label="tips">📊</span> Daily Tips
          </div>
          <div className="nav-option">
            <span role="img" aria-label="goals">⏰</span> Goals & Habits
          </div>
        </div>
      </div>

      <div className="important-notice">
        <div className="notice-content">
          <h3>Important Notice</h3>
          <p>
            This page is not a substitute for professional help. If you are in immediate danger, please call emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;