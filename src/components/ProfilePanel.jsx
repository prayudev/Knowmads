import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { jsPDF } from "jspdf";

export default function ProfilePanel({ open, onClose, onLogout }) {
  const { user, updateUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [editType, setEditType] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user]);

  const tasks = user?.tasks || [];
  const subjects = user?.subjects || [];
  const todayString = new Date().toISOString().split("T")[0];

  const getTaskStatus = (task) => {
    if (task.completed) return "completed";
    if (task.dueDate < todayString) return "overdue";
    return "pending";
  };

  const pendingScheduleTasks = tasks.filter(
    (task) => getTaskStatus(task) === "pending"
  ).length;

  const overdueTasks = tasks.filter(
    (task) => getTaskStatus(task) === "overdue"
  ).length;

  const completedScheduleTasks = tasks.filter(
    (task) => getTaskStatus(task) === "completed"
  ).length;

  const pendingTopics = subjects.reduce((acc, subject) => {
    const count = (subject.topics || []).filter((topic) => !topic.done).length;
    return acc + count;
  }, 0);

  const completedTopics = subjects.reduce((acc, subject) => {
    const count = (subject.topics || []).filter((topic) => topic.done).length;
    return acc + count;
  }, 0);

  const pendingTasks = pendingScheduleTasks + pendingTopics;
  const totalCompletedTasks = completedScheduleTasks + completedTopics;

  const recentCompletedTopics = subjects.flatMap((subject) =>
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

  const recentActivity = [
    ...recentCompletedTopics,
    ...recentCompletedTasks
  ].slice(0, 4);

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedUser = {
        ...user,
        profileImage: reader.result
      };

      updateUser(updatedUser);
    };

    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (editType === "username") {
      if (!newUsername.trim()) {
        alert("Username cannot be empty");
        return;
      }

      const updatedUser = {
        ...user,
        username: newUsername.trim()
      };

      updateUser(updatedUser, user.username);
      setEditMode(false);
      setEditType("");
      alert("Username updated successfully ✅");
      return;
    }

    if (editType === "password") {
      if (!oldPassword.trim() || !newPassword.trim()) {
        alert("Old password and new password are required");
        return;
      }

      if (oldPassword !== user.password) {
        alert("Old password is incorrect ❌");
        return;
      }

      const updatedUser = {
        ...user,
        password: newPassword
      };

      updateUser(updatedUser);
      setEditMode(false);
      setEditType("");
      setOldPassword("");
      setNewPassword("");
      alert("Password updated successfully ✅");
    }
  };

  const handleEditReset = () => {
    setEditMode(false);
    setEditType("");
    setOldPassword("");
    setNewPassword("");
  };

  const loadImageAsDataURL = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      img.src = src;
    });
  };

  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF();
      let y = 18;

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const addLine = (text = "", gap = 8) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(String(text), 14, y);
        y += gap;
      };

      const addSectionTitle = (title) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        y += 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(30, 41, 59);
        doc.text(title, 14, y);

        y += 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
      };

      const formatStudyTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
      };

      const totalTopics = subjects.reduce(
        (acc, subject) => acc + (subject.topics?.length || 0),
        0
      );

      const taskPercent =
        tasks.length === 0
          ? 0
          : Math.round(
              (tasks.filter((t) => getTaskStatus(t) === "completed").length /
                tasks.length) *
                100
            );

      const topicPercent =
        totalTopics === 0
          ? 0
          : Math.round((completedTopics / totalTopics) * 100);

      const overallPercentParts = [];
      if (tasks.length > 0) overallPercentParts.push(taskPercent);
      if (totalTopics > 0) overallPercentParts.push(topicPercent);

      const overallProgress =
        overallPercentParts.length === 0
          ? 0
          : Math.round(
              overallPercentParts.reduce((a, b) => a + b, 0) /
                overallPercentParts.length
            );

      // ===== Header Background =====
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 38, "F");

      // ===== Main Logo =====
      try {
        const logoData = await loadImageAsDataURL("/logo.png");
        doc.addImage(logoData, "PNG", 10, 6, 20, 20);
        doc.addImage(logoData, "PNG", 10, 6, 20, 20);
      } catch (error) {
        console.warn("Logo load failed:", error);
      }

      // ===== Header Text =====
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("knowmads Student Report", 38, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Priya Study Diary", 38, 24);

      // ===== YouTube Icon =====
     

      // ===== Content Start =====
      y = 50;

      // ===== Student Information =====
      addSectionTitle("Student Information");
      addLine(`Name: ${user?.name || "-"}`);
      addLine(`Username: ${user?.username || "-"}`);
      addLine(`Category: ${user?.category || "-"}`);
      addLine(`Goal: ${user?.subCategory || "-"}`);

      // ===== Study Summary =====
      addSectionTitle("Study Summary");
      addLine(`Study Time: ${formatStudyTime(user?.studyTime || 0)}`);
      addLine(`Current Streak: ${user?.streak || 0} days`);
      addLine(`Total Subjects: ${subjects.length}`);
      addLine(`Total Topics: ${totalTopics}`);
      addLine(`Completed Topics: ${completedTopics}`);

      // ===== Task Summary =====
      addSectionTitle("Task Summary");
      addLine(`Pending Tasks: ${pendingTasks}`);
      addLine(`Overdue Tasks: ${overdueTasks}`);
      addLine(`Completed Tasks: ${totalCompletedTasks}`);

      // ===== Progress Overview =====
      addSectionTitle("Progress Overview");
      addLine(`Overall Progress: ${overallProgress}%`, 6);

      doc.setFillColor(230, 230, 230);
      doc.roundedRect(14, y, 180, 7, 2, 2, "F");

      doc.setFillColor(99, 102, 241);
      doc.roundedRect(14, y, (180 * overallProgress) / 100, 7, 2, 2, "F");
      y += 12;

      addLine(`Topic Progress: ${topicPercent}%`, 6);
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(14, y, 180, 6, 2, 2, "F");

      doc.setFillColor(34, 197, 94);
      doc.roundedRect(14, y, (180 * topicPercent) / 100, 6, 2, 2, "F");
      y += 10;

      addLine(`Task Progress: ${taskPercent}%`, 6);
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(14, y, 180, 6, 2, 2, "F");

      doc.setFillColor(59, 130, 246);
      doc.roundedRect(14, y, (180 * taskPercent) / 100, 6, 2, 2, "F");
      y += 12;

      // ===== Recent Activity =====
      addSectionTitle("Recent Activity");
      if (recentActivity.length === 0) {
        addLine("No recent completed activity yet.");
      } else {
        recentActivity.forEach((item, index) => {
          if (item.type === "topic") {
            addLine(
              `${index + 1}. ${item.name} (Topic) - ${item.subjectName}`,
              7
            );
          } else {
            addLine(
              `${index + 1}. ${item.name} (Task)${
                item.dueDate
                  ? ` - ${new Date(item.dueDate).toLocaleDateString()}`
                  : ""
              }`,
              7
            );
          }
        });
      }

      // ===== Subjects and Topics =====
      addSectionTitle("Subjects and Topics");
      if (subjects.length === 0) {
        addLine("No subjects added yet.");
      } else {
        subjects.forEach((subject, sIndex) => {
          if (y > 265) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          addLine(`${sIndex + 1}. ${subject.name}`, 7);
          doc.setFont("helvetica", "normal");

          if (!subject.topics || subject.topics.length === 0) {
            addLine("   - No topics", 7);
          } else {
            subject.topics.forEach((topic, tIndex) => {
              if (y > 275) {
                doc.addPage();
                y = 20;
              }

              addLine(
                `   ${tIndex + 1}) ${topic.name || "Untitled Topic"} - ${
                  topic.done ? "Completed" : "Pending"
                }`,
                7
              );
            });
          }

          y += 2;
        });
      }

      // ===== Scheduled Tasks =====
      addSectionTitle("Scheduled Tasks");
      if (tasks.length === 0) {
        addLine("No tasks added yet.");
      } else {
        tasks.forEach((task, index) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }

          addLine(
            `${index + 1}. ${task.title || task.name || "Untitled Task"} | ${
              getTaskStatus(task) === "completed"
                ? "Completed"
                : getTaskStatus(task) === "overdue"
                ? "Overdue"
                : "Pending"
            } | Due: ${
              task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"
            }`,
            7
          );
        });
      }

      // ===== Footer =====
      const totalPages = doc.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setDrawColor(220, 220, 220);
        doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.setFont("helvetica", "normal");
        doc.text("knowmads | Priya Study Diary", 14, pageHeight - 10);

        doc.setFontSize(8);
        doc.setTextColor(170, 170, 170);
        doc.text("Developer - Ayush", pageWidth / 2, pageHeight - 5, {
          align: "center"
        });

        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 10, {
          align: "right"
        });
      }

      doc.save(`${user?.username || "student"}-studyhub-report.pdf`);
      alert("Student data PDF downloaded ✅");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("PDF generate karte time issue aaya ❌");
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="profile-overlay" onClick={onClose}></div>

      <div className="profile-panel">
        <div className="profile-panel-top">
          <button className="profile-back-btn" onClick={onClose}>
            ←
          </button>

          <h3 className="profile-panel-title">Profile</h3>

          <button className="profile-edit-btn" onClick={handleEditReset}>
            ✎
          </button>
        </div>

        <div className="profile-panel-user">
          <div className="profile-avatar-wrap" onClick={handleChooseImage}>
            <img
              src={user?.profileImage || "/placeholder-user.jpg"}
              alt="Profile"
              className="profile-avatar"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <h2 className="profile-user-name">{user?.name || "User Name"}</h2>
          <p className="profile-user-email">
            @{user?.username || "username"}
          </p>
        </div>

        <div className="profile-stats-grid">
          <div className="profile-stat-card soft-yellow">
            <p className="profile-stat-title">Pending Tasks</p>
            <h2>{pendingTasks}</h2>
            <span>Topics + tasks</span>
          </div>

          <div className="profile-stat-card soft-pink">
            <p className="profile-stat-title">Overdue Tasks</p>
            <h2>{overdueTasks}</h2>
            <span>Schedule only</span>
          </div>

          <div className="profile-stat-card soft-green">
            <p className="profile-stat-title">Tasks Completed</p>
            <h2>{totalCompletedTasks}</h2>
            <span>Topics + tasks</span>
          </div>

          <div className="profile-stat-card soft-purple">
            <p className="profile-stat-title">Your Streak</p>
            <h2>{user?.streak || 0}</h2>
            <span>Total streak</span>
          </div>
        </div>

        <div className="profile-recent-box">
          <h3 className="profile-section-title">Recent Activity</h3>

          {recentActivity.length === 0 ? (
            <p className="profile-empty-text">No recent completed activity yet.</p>
          ) : (
            <div className="profile-recent-list">
              {recentActivity.map((item) => (
                <div key={item.id} className="profile-recent-item">
                  {item.type === "topic" ? (
                    <>
                      <strong>{item.name}</strong>
                      <span> in {item.subjectName}</span>
                    </>
                  ) : (
                    <>
                      <strong>{item.name}</strong>
                      <span>
                        {" "}task completed
                        {item.dueDate
                          ? ` • ${new Date(item.dueDate).toLocaleDateString()}`
                          : ""}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-menu-list">
          {editMode ? (
            <>
              {editType === "username" && (
                <input
                  type="text"
                  placeholder="New username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              )}

              {editType === "password" && (
                <>
                  <input
                    type="password"
                    placeholder="Old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </>
              )}

              <button className="profile-menu-item" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                className="profile-menu-item"
                onClick={() => {
                  setEditMode(true);
                  setEditType("username");
                }}
              >
                Change Username
              </button>

              <button
                className="profile-menu-item"
                onClick={() => {
                  setEditMode(true);
                  setEditType("password");
                }}
              >
                Change Password
              </button>

              <button className="profile-menu-item" onClick={handleDownloadPDF}>
                Download My Data PDF
              </button>

              <button className="profile-menu-item">Subscription</button>
            </>
          )}

          <button className="profile-menu-item logout-item" onClick={onLogout}>
            Log out
          </button>
        </div>

        <button className="delete-account-btn">Delete Account</button>
      </div>
    </>
  );
}