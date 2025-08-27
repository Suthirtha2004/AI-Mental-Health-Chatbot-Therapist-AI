import { createContext, useContext, useReducer, useEffect } from 'react';
import { format } from 'date-fns';

const MentalHealthContext = createContext();

const initialState = {
  user: null,
  moodEntries: [],
  goals: [],
  habits: [],
  chatHistory: [],
  crisisLevel: 0,
  isAuthenticated: false,
  // Virtual Plant
  plantLevel: 1,
  plantHealth: 100,
  plantGrowth: 0,
  plantWater: 100,
  plantLastWatered: null,
  // Mini Games
  gameScores: {},
  gamesPlayed: 0,
  // Daily Tips
  dailyTip: null,
  tipHistory: [],
  lastTipDate: null,
  // User Profile
  totalMoodEntries: 0,
  averageMood: 5,
  streakDays: 0,
  lastActiveDate: null
};

const mentalHealthReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    
    case 'ADD_MOOD_ENTRY':
      const newMoodEntry = {
        id: Date.now(),
        date: format(new Date(), 'yyyy-MM-dd'),
        timestamp: new Date().toISOString(),
        mood: action.payload.mood,
        intensity: action.payload.intensity,
        activities: action.payload.activities,
        notes: action.payload.notes
      };
      
      // Update plant growth based on positive mood
      let plantGrowthIncrease = 0;
      if (action.payload.mood >= 7) {
        plantGrowthIncrease = 10;
      } else if (action.payload.mood >= 5) {
        plantGrowthIncrease = 5;
      } else {
        plantGrowthIncrease = 2;
      }
      
      return {
        ...state,
        moodEntries: [...state.moodEntries, newMoodEntry],
        plantGrowth: Math.min(state.plantGrowth + plantGrowthIncrease, 100),
        totalMoodEntries: state.totalMoodEntries + 1,
        lastActiveDate: new Date().toISOString()
      };
    
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, {
          id: Date.now(),
          title: action.payload.title,
          description: action.payload.description,
          category: action.payload.category,
          targetDate: action.payload.targetDate,
          progress: 0,
          completed: false,
          createdAt: new Date().toISOString()
        }]
      };
    
    case 'UPDATE_GOAL_PROGRESS':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id
            ? { ...goal, progress: action.payload.progress }
            : goal
        )
      };
    
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, {
          id: Date.now(),
          name: action.payload.name,
          category: action.payload.category,
          frequency: action.payload.frequency,
          streak: 0,
          completedDates: [],
          createdAt: new Date().toISOString()
        }]
      };
    
    case 'COMPLETE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? {
                ...habit,
                completedDates: [...habit.completedDates, format(new Date(), 'yyyy-MM-dd')],
                streak: habit.streak + 1
              }
            : habit
        )
      };
    
    case 'SET_CRISIS_LEVEL':
      return { ...state, crisisLevel: action.payload };
    
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, {
          id: Date.now(),
          message: action.payload.message,
          sender: action.payload.sender,
          timestamp: new Date().toISOString(),
          sentiment: action.payload.sentiment
        }]
      };
    
    case 'ANALYZE_SENTIMENT':
      // Analyze sentiment and update crisis level if needed
      const sentiment = action.payload.sentiment;
      let newCrisisLevel = state.crisisLevel;
      
      if (sentiment < -0.7) {
        newCrisisLevel = Math.min(state.crisisLevel + 1, 5);
      } else if (sentiment > 0.3) {
        newCrisisLevel = Math.max(state.crisisLevel - 1, 0);
      }
      
      return { ...state, crisisLevel: newCrisisLevel };
    
    case 'RESET_CRISIS_LEVEL':
      return { ...state, crisisLevel: 0 };
    
    // Virtual Plant Actions
    case 'WATER_PLANT':
      return {
        ...state,
        plantWater: Math.min(state.plantWater + 30, 100),
        plantLastWatered: new Date().toISOString()
      };
    
    case 'UPDATE_PLANT_HEALTH':
      return {
        ...state,
        plantHealth: action.payload.health,
        plantLevel: action.payload.level
      };
    
    // Mini Games Actions
    case 'UPDATE_GAME_SCORE':
      return {
        ...state,
        gameScores: {
          ...state.gameScores,
          [action.payload.game]: action.payload.score
        },
        gamesPlayed: state.gamesPlayed + 1
      };
    
    // Daily Tips Actions
    case 'SET_DAILY_TIP':
      return {
        ...state,
        dailyTip: action.payload.tip,
        tipHistory: [...state.tipHistory, action.payload.tip],
        lastTipDate: new Date().toISOString()
      };
    
    case 'UPDATE_USER_STATS':
      return {
        ...state,
        averageMood: action.payload.averageMood,
        streakDays: action.payload.streakDays
      };
    
    default:
      return state;
  }
};

export const MentalHealthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mentalHealthReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('mentalHealthData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach(key => {
        if (key !== 'crisisLevel') {
          dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsedData[key] });
        }
      });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('mentalHealthData', JSON.stringify(state));
  }, [state]);

  // Crisis detection logic
  useEffect(() => {
    if (state.crisisLevel >= 4) {
      // Redirect to crisis support
      window.location.href = '/crisis-support';
    }
  }, [state.crisisLevel]);

  // Plant health decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.plantWater > 0) {
        dispatch({
          type: 'UPDATE_PLANT_HEALTH',
          payload: {
            health: Math.max(state.plantHealth - 1, 0),
            level: state.plantLevel
          }
        });
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [state.plantHealth, state.plantLevel, state.plantWater]);

  const value = {
    ...state,
    dispatch,
    addMoodEntry: (moodData) => dispatch({ type: 'ADD_MOOD_ENTRY', payload: moodData }),
    addGoal: (goalData) => dispatch({ type: 'ADD_GOAL', payload: goalData }),
    updateGoalProgress: (id, progress) => dispatch({ type: 'UPDATE_GOAL_PROGRESS', payload: { id, progress } }),
    addHabit: (habitData) => dispatch({ type: 'ADD_HABIT', payload: habitData }),
    completeHabit: (id) => dispatch({ type: 'COMPLETE_HABIT', payload: { id } }),
    addChatMessage: (messageData) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: messageData }),
    analyzeSentiment: (sentiment) => dispatch({ type: 'ANALYZE_SENTIMENT', payload: { sentiment } }),
    resetCrisisLevel: () => dispatch({ type: 'RESET_CRISIS_LEVEL' }),
    waterPlant: () => dispatch({ type: 'WATER_PLANT' }),
    updateGameScore: (game, score) => dispatch({ type: 'UPDATE_GAME_SCORE', payload: { game, score } }),
    setDailyTip: (tip) => dispatch({ type: 'SET_DAILY_TIP', payload: { tip } })
  };

  return (
    <MentalHealthContext.Provider value={value}>
      {children}
    </MentalHealthContext.Provider>
  );
};

export const useMentalHealth = () => {
  const context = useContext(MentalHealthContext);
  if (!context) {
    throw new Error('useMentalHealth must be used within a MentalHealthProvider');
  }
  return context;
}; 