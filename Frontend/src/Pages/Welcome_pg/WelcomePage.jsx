import { useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  useEffect(() => {
    // Create background shapes
    const createShapes = () => {
      const shapesContainer = document.createElement('div');
      shapesContainer.className = 'background-shapes';
      
      // Create more background bubbles (increased from 6 to 12)
      for (let i = 1; i <= 12; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shapesContainer.appendChild(shape);
      }
      
      document.body.appendChild(shapesContainer);
    };

    // Create mental health themed elements
    const createMentalHealthElements = () => {
      const elementsContainer = document.createElement('div');
      elementsContainer.className = 'mental-health-elements';
      
      // Breathing circles
      for (let i = 1; i <= 3; i++) {
        const circle = document.createElement('div');
        // Use a unique class to avoid CSS conflicts
        circle.className = 'welcome-breathing-circle';
        elementsContainer.appendChild(circle);
      }
      
  
      
      document.body.appendChild(elementsContainer);
    };

    // Create golden glowing stars with upward movement
    const createGoldenStar = () => {
      const star = document.createElement('div');
      star.className = 'golden-star';
      star.innerHTML = '⭐';
      
      // Random position across the entire page
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      
      // Random size variation
      const size = Math.random() * 0.8 + 0.8;
      star.style.fontSize = `${size}rem`;
      
      // Random animation duration
      const duration = Math.random() * 8 + 12;
      star.style.animationDuration = `${duration}s`;
      
      document.body.appendChild(star);

      // Remove star after animation completes
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
        }
      }, duration * 1000);
    };

    // Create silver twinkling stars with upward movement
    const createSilverStar = () => {
      const star = document.createElement('div');
      star.className = 'silver-star';
      star.innerHTML = '✨';
      
      // Random position across the entire page
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      
      // Random size variation
      const size = Math.random() * 0.6 + 0.7;
      star.style.fontSize = `${size}rem`;
      
      // Random animation duration
      const duration = Math.random() * 6 + 10;
      star.style.animationDuration = `${duration}s`;
      
      document.body.appendChild(star);

      // Remove star after animation completes
      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
        }
      }, duration * 1000);
    };

    // Enhanced fairy dust creation
    const createFairyDust = () => {
      const colors = [
        'rgba(255, 255, 255, 0.8)', // White
        'rgba(138, 110, 255, 0.7)', // Purple
        'rgba(79, 172, 254, 0.7)', // Blue
        'rgba(161, 140, 209, 0.7)', // Light purple
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

    // Add CSS animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Initialize elements
    createShapes();
    createMentalHealthElements();

    // Create initial fairy dust
    for (let i = 0; i < 20; i++) {
      setTimeout(createFairyDust, i * 200);
    }

    // Create initial golden stars
    for (let i = 0; i < 4; i++) {
      setTimeout(createGoldenStar, i * 500);
    }

    // Create initial silver stars
    for (let i = 0; i < 6; i++) {
      setTimeout(createSilverStar, i * 400);
    }

    // Continuous fairy dust generation
    const interval = setInterval(() => {
      if (document.querySelectorAll('.fairy-dust').length < 25) {
        createFairyDust();
      }
    }, 800);

    // Continuous golden star generation
    const goldenStarInterval = setInterval(() => {
      if (document.querySelectorAll('.golden-star').length < 6) {
        createGoldenStar();
      }
    }, 3000);

    // Continuous silver star generation
    const silverStarInterval = setInterval(() => {
      if (document.querySelectorAll('.silver-star').length < 8) {
        createSilverStar();
      }
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(goldenStarInterval);
      clearInterval(silverStarInterval);
      document.head.removeChild(style);
      
      // Clean up created elements
      const shapes = document.querySelector('.background-shapes');
      const elements = document.querySelector('.mental-health-elements');
      if (shapes) shapes.remove();
      if (elements) elements.remove();
      
      // Clean up fairy dust
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
          Your magical companion for mental wellness and self-discovery.
          <br />
          Explore a new path to wellbeing with our AI Chat, your 24/7 confidant for every thought and feeling. 
          <br />
          Cultivate mindfulness by tending to your Virtual Plant, find joy in our calming Mini Games, and build lasting habits with a personalized Goal Tracker. 
          <br />
          With daily inspiration from our Daily Tips and a comprehensive Mood Tracker to illuminate your journey, you have everything you need to flourish. 
          <br />
          Crisis Support is always available.
        </div>
      </header>

      <div className="main-content">
        <h1 className="welcome-text">
          Begin Your Enchanted Mental Health Journey
        </h1>
        <p className="description">
          Therapist AI helps you track your mood, uncover hidden patterns, and
          provides gentle guidance to nurture your mental wellbeing. Like fairy
          dust for your soul, we illuminate the path to your best self.
        </p>

        <div className="button-container">
          <a href="/login" className="login-btn">
            Login 
          </a>
          
          <a href="/signup" className="login-btn">
            Sign Up
          </a>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">🔮</div>
            <h3 className="feature-title">Mood Magic</h3>
            <p className="feature-desc">
              Capture your emotional journey with our enchanted tracking system
              that reveals your unique patterns.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">✍️</div>
            <h3 className="feature-title">Motivation Tips </h3>
            <p className="feature-desc">
              Our AI will provide motivation tips and nurturing
              recommendations.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">🦋</div>
            <h3 className="feature-title">Mood Plant</h3>
            <p className="feature-desc">
              A virtual plant that grows with your emotions.
            </p>
          </div>
        </div>
      </div>

      <footer className="welcome-footer">
        &copy; {new Date().getFullYear()} Therapist AI. All rights reserved.
        <span className="disclaimer">
          This is not a substitute for professional medical advice.
        </span>
      </footer>
    </div>
  );
};

export default WelcomePage;