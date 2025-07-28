import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdTrackChanges, MdMessage, MdWarning, MdBarChart, MdPlayCircleOutline } from 'react-icons/md';
import { FaRegHeart, FaLeaf } from 'react-icons/fa';
import { useMentalHealth } from '../../context/MentalHealthContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { crisisLevel } = useMentalHealth();

  const navItems = [
    { path: '/dashboard', icon: MdHome, label: 'Dashboard' },
    { path: '/mood-tracker', icon: FaRegHeart, label: 'Mood Tracker' },
    { path: '/chat', icon: MdMessage, label: 'AI Chat' },
    { path: '/mini-games', icon: MdPlayCircleOutline, label: 'Mini Games' },
    { path: '/virtual-plant', icon: FaLeaf, label: 'Virtual Plant' },
    { path: '/daily-tips', icon: MdBarChart, label: 'Daily Tips' },
    { path: '/goal-tracker', icon: MdTrackChanges, label: 'Goals & Habits' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2 className="nav-title">Therapist AI</h2>
        {crisisLevel > 0 && (
          <div className="crisis-indicator">
            <MdWarning size={16} />
            <span>Crisis Level: {crisisLevel}</span>
          </div>
        )}
      </div>
      
      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="nav-footer">
        <Link to="/crisis-support" className="crisis-support-link">
          <MdWarning size={16} />
          <span>Crisis Support</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation; 