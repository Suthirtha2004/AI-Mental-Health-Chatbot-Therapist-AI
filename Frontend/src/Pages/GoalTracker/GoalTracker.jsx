import { useState } from 'react';
import { MdAdd, MdTrackChanges, MdCheck, MdEdit, MdDelete, MdCalendarToday, MdBarChart } from 'react-icons/md';
import { FaTrophy } from 'react-icons/fa';
import { useMentalHealth } from '../../context/MentalHealthContext';
import './GoalTracker.css';

const GoalTracker = () => {
  const { goals, habits, addGoal, updateGoalProgress, addHabit, completeHabit } = useMentalHealth();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [activeTab, setActiveTab] = useState('goals');

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'wellness',
    targetDate: ''
  });

  const [habitForm, setHabitForm] = useState({
    name: '',
    category: 'wellness',
    frequency: 'daily'
  });

  const goalCategories = [
    { value: 'wellness', label: 'Wellness', icon: '💚' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'learning', label: 'Learning', icon: '📚' }
  ];

  const habitCategories = [
    { value: 'wellness', label: 'Wellness', icon: '💚' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'sleep', label: 'Sleep', icon: '😴' },
    { value: 'nutrition', label: 'Nutrition', icon: '🍎' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    addGoal(goalForm);
    setGoalForm({ title: '', description: '', category: 'wellness', targetDate: '' });
    setShowGoalForm(false);
  };

  const handleHabitSubmit = (e) => {
    e.preventDefault();
    addHabit(habitForm);
    setHabitForm({ name: '', category: 'wellness', frequency: 'daily' });
    setShowHabitForm(false);
  };

  const handleProgressUpdate = (goalId, newProgress) => {
    updateGoalProgress(goalId, Math.min(100, Math.max(0, newProgress)));
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 60) return '#84cc16';
    if (progress >= 40) return '#eab308';
    if (progress >= 20) return '#f97316';
    return '#ef4444';
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  return (
    <div className="goal-tracker">
      <div className="tracker-header">
        <h1>Goals & Habits Tracker</h1>
        <p>Set meaningful goals and build positive habits for your mental wellness</p>
      </div>

      <div className="tracker-tabs">
        <button 
          className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <MdTrackChanges size={16} />
          Goals
        </button>
        <button 
          className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          <MdBarChart size={16} />
          Habits
        </button>
      </div>

      {activeTab === 'goals' && (
        <div className="goals-section">
          <div className="section-header">
            <h2>Your Goals</h2>
            <button 
              className="add-btn"
              onClick={() => setShowGoalForm(true)}
            >
              <MdAdd size={16} />
              Add Goal
            </button>
          </div>

          <div className="goals-grid">
            {goals.map(goal => (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <div className="goal-category">
                    {goalCategories.find(cat => cat.value === goal.category)?.icon}
                    <span>{goalCategories.find(cat => cat.value === cat.value === goal.category)?.label}</span>
                  </div>
                  <div className="goal-actions">
                    <button className="action-btn">
                      <MdEdit size={14} />
                    </button>
                    <button className="action-btn">
                      <MdDelete size={14} />
                    </button>
                  </div>
                </div>
                
                <h3>{goal.title}</h3>
                <p>{goal.description}</p>
                
                <div className="goal-progress">
                  <div className="progress-info">
                    <span>Progress: {goal.progress}%</span>
                    <span>Target: {goal.targetDate}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${goal.progress}%`,
                        backgroundColor: getProgressColor(goal.progress)
                      }}
                    />
                  </div>
                  <div className="progress-controls">
                    <button 
                      className="progress-btn"
                      onClick={() => handleProgressUpdate(goal.id, goal.progress - 10)}
                      disabled={goal.progress <= 0}
                    >
                      -10%
                    </button>
                    <button 
                      className="progress-btn"
                      onClick={() => handleProgressUpdate(goal.id, goal.progress + 10)}
                      disabled={goal.progress >= 100}
                    >
                      +10%
                    </button>
                  </div>
                </div>

                {goal.progress >= 100 && (
                  <div className="goal-completed">
                    <FaTrophy size={16} />
                    <span>Goal Completed!</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {goals.length === 0 && (
            <div className="empty-state">
              <MdTrackChanges size={48} />
              <h3>No goals yet</h3>
              <p>Start by adding your first wellness goal!</p>
              <button 
                className="add-btn"
                onClick={() => setShowGoalForm(true)}
              >
                <MdAdd size={16} />
                Add Your First Goal
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'habits' && (
        <div className="habits-section">
          <div className="section-header">
            <h2>Your Habits</h2>
            <button 
              className="add-btn"
              onClick={() => setShowHabitForm(true)}
            >
              <MdAdd size={16} />
              Add Habit
            </button>
          </div>

          <div className="habits-grid">
            {habits.map(habit => (
              <div key={habit.id} className="habit-card">
                <div className="habit-header">
                  <div className="habit-category">
                    {habitCategories.find(cat => cat.value === habit.category)?.icon}
                    <span>{habitCategories.find(cat => cat.value === habit.category)?.label}</span>
                  </div>
                  <div className="habit-streak">
                    {getStreakEmoji(habit.streak)} {habit.streak} days
                  </div>
                </div>
                
                <h3>{habit.name}</h3>
                <p className="habit-frequency">{habit.frequency}</p>
                
                <div className="habit-actions">
                  <button 
                    className="complete-btn"
                    onClick={() => completeHabit(habit.id)}
                  >
                    <MdCheck size={16} />
                    Complete Today
                  </button>
                </div>

                <div className="habit-stats">
                  <div className="stat">
                    <span>Streak</span>
                    <span className="stat-value">{habit.streak}</span>
                  </div>
                  <div className="stat">
                    <span>Completed</span>
                    <span className="stat-value">{habit.completedDates.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {habits.length === 0 && (
            <div className="empty-state">
              <MdBarChart size={48} />
              <h3>No habits yet</h3>
              <p>Start building positive habits for your wellness!</p>
              <button 
                className="add-btn"
                onClick={() => setShowHabitForm(true)}
              >
                <MdAdd size={16} />
                Add Your First Habit
              </button>
            </div>
          )}
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Goal</h3>
              <button 
                className="close-btn"
                onClick={() => setShowGoalForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleGoalSubmit}>
              <div className="form-group">
                <label>Goal Title</label>
                <input
                  type="text"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                  placeholder="e.g., Practice meditation daily"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={goalForm.category}
                  onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                >
                  {goalCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Target Date</label>
                <input
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({...goalForm, targetDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowGoalForm(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habit Form Modal */}
      {showHabitForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Habit</h3>
              <button 
                className="close-btn"
                onClick={() => setShowHabitForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleHabitSubmit}>
              <div className="form-group">
                <label>Habit Name</label>
                <input
                  type="text"
                  value={habitForm.name}
                  onChange={(e) => setHabitForm({...habitForm, name: e.target.value})}
                  placeholder="e.g., Drink 8 glasses of water"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={habitForm.category}
                  onChange={(e) => setHabitForm({...habitForm, category: e.target.value})}
                >
                  {habitCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={habitForm.frequency}
                  onChange={(e) => setHabitForm({...habitForm, frequency: e.target.value})}
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowHabitForm(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker; 