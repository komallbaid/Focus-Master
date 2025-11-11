import styles from './Timer.module.css'

import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';

function Timer() {
  // State management (UNCHANGED)
  const [inputError, setInputError] = useState(null);
  const [customMinutes, setCustomMinutes] = useState(() => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? JSON.parse(saved).customMinutes : 25;
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? JSON.parse(saved).breakMinutes : 5;
  });
  const [minutes, setMinutes] = useState(customMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingTime, setIsSettingTime] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(() => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? JSON.parse(saved).notificationEnabled : true;
  });
  const [autoStartNext, setAutoStartNext] = useState(() => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? JSON.parse(saved).autoStartNext : false;
  });
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const audioRef = useRef(null);

  const focusModes = [
    { name: "Pomodoro", minutes: 25, color: "#f44336" },
    { name: "Deep Work", minutes: 90, color: "#2196F3" },
    { name: "Sprint", minutes: 15, color: "#4CAF50" }
  ];

  // Effects (UNCHANGED)
  useEffect(() => {
    audioRef.current = new Audio('/sounds/alarm.wav');
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify({
      customMinutes,
      breakMinutes,
      notificationEnabled,
      autoStartNext
    }));
  }, [customMinutes, breakMinutes, notificationEnabled, autoStartNext]);

  // Helper functions (UNCHANGED)
  const totalSeconds = (isBreakTime ? breakMinutes : customMinutes) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  const playNotificationSound = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.error("Audio error:", e);
        if ('vibrate' in navigator) navigator.vibrate([200]);
      });
    } catch (e) {
      console.error("Audio playback failed:", e);
    }
  };

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else {
          if (minutes > 0) {
            setMinutes(prev => prev - 1);
            setSeconds(59);
          } else {
            clearInterval(interval);
            setIsRunning(false);
            
            if (!isBreakTime) {
              setIsBreakTime(true);
              setMinutes(breakMinutes);
              setSeconds(0);
              setSessionsCompleted(prev => prev + 1);
              setSessionHistory([...sessionHistory, {
                date: new Date(),
                duration: customMinutes,
                tasksCompleted: tasks.filter(t => t.completed).length
              }]);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
              if (autoStartNext) setIsRunning(true);
            } else {
              setIsBreakTime(false);
              setMinutes(customMinutes);
              setSeconds(0);
            }
            
            if (notificationEnabled) playNotificationSound();
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, notificationEnabled, autoStartNext, customMinutes, breakMinutes, isBreakTime, sessionHistory, tasks]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') setIsRunning(prev => !prev);
      if (e.code === 'KeyR') {
        setMinutes(isBreakTime ? breakMinutes : customMinutes);
        setSeconds(0);
        setIsRunning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customMinutes, breakMinutes, isBreakTime]);

  const applyCustomTime = () => {
    if (customMinutes >= 1 && customMinutes <= 120) {
      setMinutes(customMinutes);
      setSeconds(0);
      setIsRunning(false);
      setIsSettingTime(false);
      setInputError(null);
    } else {
      setInputError("Please enter 1-120 minutes");
    }
  };

  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Updated JSX with timer-container wrapper
  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {showConfetti && (
        <Confetti 
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      <div className="focus-app">
        <header className="app-header">
          <h1>Focus Master</h1>
          <p className="subtitle">Your productivity companion</p>
        </header>

        <div className="app-content">
          {/* Tasks Section (unchanged) */}
          <div className="tasks-section">
            <div className="card">
              <h2 className="section-title">
                <span className="icon">📝</span> Focus Tasks
              </h2>
              <div className="task-input-group">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What will you focus on?"
                  className="task-input"
                  onKeyDown={(e) => e.key === 'Enter' && newTask.trim() && (
                    setTasks([...tasks, { 
                      text: newTask.trim(), 
                      completed: false,
                      priority: taskPriority
                    }]),
                    setNewTask('')
                  )}
                />
                <div className="task-actions">
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="priority-select"
                  >
                    <option value="high">High 🔴</option>
                    <option value="medium">Medium 🟡</option>
                    <option value="low">Low 🟢</option>
                  </select>
                  <button 
                    className="btn add-btn"
                    onClick={() => {
                      if (newTask.trim()) {
                        setTasks([...tasks, { 
                          text: newTask.trim(), 
                          completed: false,
                          priority: taskPriority
                        }]);
                        setNewTask('');
                      }
                    }}
                    disabled={!newTask.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <ul className="task-list">
                {tasks.map((task, index) => (
                  <li 
                    key={index} 
                    className={`task-item ${task.completed ? 'completed' : ''} ${task.priority}`}
                  >
                    <label className="task-checkbox">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          const updatedTasks = [...tasks];
                          updatedTasks[index].completed = !task.completed;
                          setTasks(updatedTasks);
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className="task-text">{task.text}</span>
                    <button 
                      onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timer Section with new container */}
          <div className="timer-section">
            <div className="card">
              <div className="timer-container">
                <div className="timer-header">
                  <span className="session-counter">
                    <span className="icon">⏱️</span> Sessions: {sessionsCompleted}
                  </span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="theme-toggle"
                  >
                    {darkMode ? '☀️' : '🌙'}
                  </button>
                </div>

                {isBreakTime && (
                  <div className="break-notice">
                    <h3>☕ Break Time!</h3>
                    <p>Relax for {breakMinutes} minutes</p>
                  </div>
                )}

                <div className={`timer-display ${isBreakTime ? 'break' : ''}`}>
                  {minutes.toString().padStart(2, '0')}:
                  {seconds.toString().padStart(2, '0')}
                  {!notificationEnabled && (
                    <span className="mute-indicator" title="Notifications muted"> 🔕</span>
                  )}
                </div>

                <div className="focus-modes">
                  {focusModes.map((mode, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCustomMinutes(mode.minutes);
                        setMinutes(mode.minutes);
                        setSeconds(0);
                        setIsBreakTime(false);
                      }}
                      style={{ backgroundColor: mode.color }}
                      className={`mode-btn ${customMinutes === mode.minutes ? 'active' : ''}`}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>

                <div className="progress-container">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: isBreakTime ? '#4CAF50' : '#f44336'
                    }}
                  />
                </div>

                <div className="timer-controls">
                  <button 
                    onClick={() => setIsRunning(!isRunning)}
                    disabled={minutes === 0 && seconds === 0}
                    className={`btn ${isRunning ? 'pause-btn' : 'start-btn'}`}
                  >
                    {isRunning ? '⏸ Pause' : '▶ Start'}
                  </button>
                  
                  <div className="secondary-controls">
                    <button 
                      onClick={() => {
                        if (notificationEnabled) playNotificationSound();
                        setNotificationEnabled(!notificationEnabled);
                      }}
                      className={`btn ${notificationEnabled ? 'active' : ''}`}
                    >
                      {notificationEnabled ? '🔔' : '🔕'}
                    </button>
                    
                    <button 
                      onClick={() => setAutoStartNext(!autoStartNext)}
                      className={`btn ${autoStartNext ? 'active' : ''}`}
                    >
                      {autoStartNext ? '🔄' : '⏹'}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setMinutes(isBreakTime ? breakMinutes : customMinutes);
                        setSeconds(0);
                        setIsRunning(false);
                      }}
                      disabled={isRunning}
                      className="btn reset-btn"
                    >
                      ↻ Reset
                    </button>
                    
                    <button 
                      onClick={() => setIsSettingTime(true)}
                      className="btn settings-btn"
                    >
                      ⚙️ Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card analytics">
              <h3 className="section-title">
                <span className="icon">📊</span> Today's Progress
              </h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{sessionHistory.filter(s => isToday(s.date)).length}</div>
                  <div className="stat-label">Sessions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{sessionHistory.length}</div>
                  <div className="stat-label">Total</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {Math.floor(sessionHistory.reduce((a,b) => a + b.duration, 0) / 60)}h 
                    {sessionHistory.reduce((a,b) => a + b.duration, 0) % 60}m
                  </div>
                  <div className="stat-label">Focus Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isSettingTime && (
          <div className="modal-overlay">
            <div className="settings-modal">
              <h3>Timer Settings</h3>
              <div className="setting-group">
                <label>Work Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setCustomMinutes(value);
                    setInputError(value >= 1 && value <= 120 ? null : "Enter 1-120");
                  }}
                />
              </div>
              <div className="setting-group">
                <label>Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Math.min(15, Math.max(1, parseInt(e.target.value) || 5)))}
                />
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
              <div className="modal-actions">
                <button 
                  onClick={applyCustomTime}
                  className="btn primary-btn"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsSettingTime(false)}
                  className="btn secondary-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;