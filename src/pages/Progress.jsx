import React from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Progress() {
  const { user } = useAuth();

  const subjects = user?.subjects || [];
  const tasks = user?.tasks || [];
  const todayString = new Date().toISOString().split("T")[0];

  const getTaskStatus = (task) => {
    if (task.completed) return "completed";
    if (task.dueDate < todayString) return "overdue";
    return "pending";
  };

  const totalSubjects = subjects.length;

  const totalTopics = subjects.reduce(
    (acc, subject) => acc + (subject.topics?.length || 0),
    0
  );

  const completedTopics = subjects.reduce(
    (acc, subject) =>
      acc + (subject.topics || []).filter((topic) => topic.done).length,
    0
  );

  const pendingTopics = totalTopics - completedTopics;

  const topicProgressPercent =
    totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => getTaskStatus(task) === "completed"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => getTaskStatus(task) === "pending"
  ).length;
  const overdueTasks = tasks.filter(
    (task) => getTaskStatus(task) === "overdue"
  ).length;

  const taskProgressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const totalStudySeconds = user?.studyTime || 0;

  const formatStudyTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const overallProgressPercent = Math.round(
    (topicProgressPercent + taskProgressPercent) / 2
  );

  const topicGraphData = [
  { label: "Completed", value: completedTopics, className: "graph-bar-completed" },
  { label: "Pending", value: pendingTopics, className: "graph-bar-pending" }
];

const taskGraphData = [
  { label: "Completed", value: completedTasks, className: "graph-bar-completed" },
  { label: "Pending", value: pendingTasks, className: "graph-bar-pending" },
  { label: "Overdue", value: overdueTasks, className: "graph-bar-overdue" }
];

const maxSubjectTopics = Math.max(
  ...subjects.map((subject) => subject.topics?.length || 0),
  1
);

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">Progress</h1>
            <p className="muted">Track your study journey with clear analytics</p>
          </div>
        </div>

        {/* OVERALL SUMMARY */}
        <div className="card big-card">
          <h2>Overall Progress</h2>
          <p className="muted">Combined progress from topics and tasks</p>

          <div className="progress-summary-box">
            <div className="progress-summary-number">
              {overallProgressPercent}%
            </div>

            <div className="progress-summary-bar">
              <div style={{ width: `${overallProgressPercent}%` }}></div>
            </div>

            <p className="muted">Your overall learning completion</p>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="schedule-stats-grid">
          <div className="card schedule-stat-card">
            <h3>{totalSubjects}</h3>
            <p className="muted">Subjects</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{completedTopics}/{totalTopics}</h3>
            <p className="muted">Topics Completed</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{completedTasks}/{totalTasks}</h3>
            <p className="muted">Tasks Completed</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{formatStudyTime(totalStudySeconds)}</h3>
            <p className="muted">Study Time</p>
          </div>
        </div>

        {/* TOPIC + TASK PROGRESS */}
        <div className="grid-2">
          <div className="card">
            <h3>Topic Progress</h3>
            <p className="muted">Subject topics completion</p>

            <div className="progress-summary-bar progress-blue">
              <div style={{ width: `${topicProgressPercent}%` }}></div>
            </div>

            <div className="progress-meta-list">
              <p><strong>{topicProgressPercent}%</strong> completed</p>
              <p className="muted">Completed: {completedTopics}</p>
              <p className="muted">Pending: {pendingTopics}</p>
            </div>
          </div>

          <div className="card">
            <h3>Task Progress</h3>
            <p className="muted">Schedule task completion</p>

            <div className="progress-summary-bar progress-green">
              <div style={{ width: `${taskProgressPercent}%` }}></div>
            </div>

            <div className="progress-meta-list">
              <p><strong>{taskProgressPercent}%</strong> completed</p>
              <p className="muted">Completed: {completedTasks}</p>
              <p className="muted">Pending: {pendingTasks}</p>
              <p className="muted">Overdue: {overdueTasks}</p>
            </div>
          </div>
        </div>

        {/* SUBJECT WISE PROGRESS */}
        <div className="card big-card">
          <h3>Subject-wise Progress</h3>
          <p className="muted">See progress for each subject individually</p>

          {subjects.length === 0 ? (
            <p className="muted">No subjects added yet.</p>
          ) : (
            <div className="subject-progress-list">
              {subjects.map((subject) => {
                const total = subject.topics?.length || 0;
                const completed = (subject.topics || []).filter(
                  (topic) => topic.done
                ).length;

                const percent =
                  total === 0 ? 0 : Math.round((completed / total) * 100);

                return (
                  <div key={subject.id} className="subject-progress-item">
                    <div className="subject-progress-head">
                      <div className="subject-progress-left">
                        <span
                          className="subject-progress-color"
                          style={{ background: subject.color || "#3b82f6" }}
                        ></span>
                        <strong>{subject.name}</strong>
                      </div>

                      <span className="muted">
                        {completed}/{total}
                      </span>
                    </div>

                    <div className="progress-summary-bar">
                      <div
                        style={{
                          width: `${percent}%`,
                          background: subject.color || "#3b82f6"
                        }}
                      ></div>
                    </div>

                    <p className="muted">{percent}% completed</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

<div className="grid-2">
  
  {/* TOPIC GRAPH */}
  <div className="card">
    <h3>Topics Graph</h3>
    <p className="muted">Completed vs pending topics</p>

    <div className="progress-graph-list">
      {topicGraphData.map((item) => {
        const total = totalTopics || 1;
        const width = Math.round((item.value / total) * 100);

        return (
          <div key={item.label} className="progress-graph-item">
            <div className="progress-graph-head">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="progress-graph-track">
              <div
                className={`progress-graph-fill ${item.className}`}
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* TASK GRAPH */}
  <div className="card">
    <h3>Tasks Graph</h3>
    <p className="muted">Completed, pending and overdue tasks</p>

    <div className="progress-graph-list">
      {taskGraphData.map((item) => {
        const total = totalTasks || 1;
        const width = Math.round((item.value / total) * 100);

        return (
          <div key={item.label} className="progress-graph-item">
            <div className="progress-graph-head">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>

            <div className="progress-graph-track">
              <div
                className={`progress-graph-fill ${item.className}`}
                style={{ width: `${width}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

<div className="card big-card">
  <h3>Subject Comparison Graph</h3>
  <p className="muted">Compare topic load across subjects</p>

  {subjects.length === 0 ? (
    <p className="muted">No subjects added yet.</p>
  ) : (
    <div className="subject-compare-list">
      {subjects.map((subject) => {
        const total = subject.topics?.length || 0;
        const completed = (subject.topics || []).filter((topic) => topic.done).length;
        const totalWidth = Math.round((total / maxSubjectTopics) * 100);
        const completedWidth = total === 0 ? 0 : Math.round((completed / total) * totalWidth);

        return (
          <div key={subject.id} className="subject-compare-item">
            <div className="subject-compare-head">
              <div className="subject-progress-left">
                <span
                  className="subject-progress-color"
                  style={{ background: subject.color || "#3b82f6" }}
                ></span>
                <strong>{subject.name}</strong>
              </div>

              <span className="muted">
                {completed}/{total}
              </span>
            </div>

            <div className="subject-compare-track">
              <div
                className="subject-compare-total"
                style={{
                  width: `${totalWidth}%`,
                  background: `${subject.color || "#3b82f6"}33`
                }}
              ></div>

              <div
                className="subject-compare-completed"
                style={{
                  width: `${completedWidth}%`,
                  background: subject.color || "#3b82f6"
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

        {/* TASK BREAKDOWN */}
        <div className="card big-card">
          <h3>Task Breakdown</h3>
          <div className="schedule-meta-row">
            <span className="task-badge pending-badge">
              Pending: {pendingTasks}
            </span>
            <span className="task-badge overdue-badge">
              Overdue: {overdueTasks}
            </span>
            <span className="task-badge completed-badge">
              Completed: {completedTasks}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}