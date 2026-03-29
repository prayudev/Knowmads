import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const FOCUS = "focus";
const SHORT_BREAK = "shortBreak";
const LONG_BREAK = "longBreak";

export default function Timer() {
  const { user, updateUser } = useAuth();

  const [activeView, setActiveView] = useState("pomodoro");

  const [customFocusMinutes, setCustomFocusMinutes] = useState(25);
  const [customShortBreakMinutes, setCustomShortBreakMinutes] = useState(5);
  const [customLongBreakMinutes, setCustomLongBreakMinutes] = useState(15);

  const [pomodoroMode, setPomodoroMode] = useState(FOCUS);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  const pomodoroIntervalRef = useRef(null);
  const stopwatchIntervalRef = useRef(null);

  const totalStudySeconds = user?.studyTime || 0;
  const completedSessions = user?.completedSessions || 0;

  const durations = useMemo(
    () => ({
      [FOCUS]: Math.max(1, Number(customFocusMinutes) || 25) * 60,
      [SHORT_BREAK]: Math.max(1, Number(customShortBreakMinutes) || 5) * 60,
      [LONG_BREAK]: Math.max(1, Number(customLongBreakMinutes) || 15) * 60
    }),
    [customFocusMinutes, customShortBreakMinutes, customLongBreakMinutes]
  );

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const formatSmartTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const applyStudyProgress = (secondsToAdd) => {
    if (!secondsToAdd || secondsToAdd <= 0) return;

    const today = new Date();
    const todayString = today.toDateString();

    let updatedStreak = user?.streak || 0;
    const lastStudyDate = user?.lastStudyDate || "";

    if (!lastStudyDate) {
      updatedStreak = 1;
    } else {
      const lastDate = new Date(lastStudyDate);
      const diffInMs =
        new Date(today).setHours(0, 0, 0, 0) -
        new Date(lastDate).setHours(0, 0, 0, 0);

      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays === 0) {
        // same day
      } else if (diffInDays === 1) {
        updatedStreak += 1;
      } else {
        updatedStreak = 1;
      }
    }

    const updatedUser = {
      ...user,
      studyTime: (user?.studyTime || 0) + secondsToAdd,
      streak: updatedStreak,
      lastStudyDate: todayString,
      completedSessions: (user?.completedSessions || 0) + 1
    };

    updateUser(updatedUser);
  };

  useEffect(() => {
    if (!isPomodoroRunning) {
      clearInterval(pomodoroIntervalRef.current);
      return;
    }

    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(pomodoroIntervalRef.current);
          setIsPomodoroRunning(false);

          if (pomodoroMode === FOCUS) {
            applyStudyProgress(durations[FOCUS]);
            alert("Focus session completed ✅");
          } else {
            alert("Break completed ✅");
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(pomodoroIntervalRef.current);
  }, [isPomodoroRunning, pomodoroMode, durations, user]);

  useEffect(() => {
    if (!isStopwatchRunning) {
      clearInterval(stopwatchIntervalRef.current);
      return;
    }

    stopwatchIntervalRef.current = setInterval(() => {
      setStopwatchSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  useEffect(() => {
    if (!isPomodoroRunning) {
      setPomodoroSeconds(durations[pomodoroMode]);
    }
  }, [durations, pomodoroMode, isPomodoroRunning]);

  const handleChangePomodoroMode = (mode) => {
    setPomodoroMode(mode);
    setPomodoroSeconds(durations[mode]);
    setIsPomodoroRunning(false);
  };

  const handleStartPomodoro = () => setIsPomodoroRunning(true);
  const handlePausePomodoro = () => setIsPomodoroRunning(false);

  const handleResetPomodoro = () => {
    setIsPomodoroRunning(false);
    setPomodoroSeconds(durations[pomodoroMode]);
  };

  const handleSkipPomodoro = () => {
    setIsPomodoroRunning(false);

    if (pomodoroMode === FOCUS) {
      setPomodoroMode(SHORT_BREAK);
      setPomodoroSeconds(durations[SHORT_BREAK]);
    } else {
      setPomodoroMode(FOCUS);
      setPomodoroSeconds(durations[FOCUS]);
    }
  };

  const handleSavePomodoroProgress = () => {
    if (pomodoroMode !== FOCUS) {
      alert("Only study focus time can be saved ❌");
      return;
    }

    const elapsed = durations[FOCUS] - pomodoroSeconds;

    if (elapsed <= 0) {
      alert("No focus time to save ❌");
      return;
    }

    applyStudyProgress(elapsed);
    setIsPomodoroRunning(false);
    setPomodoroSeconds(durations[FOCUS]);
    alert("Study time saved ✅");
  };

  const handleStartStopwatch = () => setIsStopwatchRunning(true);
  const handlePauseStopwatch = () => setIsStopwatchRunning(false);

  const handleResetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (stopwatchSeconds <= 0) return;
    setLaps((prev) => [formatTime(stopwatchSeconds), ...prev]);
  };

  const handleSaveStopwatch = () => {
    if (stopwatchSeconds <= 0) {
      alert("No stopwatch study time to save ❌");
      return;
    }

    applyStudyProgress(stopwatchSeconds);
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
    setLaps([]);
    alert("Study time saved ✅");
  };

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">Timer</h1>
            <p className="muted">Stay focused, track time, and build consistency</p>
          </div>
        </div>

        <div className="schedule-stats-grid">
          <div className="card schedule-stat-card">
            <h3>{formatSmartTime(totalStudySeconds)}</h3>
            <p className="muted">Total Study Time</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{user?.streak || 0}</h3>
            <p className="muted">Current Streak</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{completedSessions}</h3>
            <p className="muted">Saved Sessions</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{activeView === "pomodoro" ? "Pomodoro" : "Stopwatch"}</h3>
            <p className="muted">Current Mode</p>
          </div>
        </div>

        <div className="timer-tab-row">
          <button
            type="button"
            className={
              activeView === "pomodoro"
                ? "filter-btn active-filter-btn"
                : "filter-btn"
            }
            onClick={() => setActiveView("pomodoro")}
          >
            Pomodoro
          </button>

          <button
            type="button"
            className={
              activeView === "stopwatch"
                ? "filter-btn active-filter-btn"
                : "filter-btn"
            }
            onClick={() => setActiveView("stopwatch")}
          >
            Stopwatch
          </button>
        </div>

        {activeView === "pomodoro" && (
          <>
            <div className="card big-card timer-page-card">
              <h2>Pomodoro Timer</h2>
              <p className="muted">Focus deeply, then take mindful breaks</p>

              <div className="timer-mode-row">
                <button
                  type="button"
                  className={
                    pomodoroMode === FOCUS
                      ? "filter-btn active-filter-btn"
                      : "filter-btn"
                  }
                  onClick={() => handleChangePomodoroMode(FOCUS)}
                >
                  Focus
                </button>

                <button
                  type="button"
                  className={
                    pomodoroMode === SHORT_BREAK
                      ? "filter-btn active-filter-btn"
                      : "filter-btn"
                  }
                  onClick={() => handleChangePomodoroMode(SHORT_BREAK)}
                >
                  Short Break
                </button>

                <button
                  type="button"
                  className={
                    pomodoroMode === LONG_BREAK
                      ? "filter-btn active-filter-btn"
                      : "filter-btn"
                  }
                  onClick={() => handleChangePomodoroMode(LONG_BREAK)}
                >
                  Long Break
                </button>
              </div>

              <div className="timer-custom-single-wrap">
                {pomodoroMode === FOCUS && (
                  <div className="timer-custom-card active-timer-card">
                    <label className="timer-label">Custom Focus Minutes</label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={customFocusMinutes}
                      onChange={(e) => setCustomFocusMinutes(e.target.value)}
                      className="timer-custom-input"
                      disabled={isPomodoroRunning}
                    />
                    <p className="muted timer-help-text">
                      Set your personal deep work duration.
                    </p>
                  </div>
                )}

                {pomodoroMode === SHORT_BREAK && (
                  <div className="timer-custom-card active-timer-card">
                    <label className="timer-label">Custom Short Break Minutes</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={customShortBreakMinutes}
                      onChange={(e) =>
                        setCustomShortBreakMinutes(e.target.value)
                      }
                      className="timer-custom-input"
                      disabled={isPomodoroRunning}
                    />
                    <p className="muted timer-help-text">
                      Keep it short and refreshing.
                    </p>
                  </div>
                )}

                {pomodoroMode === LONG_BREAK && (
                  <div className="timer-custom-card active-timer-card">
                    <label className="timer-label">Custom Long Break Minutes</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={customLongBreakMinutes}
                      onChange={(e) => setCustomLongBreakMinutes(e.target.value)}
                      className="timer-custom-input"
                      disabled={isPomodoroRunning}
                    />
                    <p className="muted timer-help-text">
                      Use this after long focus sessions.
                    </p>
                  </div>
                )}
              </div>

              <div className="timer-display">{formatTime(pomodoroSeconds)}</div>

              <div className="timer-actions">
                <button
                  type="button"
                  className="primary"
                  onClick={handleStartPomodoro}
                >
                  Start
                </button>

                <button type="button" onClick={handlePausePomodoro}>
                  Pause
                </button>

                <button type="button" onClick={handleResetPomodoro}>
                  Reset
                </button>

                <button type="button" onClick={handleSkipPomodoro}>
                  Skip
                </button>
              </div>

              <div className="timer-secondary-actions">
                <button
                  type="button"
                  className="primary full-btn"
                  onClick={handleSavePomodoroProgress}
                >
                  Save Study Progress
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Timer Tips</h3>
              <div className="recommendation-list">
                <div className="recommendation-item">
                  <strong>Focus:</strong>
                  <span className="muted">
                    {" "}Only focus mode adds study time.
                  </span>
                </div>
                <div className="recommendation-item">
                  <strong>Breaks:</strong>
                  <span className="muted">
                    {" "}Break timers help recovery, but are not counted as study time.
                  </span>
                </div>
                <div className="recommendation-item">
                  <strong>Custom Mode:</strong>
                  <span className="muted">
                    {" "}Set your own focus and break durations anytime.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "stopwatch" && (
          <>
            <div className="card big-card timer-page-card">
              <h2>Stopwatch</h2>
              <p className="muted">Track open-ended study sessions freely</p>

              <div className="timer-display">{formatTime(stopwatchSeconds)}</div>

              <div className="timer-actions">
                <button
                  type="button"
                  className="primary"
                  onClick={handleStartStopwatch}
                >
                  Start
                </button>

                <button type="button" onClick={handlePauseStopwatch}>
                  Pause
                </button>

                <button type="button" onClick={handleLap}>
                  Lap
                </button>

                <button type="button" onClick={handleResetStopwatch}>
                  Reset
                </button>
              </div>

              <div className="timer-secondary-actions">
                <button
                  type="button"
                  className="primary full-btn"
                  onClick={handleSaveStopwatch}
                >
                  Save Study Time
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Laps</h3>

              {laps.length === 0 ? (
                <p className="muted">No laps recorded yet.</p>
              ) : (
                <div className="lap-list">
                  {laps.map((lap, index) => (
                    <div key={index} className="lap-item">
                      <strong>Lap {laps.length - index}</strong>
                      <span>{lap}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}