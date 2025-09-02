import { useState, useEffect } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { MdBarChart, MdAdd, MdArrowUpward, MdEdit } from 'react-icons/md';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { useMentalHealth } from '../../context/MentalHealthContext';
import { saveMoodEntry, getMoodEntries } from '../../firebase/firestore';
import { auth } from '../../firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import './MoodTracker.css';

const MoodTracker = () => {
  const { moodEntries, addMoodEntry } = useMentalHealth();
  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState('chart'); // chart, insights
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseMoodEntries, setFirebaseMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const moodOptions = [
    { value: 10, label: 'Ecstatic', emoji: '🤩', color: '#10b981' },
    { value: 9, label: 'Very Happy', emoji: '😄', color: '#34d399' },
    { value: 8, label: 'Happy', emoji: '😊', color: '#6ee7b7' },
    { value: 7, label: 'Good', emoji: '🙂', color: '#a7f3d0' },
    { value: 6, label: 'Okay', emoji: '😐', color: '#fbbf24' },
    { value: 5, label: 'Neutral', emoji: '😶', color: '#f59e0b' },
    { value: 4, label: 'Low', emoji: '😔', color: '#f97316' },
    { value: 3, label: 'Sad', emoji: '😢', color: '#ef4444' },
    { value: 2, label: 'Very Sad', emoji: '😭', color: '#dc2626' },
    { value: 1, label: 'Terrible', emoji: '💔', color: '#991b1b' }
  ];

  const activityOptions = [
    'Exercise', 'Work', 'Socializing', 'Sleep', 'Eating', 
    'Reading', 'Music', 'Nature', 'Creativity', 'Family',
    'Stress', 'Anxiety', 'Meditation', 'Therapy', 'Hobbies'
  ];

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        loadMoodEntries(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load mood entries from Firebase
  const loadMoodEntries = async (uid) => {
    try {
      setIsLoading(true);
      const entries = await getMoodEntries(uid);
      setFirebaseMoodEntries(entries);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMood === null || !currentUser) return;

    try {
      setIsLoading(true);
      
      // Save to Firebase
      const moodData = {
        mood: selectedMood,
        intensity,
        activities,
        notes,
        date: format(new Date(), 'yyyy-MM-dd')
      };
      
      await saveMoodEntry(currentUser.uid, moodData);
      
      // Also save to local context for immediate UI update
      addMoodEntry(moodData);
      
      // Reload mood entries from Firebase
      await loadMoodEntries(currentUser.uid);

      // Reset form
      setSelectedMood(null);
      setIntensity(5);
      setActivities([]);
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Error saving mood entry:', error);
      alert('Failed to save mood entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivity = (activity) => {
    setActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  // Generate chart data
  const getChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    // Use Firebase mood entries if available, otherwise fall back to local context
    const entriesToUse = firebaseMoodEntries.length > 0 ? firebaseMoodEntries : moodEntries;

    return last30Days.map(date => {
      const dayEntries = entriesToUse.filter(entry => entry.date === date);
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length 
        : null;
      
      return {
        date: format(new Date(date), 'MMM dd'),
        mood: avgMood,
        entries: dayEntries.length
      };
    });
  };

  // Generate activity distribution data
  const getActivityData = () => {
    const activityCounts = {};
    const entriesToUse = firebaseMoodEntries.length > 0 ? firebaseMoodEntries : moodEntries;
    
    entriesToUse.forEach(entry => {
      if (entry.activities && Array.isArray(entry.activities)) {
        entry.activities.forEach(activity => {
          activityCounts[activity] = (activityCounts[activity] || 0) + 1;
        });
      }
    });

    return Object.entries(activityCounts)
      .map(([activity, count]) => ({ activity, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Generate mood distribution data
  const getMoodDistribution = () => {
    const moodCounts = {};
    const entriesToUse = firebaseMoodEntries.length > 0 ? firebaseMoodEntries : moodEntries;
    
    entriesToUse.forEach(entry => {
      const moodLabel = moodOptions.find(m => m.value === entry.mood)?.label || 'Unknown';
      moodCounts[moodLabel] = (moodCounts[moodLabel] || 0) + 1;
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }));
  };

  const chartData = getChartData();
  const activityData = getActivityData();
  const moodDistribution = getMoodDistribution();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="mood-tracker">
      <div className="mood-header">
        <h1>Mood Tracker</h1>
        <p>Track your emotional journey and discover patterns</p>
        <button 
          className="add-mood-btn"
          onClick={() => setShowForm(true)}
        >
          <MdAdd size={20} />
          Add Mood Entry
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
          onClick={() => setViewMode('chart')}
        >
          <MdBarChart size={16} />
          Chart View
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'insights' ? 'active' : ''}`}
          onClick={() => setViewMode('insights')}
        >
          <MdArrowUpward size={16} />
          Insights
        </button>
      </div>

      {/* Mood Entry Form */}
      {showForm && (
        <div className="mood-form-overlay">
          <div className="mood-form">
            <div className="form-header">
              <h2>How are you feeling?</h2>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mood-selection">
                <h3>Select your mood:</h3>
                <div className="mood-grid">
                  {moodOptions.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
                      onClick={() => setSelectedMood(mood.value)}
                      style={{ borderColor: mood.color }}
                    >
                      <span className="mood-emoji">{mood.emoji}</span>
                      <span className="mood-label">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="intensity-section">
                <h3>Intensity: {intensity}/10</h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="intensity-slider"
                />
              </div>

              <div className="activities-section">
                <h3>What were you doing?</h3>
                <div className="activities-grid">
                  {activityOptions.map(activity => (
                    <button
                      key={activity}
                      type="button"
                      className={`activity-tag ${activities.includes(activity) ? 'selected' : ''}`}
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="notes-section">
                <h3>Additional notes (optional):</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what's on your mind..."
                  rows={4}
                  className="notes-input"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={selectedMood === null}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="chart-view">
          <div className="chart-container">
            <h2>Mood Trends (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
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
      )}

      {/* Insights View */}
      {viewMode === 'insights' && (
        <div className="insights-view">
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Mood Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ mood, percent }) => `${mood} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="insight-card">
              <h3>Most Common Activities</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="recent-entries">
        <h2>Recent Mood Entries</h2>
        {isLoading ? (
          <div className="loading-message">Loading mood entries...</div>
        ) : (
          <div className="entries-list">
            {(firebaseMoodEntries.length > 0 ? firebaseMoodEntries : moodEntries)
              .slice(-10)
              .reverse()
              .map(entry => (
              <div key={entry.id} className="entry-card">
                <div className="entry-mood">
                  {moodOptions.find(m => m.value === entry.mood)?.emoji}
                </div>
                <div className="entry-details">
                  <div className="entry-header">
                    <span className="entry-date">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="entry-time">
                      {format(new Date(entry.timestamp || entry.createdAt), 'h:mm a')}
                    </span>
                  </div>
                  <div className="entry-mood-info">
                    {moodOptions.find(m => m.value === entry.mood)?.label} 
                    (Intensity: {entry.intensity}/10)
                  </div>
                  {entry.activities && entry.activities.length > 0 && (
                    <div className="entry-activities">
                      {entry.activities.join(', ')}
                    </div>
                  )}
                  {entry.notes && (
                    <div className="entry-notes">
                      "{entry.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
            {firebaseMoodEntries.length === 0 && moodEntries.length === 0 && (
              <div className="no-entries">No mood entries yet. Add your first entry above!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker; 