import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

// This is a placeholder for your actual authentication check.
const useAuth = () => {
  const isAuthenticated = false; 
  return { isAuthenticated };
};

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleFeatureClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      localStorage.setItem('redirectPath', path);
      navigate('/login');
    }
  };

  const handleAuthClick = (path) => {
    localStorage.removeItem('redirectPath');
    navigate(path);
  };

  useEffect(() => {
    // Your animation code remains unchanged
    const createShapes = () => {
      const shapesContainer = document.createElement('div');
      shapesContainer.className = 'background-shapes';
      for (let i = 1; i <= 12; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shapesContainer.appendChild(shape);
      }
      document.body.appendChild(shapesContainer);
    };

    const createMentalHealthElements = () => {
      const elementsContainer = document.createElement('div');
      elementsContainer.className = 'mental-health-elements';
      for (let i = 1; i <= 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'welcome-breathing-circle';
        elementsContainer.appendChild(circle);
      }
      document.body.appendChild(elementsContainer);
    };

    const createGoldenStar = () => {
      const star = document.createElement('div');
      star.className = 'golden-star';
      star.innerHTML = '⭐';
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      const size = Math.random() * 0.8 + 0.8;
      star.style.fontSize = `${size}rem`;
      const duration = Math.random() * 8 + 12;
      star.style.animationDuration = `${duration}s`;
      document.body.appendChild(star);
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
        }
      }, duration * 1000);
    };

    const createSilverStar = () => {
      const star = document.createElement('div');
      star.className = 'silver-star';
      star.innerHTML = '✨';
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      const size = Math.random() * 0.6 + 0.7;
      star.style.fontSize = `${size}rem`;
      const duration = Math.random() * 6 + 10;
      star.style.animationDuration = `${duration}s`;
      document.body.appendChild(star);
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
        }
      }, duration * 1000);
    };

    const createFairyDust = () => {
      const colors = [
        'rgba(255, 255, 255, 0.8)', 'rgba(138, 110, 255, 0.7)',
        'rgba(79, 172, 254, 0.7)', 'rgba(161, 140, 209, 0.7)',
      ];
      const dust = document.createElement('div');
      dust.className = 'fairy-dust';
      const size = Math.random() * 8 + 3;
      dust.style.width = `${size}px`;
      dust.style.height = `${size}px`;
      dust.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      dust.style.left = `${Math.random() * 100}vw`;
      dust.style.top = `${Math.random() * 100}vh`;
      dust.style.animationDuration = `${Math.random() * 8 + 7}s`;
      document.body.appendChild(dust);
      setTimeout(() => {
        if (dust.parentNode) {
          dust.remove();
        }
      }, 10000);
    };

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    createShapes();
    createMentalHealthElements();
    for (let i = 0; i < 20; i++) {
      setTimeout(createFairyDust, i * 200);
    }
    for (let i = 0; i < 4; i++) {
      setTimeout(createGoldenStar, i * 500);
    }
    for (let i = 0; i < 6; i++) {
      setTimeout(createSilverStar, i * 400);
    }

    const interval = setInterval(() => {
      if (document.querySelectorAll('.fairy-dust').length < 25) {
        createFairyDust();
      }
    }, 800);
    const goldenStarInterval = setInterval(() => {
      if (document.querySelectorAll('.golden-star').length < 6) {
        createGoldenStar();
      }
    }, 3000);
    const silverStarInterval = setInterval(() => {
      if (document.querySelectorAll('.silver-star').length < 8) {
        createSilverStar();
      }
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(goldenStarInterval);
      clearInterval(silverStarInterval);
      if(style.parentNode) document.head.removeChild(style);
      const shapes = document.querySelector('.background-shapes');
      const elements = document.querySelector('.mental-health-elements');
      if (shapes) shapes.remove();
      if (elements) elements.remove();
      document.querySelectorAll('.fairy-dust').forEach(dust => dust.remove());
      document.querySelectorAll('.golden-star').forEach(star => star.remove());
      document.querySelectorAll('.silver-star').forEach(star => star.remove());
    };
  }, []);

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="logo">Therapist AI</div>
        <div className="tagline">
            Your 24/7 AI companion for mental wellness. Chat, track your mood, play calming games, and grow your virtual plant with personalized daily tips and support.
        </div>
      </header>

      <div className="main-content">
        <h1 className="welcome-text">
          Begin Your Enchanted Mental Health Journey
        </h1>
        <p className="description">
          Therapist AI helps you track your mood, gain valuable insights, and
          provides gentle guidance to nurture your mental wellbeing. Like fairy
          dust for your soul, we illuminate the path to your best self.
        </p>

        <div className="button-container">
          <button onClick={() => handleAuthClick('/login')} className="login-btn">
            Login
          </button>
          <button onClick={() => handleAuthClick('/signup')} className="login-btn">
            Sign Up
          </button>
        </div>

        {/* --- 💡 ADDED SECTION START --- */}
        <div className="welcome-chat-prompt" onClick={() => handleFeatureClick('/chat')}>
          <input 
            type="text" 
            placeholder="Start by sharing how you're feeling..." 
            readOnly 
          />
          <button>Chat Now</button>
        </div>
        {/* --- 💡 ADDED SECTION END --- */}

        <div className="features">
          <div className="feature" onClick={() => handleFeatureClick('/mood-tracker')}>
            <div className="feature-icon">❤️‍🩹</div>
            <h3 className="feature-title">Mood Tracker</h3>
            <p className="feature-desc">
              Log your daily emotions to understand your feelings and discover personal insights over time.
            </p>
          </div>
          <div className="feature" onClick={() => handleFeatureClick('/mini-games')}>
            <div className="feature-icon">🎮</div>
            <h3 className="feature-title">Mini Games</h3>
            <p className="feature-desc">
              Engage in fun, calming activities designed to reduce stress and improve your focus.
            </p>
          </div>
          <div className="feature" onClick={() => handleFeatureClick('/virtual-plant')}>
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">Mood Plant</h3>
            <p className="feature-desc">
              Nurture a virtual plant that grows and thrives based on your positive habits and mood entries.
            </p>
          </div>
        </div>
      </div>

      <footer className="welcome-footer">
        <span>©Copyright Bit Squad</span>
        <span className="disclaimer">
          Project Guides : Subhabrata Sengupta & Rupayan Das
        </span>
      </footer>
    </div>
  );
};

export default WelcomePage;