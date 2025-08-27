import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import LoginForm from "./components/Auth/LoginForm";
import SignupForm from "./components/Auth/SignupForm";
import WelcomePage from './Pages/Welcome_pg/WelcomePage';
import Dashboard from './Pages/Dashboard/Dashboard';
import MoodTracker from './Pages/MoodTracker/MoodTracker';
import ChatInterface from './Pages/ChatInterface/ChatInterface';
import MiniGames from './Pages/MiniGames/MiniGames';
import VirtualPlant from './Pages/VirtualPlant/VirtualPlant';
import DailyTips from './Pages/DailyTips/DailyTips';
import GoalTracker from './Pages/GoalTracker/GoalTracker';
import CrisisSupport from './Pages/CrisisSupport/CrisisSupport';
import Navigation from './components/Navigation/Navigation';
import { MentalHealthProvider } from './context/MentalHealthContext';
import { useState } from 'react';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <MentalHealthProvider>
      <Router>
        <Toaster position="top-right" />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Protected routes (with navigation) */}
          <Route
            path="/*"
            element={
              <div className="app">
                <Navigation />
                <main className="main-content">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/mood-tracker" element={<MoodTracker />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/mini-games" element={<MiniGames />} />
                    <Route path="/virtual-plant" element={<VirtualPlant />} />
                    <Route path="/daily-tips" element={<DailyTips />} />
                    <Route path="/goal-tracker" element={<GoalTracker />} />
                    <Route path="/crisis-support" element={<CrisisSupport />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </Router>
    </MentalHealthProvider>
  );
}

export default App;
