import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
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

function App() {
  return (
    <MentalHealthProvider>
      <Router>
        <div className="app">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/dashboard" element={
              <>
                <Navigation />
                <Dashboard />
              </>
            } />
            <Route path="/mood-tracker" element={
              <>
                <Navigation />
                <MoodTracker />
              </>
            } />
            <Route path="/chat" element={
              <>
                <Navigation />
                <ChatInterface />
              </>
            } />
            <Route path="/mini-games" element={
              <>
                <Navigation />
                <MiniGames />
              </>
            } />
            <Route path="/virtual-plant" element={
              <>
                <Navigation />
                <VirtualPlant />
              </>
            } />
            <Route path="/daily-tips" element={
              <>
                <Navigation />
                <DailyTips />
              </>
            } />
            <Route path="/goal-tracker" element={
              <>
                <Navigation />
                <GoalTracker />
              </>
            } />
            <Route path="/crisis-support" element={<CrisisSupport />} />
          </Routes>
        </div>
      </Router>
    </MentalHealthProvider>
  );
}

export default App;
