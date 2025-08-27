import { useEffect } from 'react';
import './WelcomePage.css'; // We'll update this next

const WelcomePage = () => {
  useEffect(() => {
    const createFairyDust = () => {
      const colors = [
        'rgba(160, 130, 240, 0.7)', // Bluish-purple
        'rgba(140, 120, 220, 0.6)', // Medium bluish-purple
        'rgba(190, 170, 250, 0.8)', // Light bluish-purple
      ];
      const dust = document.createElement('div');
      dust.className = 'fairy-dust';

      const size = Math.random() * 6 + 2;
      dust.style.width = `${size}px`;
      dust.style.height = `${size}px`;
      dust.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      dust.style.left = `${Math.random() * 100}vw`;
      dust.style.top = `${Math.random() * 100}vh`;
      dust.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;

      document.body.appendChild(dust);

      setTimeout(() => {
        dust.remove();
      }, Math.random() * 10000 + 5000);
    };

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 15; i++) {
      setTimeout(createFairyDust, i * 300);
    }

    const interval = setInterval(() => {
      if (document.querySelectorAll('.fairy-dust').length < 20) {
        createFairyDust();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <div className="logo">Therapist AI</div>
        <div className="tagline">
          Your magical companion for mental wellness and self-discovery
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

        <a href="/login" className="login-btn">
          Login 
        </a>
        
        <a href="/signup" className="login-btn">
           Sign Up
        </a>

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
