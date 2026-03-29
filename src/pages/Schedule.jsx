import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Schedule() {
  const { user, updateUser } = useAuth();

  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const todayString = new Date().toISOString().split("T")[0];
  const allTasks = user?.tasks || [];

  const getTaskStatus = (task) => {
    if (task.completed) return "completed";
    if (task.dueDate < todayString) return "overdue";
    return "pending";
  };

  const handleAddTask = () => {
    if (!taskTitle.trim() || !dueDate) {
      alert("Task title and due date required ❌");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      tasks: [...allTasks, newTask]
    };

    updateUser(updatedUser);
    setTaskTitle("");
    setDueDate("");
    alert("Task added ✅");
  };

  const handleToggleTask = (taskId) => {
    const updatedUser = {
      ...user,
      tasks: allTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    };

    updateUser(updatedUser);
  };

  const handleDeleteTask = (taskId) => {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    const updatedUser = {
      ...user,
      tasks: allTasks.filter((task) => task.id !== taskId)
    };

    updateUser(updatedUser);

    if (editTaskId === taskId) {
      setEditTaskId(null);
      setEditTitle("");
      setEditDueDate("");
    }
  };

  const handleStartEdit = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate);
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTitle("");
    setEditDueDate("");
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editDueDate) {
      alert("Task title and due date required ❌");
      return;
    }

    const updatedUser = {
      ...user,
      tasks: allTasks.map((task) =>
        task.id === editTaskId
          ? {
              ...task,
              title: editTitle.trim(),
              dueDate: editDueDate
            }
          : task
      )
    };

    updateUser(updatedUser);
    setEditTaskId(null);
    setEditTitle("");
    setEditDueDate("");
    alert("Task updated ✅");
  };

  const sortedTasks = useMemo(() => {
    return [...allTasks].sort((a, b) => {
      const aStatus = getTaskStatus(a);
      const bStatus = getTaskStatus(b);

      if (aStatus === "completed" && bStatus !== "completed") return 1;
      if (aStatus !== "completed" && bStatus === "completed") return -1;

      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [allTasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "all") return sortedTasks;
    return sortedTasks.filter((task) => getTaskStatus(task) === filter);
  }, [filter, sortedTasks]);

  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter((task) => task.completed).length;
  const pendingCount = allTasks.filter((task) => getTaskStatus(task) === "pending").length;
  const overdueCount = allTasks.filter((task) => getTaskStatus(task) === "overdue").length;

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">Schedule</h1>
            <p className="muted">Plan your study sessions and stay on track</p>
          </div>
        </div>

        <div className="schedule-stats-grid">
          <div className="card schedule-stat-card">
            <h3>{totalTasks}</h3>
            <p className="muted">Total Tasks</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{pendingCount}</h3>
            <p className="muted">Pending</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{completedCount}</h3>
            <p className="muted">Completed</p>
          </div>

          <div className="card schedule-stat-card">
            <h3>{overdueCount}</h3>
            <p className="muted">Overdue</p>
          </div>
        </div>

        <div className="card big-card">
          <h2>Add Study Task</h2>
          <p className="muted">Create a schedule entry for your next study goal</p>

          <div className="schedule-form">
            <input
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <div className="date-input-wrap">
              <span className="date-input-icon">📅</span>
              <input
                type="date"
                value={dueDate}
                min={todayString}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-input"
              />
            </div>

            <button type="button" className="primary" onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>

        <div className="schedule-filter-row">
          <button
            type="button"
            className={filter === "all" ? "filter-btn active-filter-btn" : "filter-btn"}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={filter === "pending" ? "filter-btn active-filter-btn" : "filter-btn"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

          <button
            type="button"
            className={filter === "completed" ? "filter-btn active-filter-btn" : "filter-btn"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button
            type="button"
            className={filter === "overdue" ? "filter-btn active-filter-btn" : "filter-btn"}
            onClick={() => setFilter("overdue")}
          >
            Overdue
          </button>
        </div>

        <div className="schedule-task-grid">
          {visibleTasks.length === 0 ? (
            <div className="card">
              <p className="muted">No tasks found for this filter.</p>
            </div>
          ) : (
            visibleTasks.map((task) => {
              const status = getTaskStatus(task);
              const isEditing = editTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`card schedule-task-card ${
                    task.completed ? "task-done-card" : ""
                  } ${status === "overdue" ? "task-overdue-card" : ""}`}
                >
                  {isEditing ? (
                    <div className="schedule-edit-box">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Edit task title"
                      />

                      <div className="date-input-wrap">
                        <span className="date-input-icon">📅</span>
                        <input
                          type="date"
                          value={editDueDate}
                          min={todayString}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="date-input"
                        />
                      </div>

                      <div className="schedule-edit-actions">
                        <button type="button" className="primary" onClick={handleSaveEdit}>
                          Save
                        </button>
                        <button type="button" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="schedule-task-top">
                      <div className="schedule-task-info">
                        <h3>{task.title}</h3>

                        <div className="schedule-meta-row">
                          <span className="muted">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>

                          <span className={`task-badge ${status}-badge`}>
                            {status === "completed"
                              ? "Completed"
                              : status === "overdue"
                              ? "Overdue"
                              : "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="schedule-task-actions">
                        <button
                          type="button"
                          className={`task-toggle-btn ${task.completed ? "done-btn" : ""}`}
                          onClick={() => handleToggleTask(task.id)}
                        >
                          {task.completed ? "Completed" : "Mark Done"}
                        </button>

                        <button
                          type="button"
                          className="task-edit-btn"
                          onClick={() => handleStartEdit(task)}
                          title="Edit Task"
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          className="task-delete-btn"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete Task"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}