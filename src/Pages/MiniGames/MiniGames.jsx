import { MdPlayArrow, MdPause, MdRefresh, MdTrackChanges, MdLightbulbOutline } from 'react-icons/md';
import { FaRegHeart, FaTrophy } from 'react-icons/fa';


import { useState, useEffect } from 'react';
import { useMentalHealth } from '../../context/MentalHealthContext';
import './MiniGames.css';

const MiniGames = () => {
  const { updateGameScore, gameScores, gamesPlayed } = useMentalHealth();
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  const games = [
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      description: 'Follow the circle to practice deep breathing',
      icon: FaRegHeart,
      color: '#10b981'
    },
    {
      id: 'colorMatch',
      name: 'Color Match',
      description: 'Match the colors quickly to boost concentration',
      icon: MdTrackChanges,
      color: '#3b82f6'
    },
    {
      id: 'memory',
      name: 'Memory Game',
      description: 'Test your memory with card matching',
      icon: MdLightbulbOutline,
      color: '#8b5cf6'
    }
  ];

  const startGame = (gameId) => {
    setCurrentGame(gameId);
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > 0) {
      updateGameScore(currentGame, score);
    }
    setGameState('menu');
    setCurrentGame(null);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const BreathingExercise = () => {
    const [breathPhase, setBreathPhase] = useState('inhale');
    const [circleSize, setCircleSize] = useState(50);

    useEffect(() => {
      const interval = setInterval(() => {
        if (breathPhase === 'inhale') {
          setCircleSize(prev => {
            if (prev >= 100) {
              setBreathPhase('hold');
              return 100;
            }
            return prev + 2;
          });
        } else if (breathPhase === 'hold') {
          setTimeout(() => setBreathPhase('exhale'), 2000);
        } else {
          setCircleSize(prev => {
            if (prev <= 50) {
              setBreathPhase('inhale');
              setScore(prev => prev + 10);
              return 50;
            }
            return prev - 2;
          });
        }
      }, 100);

      return () => clearInterval(interval);
    }, [breathPhase]);

    return (
      <div className="breathing-game">
        <div className="breathing-instructions">
          <h3>Follow the circle to breathe</h3>
          <p className="breath-phase">{breathPhase.toUpperCase()}</p>
        </div>
        <div className="breathing-circle-container">
          <div 
            className="breathing-circle"
            style={{ 
              width: `${circleSize}%`, 
              height: `${circleSize}%`,
              backgroundColor: breathPhase === 'inhale' ? '#10b981' : '#ef4444'
            }}
          />
        </div>
        <div className="breathing-timer">
          <span>{timeLeft}s remaining</span>
        </div>
      </div>
    );
  };

  const ColorMatch = () => {
    const [targetColor, setTargetColor] = useState('');
    const [colorOptions, setColorOptions] = useState([]);
    const [lastScore, setLastScore] = useState(0);

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

    const generateNewRound = () => {
      const target = colors[Math.floor(Math.random() * colors.length)];
      const options = [target];
      while (options.length < 4) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        if (!options.includes(randomColor)) {
          options.push(randomColor);
        }
      }
      setTargetColor(target);
      setColorOptions(options.sort(() => Math.random() - 0.5));
    };

    useEffect(() => {
      generateNewRound();
    }, []);

    const handleColorClick = (color) => {
      if (color === targetColor) {
        setScore(prev => prev + 10);
        setLastScore(10);
        setTimeout(() => setLastScore(0), 1000);
        generateNewRound();
      } else {
        setScore(prev => Math.max(0, prev - 5));
        setLastScore(-5);
        setTimeout(() => setLastScore(0), 1000);
      }
    };

    return (
      <div className="color-match-game">
        <div className="color-target">
          <h3>Match this color:</h3>
          <div 
            className="target-color"
            style={{ backgroundColor: targetColor }}
          />
        </div>
        <div className="color-options">
          {colorOptions.map((color, index) => (
            <button
              key={index}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
        {lastScore !== 0 && (
          <div className={`score-feedback ${lastScore > 0 ? 'positive' : 'negative'}`}>
            {lastScore > 0 ? '+' : ''}{lastScore}
          </div>
        )}
      </div>
    );
  };

  const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);

    const symbols = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🌱', '🌿'];

    useEffect(() => {
      initializeGame();
    }, []);

    const initializeGame = () => {
      const gameCards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({
          id: index,
          symbol,
          isFlipped: false,
          isMatched: false
        }));
      setCards(gameCards);
      setFlipped([]);
      setMatched([]);
    };

    const handleCardClick = (cardId) => {
      if (flipped.length === 2 || flipped.includes(cardId) || matched.includes(cardId)) {
        return;
      }

      const newFlipped = [...flipped, cardId];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (cards[first].symbol === cards[second].symbol) {
          setMatched(prev => [...prev, first, second]);
          setScore(prev => prev + 20);
          setFlipped([]);
        } else {
          setTimeout(() => {
            setFlipped([]);
          }, 1000);
        }
      }
    };

    return (
      <div className="memory-game">
        <div className="memory-grid">
          {cards.map((card) => (
            <button
              key={card.id}
              className={`memory-card ${
                flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <span className="card-symbol">
                {flipped.includes(card.id) || matched.includes(card.id) ? card.symbol : '❓'}
              </span>
            </button>
          ))}
        </div>
        <button className="reset-btn" onClick={initializeGame}>
          <MdRefresh size={16} />
          Reset Game
        </button>
      </div>
    );
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'breathing':
        return <BreathingExercise />;
      case 'colorMatch':
        return <ColorMatch />;
      case 'memory':
        return <MemoryGame />;
      default:
        return null;
    }
  };

  return (
    <div className="mini-games">
      <div className="games-header">
        <h1>Mini Games</h1>
        <p>Boost your concentration and reduce stress with these fun activities</p>
      </div>

      {gameState === 'menu' && (
        <div className="games-menu">
          <div className="games-grid">
            {games.map((game) => {
              const Icon = game.icon;
              const bestScore = gameScores[game.id] || 0;
              
              return (
                <div key={game.id} className="game-card">
                  <div className="game-icon" style={{ backgroundColor: game.color }}>
                    <Icon size={32} />
                  </div>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                  {bestScore > 0 && (
                    <div className="best-score">
                      <FaTrophy size={16} />
                      <span>Best: {bestScore}</span>
                    </div>
                  )}
                  <button 
                    className="play-btn"
                    onClick={() => startGame(game.id)}
                    style={{ backgroundColor: game.color }}
                  >
                    <MdPlayArrow size={16} />
                    Play
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="stats-card">
            <h3>Your Stats</h3>
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-label">Games Played</span>
                <span className="stat-value">{gamesPlayed}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Score</span>
                <span className="stat-value">
                  {Object.values(gameScores).reduce((sum, score) => sum + score, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-container">
          <div className="game-header">
            <div className="game-info">
              <h2>{games.find(g => g.id === currentGame)?.name}</h2>
              <div className="game-stats">
                <div className="stat">
                  <FaTrophy size={16} />
                  <span>Score: {score}</span>
                </div>
                <div className="stat">
                  <span>Time: {timeLeft}s</span>
                </div>
              </div>
            </div>
            <button className="end-game-btn" onClick={endGame}>
              <MdPause size={16} />
              End Game
            </button>
          </div>
          
          <div className="game-content">
            {renderGame()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGames; 