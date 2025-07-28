import { useState, useEffect } from 'react';
import { MdLightbulbOutline, MdCalendarToday, MdShare } from 'react-icons/md';
import { FaRegHeart, FaRegStar, FaBook } from 'react-icons/fa';
import { useMentalHealth } from '../../context/MentalHealthContext';
import './DailyTips.css';

const DailyTips = () => {
  const { dailyTip, tipHistory, lastTipDate, setDailyTip } = useMentalHealth();
  const [currentTip, setCurrentTip] = useState(null);
  const [favoriteTips, setFavoriteTips] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const tips = [
    {
      id: 1,
      title: "Practice Mindful Breathing",
      content: "Take 5 deep breaths, counting to 4 on inhale and 6 on exhale. This simple technique can instantly reduce stress and bring you back to the present moment.",
      category: "Stress Relief",
      icon: "🫁"
    },
    {
      id: 2,
      title: "Gratitude Journal",
      content: "Write down 3 things you're grateful for today, no matter how small. Gratitude practice has been shown to improve mood and overall well-being.",
      category: "Mindfulness",
      icon: "📝"
    },
    {
      id: 3,
      title: "Digital Detox Hour",
      content: "Set aside one hour each day to disconnect from screens. Use this time to read, meditate, or connect with nature.",
      category: "Digital Wellness",
      icon: "📱"
    },
    {
      id: 4,
      title: "Random Acts of Kindness",
      content: "Do something kind for someone else today - even a simple compliment can boost both your mood and theirs.",
      category: "Social Connection",
      icon: "🤝"
    },
    {
      id: 5,
      title: "Body Movement",
      content: "Move your body in a way that feels good - dance, stretch, or take a walk. Physical activity releases endorphins that naturally improve mood.",
      category: "Physical Health",
      icon: "💃"
    },
    {
      id: 6,
      title: "Self-Compassion Break",
      content: "When you're feeling down, place your hand on your heart and say: 'This is a moment of suffering. Suffering is part of life. May I be kind to myself.'",
      category: "Self-Care",
      icon: "💝"
    },
    {
      id: 7,
      title: "Nature Connection",
      content: "Spend 10 minutes outside today. Notice the sounds, smells, and sensations. Nature has a powerful calming effect on our nervous system.",
      category: "Nature Therapy",
      icon: "🌿"
    },
    {
      id: 8,
      title: "Boundary Setting",
      content: "Practice saying 'no' to something that doesn't align with your values or energy today. Setting boundaries is an act of self-respect.",
      category: "Self-Care",
      icon: "🛡️"
    }
  ];

  const affirmations = [
    "I am worthy of love, respect, and happiness.",
    "I have the power to create positive change in my life.",
    "I am stronger than my challenges.",
    "I choose to focus on what I can control.",
    "I am enough, just as I am.",
    "I deserve to take care of myself.",
    "I am capable of achieving my goals.",
    "I choose peace and positivity.",
    "I trust my intuition and inner wisdom.",
    "I am resilient and can overcome obstacles."
  ];

  useEffect(() => {
    // Check if we need a new daily tip
    const today = new Date().toDateString();
    const lastTip = lastTipDate ? new Date(lastTipDate).toDateString() : null;
    
    if (today !== lastTip) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      
      const newTip = {
        ...randomTip,
        affirmation: randomAffirmation,
        date: new Date().toISOString()
      };
      
      setDailyTip(newTip);
      setCurrentTip(newTip);
    } else if (dailyTip) {
      setCurrentTip(dailyTip);
    } else {
      // Fallback if no tip exists
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      
      const newTip = {
        ...randomTip,
        affirmation: randomAffirmation,
        date: new Date().toISOString()
      };
      
      setCurrentTip(newTip);
    }
  }, [dailyTip, lastTipDate, setDailyTip]);

  const toggleFavorite = (tipId) => {
    setFavoriteTips(prev => 
      prev.includes(tipId)
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const shareTip = (tip) => {
    const text = `${tip.title}\n\n${tip.content}\n\n#MentalHealth #SelfCare`;
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.content
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Tip copied to clipboard!');
    }
  };

  return (
    <div className="daily-tips">
      <div className="tips-header">
        <h1>Daily Tips & Motivation</h1>
        <p>Your daily dose of mental health wisdom and positive affirmations</p>
      </div>

      {currentTip && (
        <div className="current-tip">
          <div className="tip-card featured">
            <div className="tip-header">
              <div className="tip-icon">{currentTip.icon}</div>
              <div className="tip-meta">
                <h2>{currentTip.title}</h2>
                <span className="tip-category">{currentTip.category}</span>
                <span className="tip-date">
                  {new Date(currentTip.date).toLocaleDateString()}
                </span>
              </div>
              <div className="tip-actions">
                <button 
                  className={`favorite-btn ${favoriteTips.includes(currentTip.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(currentTip.id)}
                >
                  <FaRegHeart size={20} />
                </button>
                <button 
                  className="share-btn"
                  onClick={() => shareTip(currentTip)}
                >
                  <MdShare size={20} />
                </button>
              </div>
            </div>
            
            <div className="tip-content">
              <p>{currentTip.content}</p>
            </div>
            
            <div className="affirmation-section">
              <div className="affirmation-header">
                <FaRegStar size={16} />
                <span>Today's Affirmation</span>
              </div>
              <p className="affirmation-text">{currentTip.affirmation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="tips-navigation">
        <button 
          className={`nav-btn ${!showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(false)}
        >
          <MdLightbulbOutline size={16} />
          All Tips
        </button>
        <button 
          className={`nav-btn ${showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(true)}
        >
          <MdCalendarToday size={16} />
          Tip History
        </button>
      </div>

      {!showHistory ? (
        <div className="tips-grid">
          <h2>Explore More Tips</h2>
          <div className="tips-list">
            {tips.map(tip => (
              <div key={tip.id} className="tip-card">
                <div className="tip-header">
                  <div className="tip-icon">{tip.icon}</div>
                  <div className="tip-meta">
                    <h3>{tip.title}</h3>
                    <span className="tip-category">{tip.category}</span>
                  </div>
                  <div className="tip-actions">
                    <button 
                      className={`favorite-btn ${favoriteTips.includes(tip.id) ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(tip.id)}
                    >
                      <FaRegHeart size={16} />
                    </button>
                    <button 
                      className="share-btn"
                      onClick={() => shareTip(tip)}
                    >
                      <MdShare size={16} />
                    </button>
                  </div>
                </div>
                <div className="tip-content">
                  <p>{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="tip-history">
          <h2>Tip History</h2>
          {tipHistory.length > 0 ? (
            <div className="history-list">
              {tipHistory.slice(-10).reverse().map((tip, index) => (
                <div key={index} className="tip-card history">
                  <div className="tip-header">
                    <div className="tip-icon">{tip.icon}</div>
                    <div className="tip-meta">
                      <h3>{tip.title}</h3>
                      <span className="tip-category">{tip.category}</span>
                      <span className="tip-date">
                        {new Date(tip.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="tip-content">
                    <p>{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <FaBook size={48} />
              <p>No tip history yet. Start exploring tips to build your collection!</p>
            </div>
          )}
        </div>
      )}

      <div className="favorites-section">
        <h2>Your Favorites</h2>
        {favoriteTips.length > 0 ? (
          <div className="favorites-list">
            {tips.filter(tip => favoriteTips.includes(tip.id)).map(tip => (
              <div key={tip.id} className="tip-card favorite">
                <div className="tip-header">
                  <div className="tip-icon">{tip.icon}</div>
                  <div className="tip-meta">
                    <h3>{tip.title}</h3>
                    <span className="tip-category">{tip.category}</span>
                  </div>
                  <div className="tip-actions">
                    <button 
                      className="favorite-btn favorited"
                      onClick={() => toggleFavorite(tip.id)}
                    >
                      <FaRegHeart size={16} />
                    </button>
                  </div>
                </div>
                <div className="tip-content">
                  <p>{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <FaRegHeart size={48} />
            <p>No favorite tips yet. Click the heart icon on any tip to save it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTips; 