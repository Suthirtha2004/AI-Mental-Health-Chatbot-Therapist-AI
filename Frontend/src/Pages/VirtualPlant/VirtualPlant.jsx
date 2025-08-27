import { useState } from 'react';
import { FaDropbox } from 'react-icons/fa';
import { useMentalHealth } from '../../context/MentalHealthContext';
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

  const plantStages = [
    { level: 1, name: 'Seed', emoji: '🌱', minGrowth: 0 },
    { level: 2, name: 'Sprout', emoji: '🌿', minGrowth: 20 },
    { level: 3, name: 'Small Plant', emoji: '🌱', minGrowth: 40 },
    { level: 4, name: 'Growing Plant', emoji: '🌿', minGrowth: 60 },
    { level: 5, name: 'Flowering Plant', emoji: '🌸', minGrowth: 80 },
    { level: 6, name: 'Mature Plant', emoji: '🌺', minGrowth: 100 }
  ];

  const currentStage = plantStages.find(stage => plantLevel >= stage.level) || plantStages[0];
  const nextStage = plantStages.find(stage => stage.level > plantLevel);
  

  const handleWaterPlant = () => {
    waterPlant();
    setShowWaterAnimation(true);
    setLastWateredTime(new Date());
    setTimeout(() => setShowWaterAnimation(false), 2000);
  };

  const getPlantSize = () => {
    const baseSize = 140 + (plantLevel * 24);
    const growthMultiplier = plantGrowth / 100;
    return Math.max(120, baseSize * growthMultiplier);
  };

  const getPlantColor = () => {
    if (plantHealth > 80) return '#22c55e';
    if (plantHealth > 60) return '#84cc16';
    if (plantHealth > 40) return '#eab308';
    if (plantHealth > 20) return '#f97316';
    return '#ef4444';
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

  // Achievements removed per design update

  return (
    <div className="virtual-plant">
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
                animation: `growPulse ${getGrowthPulseDuration()}s ease-in-out infinite`
              }}
            >
              {currentStage.emoji}
            </div>
            {showWaterAnimation && (
              <div className="water-animation">
                <FaDropbox size={24} />
              </div>
            )}
          </div>
          
          <div className="plant-info">
            <h2>{currentStage.name}</h2>
            <p>Level {plantLevel}</p>
            {nextStage && (
              <div className="next-stage">
                <span>Next: {nextStage.name} (Level {nextStage.level})</span>
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
          </div>

          <div className="action-card">
            <h3>How to Grow</h3>
            <ul className="growth-tips">
              <li>🌱 Add mood entries to help your plant grow</li>
              <li>💧 Water your plant regularly to maintain health</li>
              <li>😊 Positive moods help your plant grow faster</li>
              <li>📈 Track your progress with mood trends</li>
              <li>🎯 Complete daily check-ins for bonus growth</li>
            </ul>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default VirtualPlant; 