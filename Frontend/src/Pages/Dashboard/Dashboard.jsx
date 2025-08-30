import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowUpward, MdCalendarToday, MdTrackChanges, MdMessage, MdAdd, MdBarChart, MdPlayCircleOutline } from 'react-icons/md';
import { FaRegHeart, FaBook } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { useMentalHealth } from '../../context/MentalHealthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    moodEntries, 
    journalEntries, 
    goals, 
    habits, 
    crisisLevel,
    addMoodEntry,
    dailyTip
  } = useMentalHealth();
  
  const [quickMood, setQuickMood] = useState(null);
  const [recentMoodData, setRecentMoodData] = useState([]);

  // Generate mood chart data for the last 7 days
  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const moodData = last7Days.map(date => {
      const dayEntries = moodEntries.filter(entry => entry.date === date);
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length 
        : null;
      
      return {
        date: format(new Date(date), 'MMM dd'),
        mood: avgMood,
        entries: dayEntries.length
      };
    });

    setRecentMoodData(moodData);
  }, [moodEntries]);

  const handleQuickMood = (mood) => {
    setQuickMood(mood);
    addMoodEntry({
      mood,
      intensity: 5,
      activities: [],
      notes: 'Quick mood check-in'
    });
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getCrisisStatus = () => {
    if (crisisLevel === 0) return { status: 'Safe', color: '#10b981' };
    if (crisisLevel <= 2) return { status: 'Monitoring', color: '#f59e0b' };
    if (crisisLevel <= 4) return { status: 'Warning', color: '#ef4444' };
    return { status: 'Critical', color: '#dc2626' };
  };

  const crisisStatus = getCrisisStatus();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back! 👋</h1>
        <p>Here's your mental health overview for today</p>
      </div>

      {/* Crisis Status */}
      {crisisLevel > 0 && (
        <div className="crisis-alert" style={{ borderColor: crisisStatus.color }}>
          <div className="crisis-status" style={{ color: crisisStatus.color }}>
            Status: {crisisStatus.status}
          </div>
          <p>Crisis Level: {crisisLevel}/5</p>
          <Link to="/crisis-support" className="crisis-support-btn">
            Get Support Now
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-btn mood-btn"
            onClick={() => handleQuickMood(8)}
          >
            😊 Great
          </button>
          <button 
            className="action-btn mood-btn"
            onClick={() => handleQuickMood(6)}
          >
            🙂 Good
          </button>
          <button 
            className="action-btn mood-btn"
            onClick={() => handleQuickMood(4)}
          >
            😐 Okay
          </button>
          <button 
            className="action-btn mood-btn"
            onClick={() => handleQuickMood(2)}
          >
            😔 Not Great
          </button>
          <button 
            className="action-btn mood-btn"
            onClick={() => handleQuickMood(1)}
          >
            😢 Terrible
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaRegHeart />
          </div>
          <div className="stat-content">
            <h3>Mood Entries</h3>
            <p className="stat-number">{moodEntries.length}</p>
            <p className="stat-desc">This month</p>
          </div>
        </div>

        <Link to="/daily-tips" className="stat-card-link">
          <div className="stat-card">
            <div className="stat-content">
              <h3>Daily Tips</h3>
              {dailyTip ? (
                <>
                  <div className="tip-preview">
                    <div className="tip-icon">{dailyTip.icon}</div>
                    <div className="tip-info">
                      <p className="tip-title">{dailyTip.title}</p>
                      <p className="tip-category">{dailyTip.category}</p>
                    </div>
                  </div>
                  <p className="tip-content">{dailyTip.content.substring(0, 80)}...</p>
                </>
              ) : (
                <>
                  <p className="stat-number">0</p>
                  <p className="stat-desc">No tips yet</p>
                </>
              )}
            </div>
          </div>
        </Link>

        <div className="stat-card">
          <div className="stat-icon">
            <MdTrackChanges />
          </div>
          <div className="stat-content">
            <h3>Active Goals</h3>
            <p className="stat-number">{goals.filter(g => !g.completed).length}</p>
            <p className="stat-desc">In progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <MdBarChart />
          </div>
          <div className="stat-content">
            <h3>Habits</h3>
            <p className="stat-number">{habits.length}</p>
            <p className="stat-desc">Tracked</p>
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="chart-section">
        <h2>Mood Trends</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentMoodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {moodEntries.slice(-3).reverse().map(entry => (
            <div key={entry.id} className="activity-item">
              <div className="activity-icon">
                {getMoodEmoji(entry.mood)}
              </div>
              <div className="activity-content">
                <p>Mood check-in: {entry.mood}/10</p>
                <span className="activity-time">
                  {format(new Date(entry.timestamp), 'MMM dd, h:mm a')}
                </span>
              </div>
            </div>
          ))}
          {journalEntries?.slice(-2).reverse().map(entry => (
            <div key={entry.id} className="activity-item">
              <div className="activity-icon">
                <FaBook size={16} />
              </div>
              <div className="activity-content">
                <p>Journal entry: {entry.content.substring(0, 50)}...</p>
                <span className="activity-time">
                  {format(new Date(entry.timestamp), 'MMM dd, h:mm a')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="quick-nav">
        <Link to="/mood-tracker" className="nav-card">
          <FaRegHeart />
          <span>Track Mood</span>
        </Link>
        <Link to="/chat" className="nav-card">
          <MdMessage />
          <span>Talk to AI</span>
        </Link>
        <Link to="/mini-games" className="nav-card">
                          <MdPlayCircleOutline />
          <span>Play Games</span>
        </Link>
        <Link to="/goal-tracker" className="nav-card">
          <MdTrackChanges />
          <span>Set Goals</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 