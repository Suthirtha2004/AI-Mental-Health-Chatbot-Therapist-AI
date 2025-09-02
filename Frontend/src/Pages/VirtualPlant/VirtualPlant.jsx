import { useState, useEffect } from 'react';
import { FaDropbox } from 'react-icons/fa';
import { useMentalHealth } from '../../context/MentalHealthContext';
import { getChatSentimentScores } from '../../firebase/firestore';
import { auth } from '../../firebase/auth';
import './VirtualPlant.css';

const VirtualPlant = () => {
  const { 
    plantLevel, 
    plantHealth, 
    plantGrowth, 
    plantWater, 
    plantLastWatered,
    waterPlant,
    moodEntries,
    totalMoodEntries,
    averageMood
  } = useMentalHealth();

  const [showWaterAnimation, setShowWaterAnimation] = useState(false);
  const [lastWateredTime, setLastWateredTime] = useState(null);
  const [sentimentGrowth, setSentimentGrowth] = useState(0);
  const [sentimentScores, setSentimentScores] = useState([]);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);

  const plantStages = [
    { level: 1, name: 'Sad Seed', emoji: '🌱', minSentiment: 0, description: 'Just starting to grow' },
    { level: 2, name: 'Hopeful Sprout', emoji: '🌿', minSentiment: 20, description: 'Finding its way' },
    { level: 3, name: 'Growing Plant', emoji: '🌱', minSentiment: 50, description: 'Getting stronger' },
    { level: 4, name: 'Happy Plant', emoji: '🌿', minSentiment: 100, description: 'Feeling good' },
    { level: 5, name: 'Joyful Bloom', emoji: '🌸', minSentiment: 200, description: 'Radiating happiness' },
    { level: 6, name: 'Magical Garden', emoji: '🌺', minSentiment: 300, description: 'Pure bliss' },
    { level: 7, name: 'Enchanted Forest', emoji: '🌳', minSentiment: 500, description: 'Transcendent joy' },
    { level: 8, name: 'Celestial Garden', emoji: '🌟', minSentiment: 800, description: 'Divine happiness' }
  ];

  // Determine current stage based on sentiment growth
  const currentStage = plantStages
    .slice()
    .reverse()
    .find(stage => sentimentGrowth >= stage.minSentiment) || plantStages[0];
  
  const nextStage = plantStages.find(stage => stage.minSentiment > sentimentGrowth);

  const handleWaterPlant = () => {
    waterPlant();
    setShowWaterAnimation(true);
    setLastWateredTime(new Date());
    setTimeout(() => setShowWaterAnimation(false), 2000);
  };

  const fetchSentimentGrowth = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser?.uid) return;

    setIsLoadingSentiment(true);
    try {
      const scores = await getChatSentimentScores(currentUser.uid);
      setSentimentScores(scores);
      
      // Calculate total growth from sentiment scores (multiply by 100 as requested)
      const totalGrowth = scores.reduce((sum, item) => {
        const growth = (item.score || 0) * 100;
        return sum + growth;
      }, 0);
      
      setSentimentGrowth(totalGrowth);
    } catch (error) {
      console.error('Error fetching sentiment scores:', error);
    } finally {
      setIsLoadingSentiment(false);
    }
  };

  // Auto-fetch sentiment growth on component mount
  useEffect(() => {
    fetchSentimentGrowth();
  }, []);

  const getPlantSize = () => {
    const baseSize = 140 + (plantLevel * 24);
    // Include sentiment growth in size calculation
    const totalGrowth = plantGrowth + sentimentGrowth;
    const growthMultiplier = Math.min(totalGrowth / 100, 2); // Cap at 2x size
    return Math.max(120, baseSize * growthMultiplier);
  };

  const getPlantColor = () => {
    // Base color from health
    let baseColor = '#22c55e';
    if (plantHealth > 80) baseColor = '#22c55e';
    else if (plantHealth > 60) baseColor = '#84cc16';
    else if (plantHealth > 40) baseColor = '#eab308';
    else if (plantHealth > 20) baseColor = '#f97316';
    else baseColor = '#ef4444';

    // Enhance color based on sentiment growth
    if (sentimentGrowth > 50) {
      // High sentiment = more vibrant, golden glow
      return sentimentGrowth > 100 ? '#fbbf24' : '#10b981';
    } else if (sentimentGrowth > 20) {
      // Medium sentiment = brighter green
      return '#16a34a';
    }
    
    return baseColor;
  };

  const getPlantGlow = () => {
    if (sentimentGrowth > 100) {
      return {
        boxShadow: '0 0 30px #fbbf24, 0 0 60px #f59e0b, 0 0 90px #d97706',
        filter: 'brightness(1.3) saturate(1.5)'
      };
    } else if (sentimentGrowth > 50) {
      return {
        boxShadow: '0 0 20px #10b981, 0 0 40px #059669',
        filter: 'brightness(1.2) saturate(1.3)'
      };
    } else if (sentimentGrowth > 20) {
      return {
        boxShadow: '0 0 15px #16a34a',
        filter: 'brightness(1.1)'
      };
    }
    return {};
  };

  const getPlantAnimation = () => {
    if (sentimentGrowth > 100) {
      return 'sentimentGlow 2s ease-in-out infinite alternate, growPulse 1.5s ease-in-out infinite';
    } else if (sentimentGrowth > 50) {
      return 'sentimentPulse 2.5s ease-in-out infinite, growPulse 2s ease-in-out infinite';
    }
    return `growPulse ${getGrowthPulseDuration()}s ease-in-out infinite`;
  };

  const getGrowthPulseDuration = () => {
    const minSeconds = 1.6;
    const maxSeconds = 4.5;
    const normalized = Math.max(0, Math.min(100, plantHealth)) / 100;
    return (maxSeconds - (maxSeconds - minSeconds) * normalized).toFixed(2);
  };

  const getWaterStatus = () => {
    if (plantWater > 80) return { status: 'Well Watered', color: '#166534' };
    if (plantWater > 60) return { status: 'Good', color: '#84cc16' };
    if (plantWater > 40) return { status: 'Needs Water', color: '#eab308' };
    if (plantWater > 20) return { status: 'Thirsty', color: '#f97316' };
    return { status: 'Very Dry', color: '#ef4444' };
  };

  const waterStatus = getWaterStatus();

  return (
    <div className="virtual-plant-container">
      <div className="plant-header">
        <h1>Virtual Plant Garden</h1>
        <p>Your plant grows with your positive mood and care</p>
      </div>

      <div className="plant-container">
        <div className="plant-display">
          <div className="plant-pot">
            <div 
              className="plant"
              style={{
                fontSize: `${getPlantSize()}px`,
                color: getPlantColor(),
                animation: getPlantAnimation(),
                ...getPlantGlow()
              }}
            >
              {currentStage.emoji}
              {sentimentGrowth > 100 && (
                <div className="sentiment-sparkles">
                  ✨🌟✨
                </div>
              )}
            </div>
            {showWaterAnimation && (
              <div className="water-animation">
                <FaDropbox size={24} />
              </div>
            )}
          </div>
          
          <div className="plant-info">
            <h2>{currentStage.name}</h2>
            <p>{currentStage.description}</p>
            <div className="stage-progress">
              <span>Sentiment Level: {sentimentGrowth.toFixed(1)}</span>
            </div>
            {sentimentGrowth > 50 && (
              <div className="sentiment-status" style={{ 
                color: sentimentGrowth > 100 ? '#fbbf24' : '#10b981',
                fontWeight: 'bold',
                textShadow: sentimentGrowth > 100 ? '0 0 10px #fbbf24' : '0 0 5px #10b981'
              }}>
                {sentimentGrowth > 500 ? '🌟 Transcendent Joy! 🌟' :
                 sentimentGrowth > 300 ? '✨ Pure Bliss! ✨' :
                 sentimentGrowth > 200 ? '🌸 Radiating Happiness! 🌸' :
                 sentimentGrowth > 100 ? '🌟 Radiant with Joy! 🌟' : 
                 '✨ Glowing with Positivity! ✨'}
              </div>
            )}
            {nextStage && (
              <div className="next-stage">
                <span>Next: {nextStage.name}</span>
                <span>Need: {nextStage.minSentiment} sentiment points</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min(100, (sentimentGrowth / nextStage.minSentiment) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="plant-actions">
          <div className="action-card">
            <h3>Plant Status</h3>
            <div className="status-item">
              <span>Water Status:</span>
              <span style={{ color: waterStatus.color }}>{waterStatus.status}</span>
            </div>
            <div className="status-item">
              <span>Last Watered:</span>
              <span>
                {plantLastWatered 
                  ? new Date(plantLastWatered).toLocaleDateString()
                  : 'Never'
                }
              </span>
            </div>
            <div className="status-item">
              <span>Total Mood Entries:</span>
              <span>{totalMoodEntries}</span>
            </div>
            <div className="status-item">
              <span>Average Mood:</span>
              <span>{averageMood.toFixed(1)}/10</span>
            </div>
            <div className="status-item">
              <span>Sentiment Growth:</span>
              <span style={{ color: sentimentGrowth > 0 ? '#22c55e' : '#6b7280' }}>
                +{sentimentGrowth.toFixed(1)}
              </span>
            </div>
            <div className="status-item">
              <span>Chat Sentiments:</span>
              <span>{sentimentScores.length} analyzed</span>
            </div>
          </div>

          <div className="action-card">
            <h3>How to Grow</h3>
            <ul className="growth-tips">
              <li>🌱 Add mood entries to help your plant grow</li>
              <li>💧 Water your plant regularly to maintain health</li>
              <li>😊 Positive moods help your plant grow faster</li>
              <li>📈 Track your progress with mood trends</li>
              <li>🎯 Complete daily check-ins for bonus growth</li>
              <li>💬 Chat with AI - sentiment scores boost growth!</li>
            </ul>
            <button 
              className="action-btn" 
              onClick={fetchSentimentGrowth}
              disabled={isLoadingSentiment}
              style={{ marginTop: '10px', width: '100%' }}
            >
              {isLoadingSentiment ? 'Loading...' : 'Refresh Sentiment Growth'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPlant;