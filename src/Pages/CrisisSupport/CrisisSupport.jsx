import { useState } from 'react';
import { MdPhone, MdMessage, MdVerifiedUser, MdHome, MdInfo } from 'react-icons/md';
import { FaRegHeart, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './CrisisSupport.css';

const CrisisSupport = () => {
  const [showResources, setShowResources] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const crisisResources = [
    {
      id: 'national',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 free and confidential support for people in distress',
      available: '24/7',
      type: 'phone'
    },
    {
      id: 'crisis-text',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 crisis counseling via text message',
      available: '24/7',
      type: 'text'
    },
    {
      id: 'trevor',
      name: 'The Trevor Project',
      number: '1-866-488-7386',
      description: 'Crisis intervention and suicide prevention for LGBTQ+ youth',
      available: '24/7',
      type: 'phone'
    },
    {
      id: 'veterans',
      name: 'Veterans Crisis Line',
      number: '1-800-273-8255',
      description: 'Confidential support for veterans and their families',
      available: '24/7',
      type: 'phone'
    },
    {
      id: 'domestic',
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: 'Support for those experiencing domestic violence',
      available: '24/7',
      type: 'phone'
    }
  ];

  const copingStrategies = [
    {
      title: 'Deep Breathing',
      description: 'Take slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.',
      icon: '🫁'
    },
    {
      title: 'Grounding Technique',
      description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
      icon: '🌍'
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and relax each muscle group from your toes to your head.',
      icon: '💪'
    },
    {
      title: 'Safe Place Visualization',
      description: 'Close your eyes and imagine a safe, peaceful place. Focus on the details.',
      icon: '🏝️'
    }
  ];

  const safetyPlan = [
    'Remove or secure any means of self-harm',
    'Stay in a safe environment',
    'Reach out to a trusted friend or family member',
    'Call a crisis hotline',
    'Go to the nearest emergency room if needed',
    'Remember: This feeling is temporary'
  ];

  const handleCall = (number) => {
    window.open(`tel:${number.replace(/\D/g, '')}`, '_self');
  };

  const handleText = (number) => {
    // For text lines, we can't directly initiate SMS, but we can show instructions
    alert(`To contact ${number}, please open your phone's messaging app and send the text.`);
  };

  return (
    <div className="crisis-support">
      <div className="crisis-header">
        <div className="crisis-alert">
          <MdVerifiedUser size={32} />
          <h1>Crisis Support</h1>
        </div>
        <p>You're not alone. Help is available 24/7.</p>
      </div>

      <div className="emergency-section">
        <div className="emergency-card">
          <h2>Need Immediate Help?</h2>
          <p>If you're in crisis or having thoughts of self-harm, please reach out now.</p>
          
          <div className="emergency-buttons">
            <button 
              className="emergency-btn primary"
              onClick={() => handleCall('988')}
            >
              <MdPhone size={20} />
              Call 988 Now
            </button>
            <button 
              className="emergency-btn secondary"
              onClick={() => handleText('Text HOME to 741741')}
            >
              <MdMessage size={20} />
              Text Crisis Line
            </button>
          </div>
          
          <div className="emergency-note">
            <MdInfo size={16} />
            <span>These services are free, confidential, and available 24/7</span>
          </div>
        </div>
      </div>

      <div className="support-grid">
        <div className="support-section">
          <h2>Immediate Coping Strategies</h2>
          <div className="coping-grid">
            {copingStrategies.map((strategy, index) => (
              <div key={index} className="coping-card">
                <div className="coping-icon">{strategy.icon}</div>
                <h3>{strategy.title}</h3>
                <p>{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="support-section">
          <h2>Safety Plan</h2>
          <div className="safety-plan">
            <div className="safety-header">
              <FaRegHeart size={24} />
              <span>Your Safety Matters</span>
            </div>
            <ul className="safety-list">
              {safetyPlan.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="resources-section">
        <div className="section-header">
          <h2>Crisis Resources</h2>
          <button 
            className="toggle-btn"
            onClick={() => setShowResources(!showResources)}
          >
            {showResources ? 'Hide' : 'Show'} Resources
          </button>
        </div>

        {showResources && (
          <div className="resources-grid">
            {crisisResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <h3>{resource.name}</h3>
                  <span className="availability">{resource.available}</span>
                </div>
                <p>{resource.description}</p>
                <div className="resource-contact">
                  <span className="contact-number">{resource.number}</span>
                  <button 
                    className={`contact-btn ${resource.type}`}
                    onClick={() => resource.type === 'phone' ? handleCall(resource.number) : handleText(resource.number)}
                  >
                    {resource.type === 'phone' ? (
                      <>
                        <MdPhone size={16} />
                        Call Now
                      </>
                    ) : (
                      <>
                        <MdMessage size={16} />
                        Text Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-section">
        <h2>What Would You Like to Do?</h2>
        <div className="nav-options">
          <Link to="/chat" className="nav-option">
            <MdMessage size={24} />
            <span>Talk to AI Companion</span>
          </Link>
          <Link to="/dashboard" className="nav-option">
            <MdHome size={24} />
            <span>Go to Dashboard</span>
          </Link>
          <Link to="/mood-tracker" className="nav-option">
            <FaRegHeart size={24} />
            <span>Track Your Mood</span>
          </Link>
          <Link to="/mini-games" className="nav-option">
            <FaUser size={24} />
            <span>Try Relaxing Games</span>
          </Link>
        </div>
      </div>

      <div className="important-notice">
        <div className="notice-content">
          <h3>Important Notice</h3>
          <p>
            This application is not a substitute for professional mental health care. 
            If you're experiencing a mental health emergency, please contact emergency 
            services (911) or go to the nearest emergency room immediately.
          </p>
          <p>
            The crisis resources provided are external services. We are not responsible 
            for the content or availability of these external resources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport; 