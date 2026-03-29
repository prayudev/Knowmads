import React, { useEffect } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!user?.lastStudyDate) return;

    const today = new Date();
    const lastDate = new Date(user.lastStudyDate);

    const diffInMs =
      new Date(today).setHours(0, 0, 0, 0) -
      new Date(lastDate).setHours(0, 0, 0, 0);

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays > 1 && user.streak !== 0) {
      const updatedUser = {
        ...user,
        streak: 0
      };

      updateUser(updatedUser);
    }
  }, [user, updateUser]);

  const totalSubjects = user?.subjects?.length || 0;

  const totalTopics =
    user?.subjects?.reduce((acc, s) => acc + (s.topics?.length || 0), 0) || 0;

  const completedTopics =
    user?.subjects?.reduce(
      (acc, s) => acc + (s.topics || []).filter((t) => t.done).length,
      0
    ) || 0;

  const progressPercent =
    totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  const totalStudySeconds = user?.studyTime || 0;

  const formatStudyTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const incompleteTopics = (user?.subjects || []).flatMap((subject) =>
    (subject.topics || [])
      .filter((topic) => !topic.done)
      .map((topic) => ({
        subjectName: subject.name,
        topicName: topic.name
      }))
  );

  const recommendedTopics = incompleteTopics.slice(0, 3);

  const tasks = user?.tasks || [];

  const getTaskStatus = (task) => {
    if (task.completed) return "completed";
    if (task.dueDate < new Date().toISOString().split("T")[0]) return "overdue";
    return "pending";
  };

  const upcomingTasks = tasks
    .filter((task) => getTaskStatus(task) === "pending")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const upcomingCount = upcomingTasks.length;
  const nextUpcomingTask = upcomingTasks[0] || null;

  const pendingScheduleTaskCount = tasks.filter(
  (task) => getTaskStatus(task) === "pending"
).length;

const overdueScheduleTaskCount = tasks.filter(
  (task) => getTaskStatus(task) === "overdue"
).length;

const completedScheduleTaskCount = tasks.filter(
  (task) => getTaskStatus(task) === "completed"
).length;

const pendingTopicCount =
  user?.subjects?.reduce(
    (acc, subject) =>
      acc + (subject.topics || []).filter((topic) => !topic.done).length,
    0
  ) || 0;

const completedTopicCount =
  user?.subjects?.reduce(
    (acc, subject) =>
      acc + (subject.topics || []).filter((topic) => topic.done).length,
    0
  ) || 0;

const pendingTaskCount = pendingScheduleTaskCount + pendingTopicCount;
const overdueTaskCount = overdueScheduleTaskCount;
const completedTaskCount = completedScheduleTaskCount + completedTopicCount;

  const recentCompletedTopics = (user?.subjects || []).flatMap((subject) =>
    (subject.topics || [])
      .filter((topic) => topic.done)
      .map((topic) => ({
        type: "topic",
        name: topic.name,
        subjectName: subject.name,
        id: `topic-${topic.id}`
      }))
  );

  const recentCompletedTasks = tasks
    .filter((task) => task.completed)
    .map((task) => ({
      type: "task",
      name: task.title || task.name,
      dueDate: task.dueDate,
      id: `task-${task.id}`
    }));

  const recentActivity = [...recentCompletedTopics, ...recentCompletedTasks].slice(0, 5);

  return (
    <>
      <Header />
      <Helmet>
        
        <title>Dashboard - Knowmads Study Planner</title></Helmet>
      <div className="dashboard-container">
        <div className="hero">
          <h1>Welcome back, {user?.username} 👋</h1>
          <p>Here's your study progress at a glance</p>
          
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>📘 Subjects</h4>
            <h2>{totalSubjects}</h2>
            <p>Total subjects created</p>
          </div>

          <div className="stat-card">
            <h4>✅ Topics</h4>
            <h2>{completedTopics}/{totalTopics}</h2>
            <p>Completed / Total topics</p>
          </div>

          <div className="stat-card">
            <h4>⏱ Study Time</h4>
            <h2>{formatStudyTime(totalStudySeconds)}</h2>
            <p>Total study time saved</p>
          </div>

          <div className="stat-card">
            <h4>🔥 Streak</h4>
            <h2>{user?.streak || 0} days</h2>
            <p>Current study streak</p>
          </div>
        </div>

        <div className="card big-card">
          <h3>⚡ Smart Recommendations</h3>
          <p>Personalized study suggestions</p>

          {recommendedTopics.length === 0 ? (
            <p className="muted">
              You're all caught up! Keep maintaining your study consistency.
            </p>
          ) : (
            <div className="recommendation-list">
              {recommendedTopics.map((item, index) => (
                <div key={index} className="recommendation-item">
                  <strong>{item.topicName}</strong>
                  <span className="muted">
                    {" "}in {item.subjectName} is not completed, please complete your topic.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

       <div className="card big-card">
  <h3>Task Overview</h3>
  <p className="muted">Includes schedule tasks + subject topics</p>

  <div className="schedule-meta-row">
    <span className="task-badge pending-badge">
      Pending: {pendingTaskCount}
    </span>
    <span className="task-badge overdue-badge">
      Overdue: {overdueTaskCount}
    </span>
    <span className="task-badge completed-badge">
      Completed: {completedTaskCount}
    </span>
  </div>
</div>

        <div className="grid-2">
          <div className="card">
            <h3>Overall Progress</h3>
            <p className="muted">Your learning journey</p>

            <div className="progress-bar">
              <div style={{ width: `${progressPercent}%` }}></div>
            </div>

            <p className="muted">{progressPercent}% completed</p>
            <p className="muted">{totalTopics} topics tracked</p>
          </div>

          <div className="card">
            <h3>Upcoming</h3>
            <p className="muted">Next study sessions</p>

            <h2>{upcomingCount}</h2>
            <p className="muted">scheduled sessions</p>

            {nextUpcomingTask ? (
              <div className="upcoming-task-box">
                <strong>{nextUpcomingTask.title || nextUpcomingTask.name}</strong>
                <p className="muted">
                  Due: {new Date(nextUpcomingTask.dueDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="muted">No upcoming sessions yet.</p>
            )}

            <button onClick={() => nav("/schedule")} className="primary">
              View Schedule
            </button>
          </div>
        </div>

        <div className="card big-card">
          <h3>Recent Activity</h3>

          {recentActivity.length === 0 ? (
            <p className="muted">No recent completed activity yet.</p>
          ) : (
            <div className="recent-activity-list">
              {recentActivity.map((item) => (
                <div key={item.id} className="recent-activity-item">
                  {item.type === "topic" ? (
                    <>
                      <strong>{item.name}</strong>
                      <span className="muted"> completed in {item.subjectName}</span>
                    </>
                  ) : (
                    <>
                      <strong>{item.name}</strong>
                      <span className="muted">
                        {" "}task completed
                        {item.dueDate
                          ? ` • Due ${new Date(item.dueDate).toLocaleDateString()}`
                          : ""}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card big-card">
          <h3>Motivation</h3>
          <p className="muted">
            Small daily progress builds long-term success. Stay consistent and keep moving forward.
          </p>
        </div>

        <div className="stats-grid">
          <div className="card action-card">
            <h3>Add Subject</h3>
            <p>Create a new subject to organize your studies</p>

            <button onClick={() => nav("/subjects")} className="primary">
              Create Subject
            </button>
          </div>

          <div className="card action-card">
            <h3>Plan Schedule</h3>
            <p>Schedule your study sessions</p>

            <button onClick={() => nav("/schedule")} className="primary">
              Add Schedule
            </button>
          </div>

          <div className="card action-card">
            <h3>Track Progress</h3>
            <p>View detailed progress analytics</p>

            <button onClick={() => nav("/progress")} className="primary">
              View Analytics
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
}