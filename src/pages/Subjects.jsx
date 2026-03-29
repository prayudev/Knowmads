import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const { user, updateUser } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  const colorOptions = [
    "#3b82f6", // blue
    "#a855f7", // purple
    "#22c55e", // green
    "#ff2d3f", // red
    "#eab308", // yellow
    "#ec4899", // pink
    "#6366f1", // indigo
    "#14b8a6"  // teal
  ];

  const subjectPlaceholder = useMemo(() => {
    switch (user?.category) {
      case "10th":
        return "e.g., Mathematics, Science, English";
      case "12th":
        return "e.g., Physics, Chemistry, Biology";
      case "graduation":
        if (user?.subCategory === "BTech") {
          return "e.g., Data Structures, DBMS, Operating System";
        }
        if (user?.subCategory === "BCA") {
          return "e.g., Programming in C, Web Development, DBMS";
        }
        if (user?.subCategory === "BSc") {
          return "e.g., Physics, Chemistry, Mathematics";
        }
        return "e.g., Core Subject, Elective, Lab";
      case "government":
        return "e.g., Quant, Reasoning, English, GK";
      default:
        return "e.g., Mathematics, Physics";
    }
  }, [user]);
   const nav = useNavigate();
  const suggestionList = useMemo(() => {
    switch (user?.category) {
      case "10th":
        return ["Mathematics", "Science", "Social Science", "English", "Hindi"];
      case "12th":
        return ["Physics", "Chemistry", "Mathematics", "Biology", "English"];
      case "graduation":
        if (user?.subCategory === "BTech") {
          return ["DSA", "DBMS", "OS", "Computer Networks", "Java"];
        }
        if (user?.subCategory === "BCA") {
          return ["Programming", "DBMS", "Web Development", "Networking"];
        }
        return ["Core Subject", "Elective", "Practical", "Project"];
      case "government":
        return ["Reasoning", "Quant", "English", "Current Affairs", "GK"];
      default:
        return ["Mathematics", "Science", "English"];
    }
  }, [user]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubjectName("");
    setSelectedColor("#3b82f6");
  };

  const handleDeleteSubject = (subjectId) => {
    const confirmDelete = window.confirm("Delete this subject?");
    if (!confirmDelete) return;

    const updatedUser = {
      ...user,
      subjects: (user?.subjects || []).filter(
        (subject) => subject.id !== subjectId
      )
    };

    updateUser(updatedUser);
  };

  const handleCreateSubject = () => {
    if (!subjectName.trim()) {
      alert("Subject name required ❌");
      return;
    }

    const duplicate = (user?.subjects || []).find(
      (sub) => sub.name.toLowerCase() === subjectName.trim().toLowerCase()
    );

    if (duplicate) {
      alert("This subject already exists ❌");
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: subjectName.trim(),
      color: selectedColor,
      topics: []
    };

    const updatedUser = {
      ...user,
      subjects: [...(user?.subjects || []), newSubject]
    };

    updateUser(updatedUser);
    handleCloseModal();
    alert("Subject created ✅");
  };

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">Subjects</h1>
            <p className="muted">Manage your study subjects and topics</p>
          </div>

          <button
            className="primary add-subject-top-btn"
            onClick={handleOpenModal}
          >
            + Add Subject
          </button>
        </div>

        {(user?.subjects || []).length === 0 ? (
          <div className="card subjects-empty-card">
            <div className="subjects-empty-icon">📖</div>
            <h2>No subjects yet</h2>
            <p className="muted">Create your first subject to get started</p>

            <button
              className="primary create-first-btn"
              onClick={handleOpenModal}
            >
              + Create First Subject
            </button>
          </div>
        ) : (
          <div className="subject-list-grid">
            {user.subjects.map((subject) => (
             <div
  key={subject.id}
  className="card subject-card clickable-subject-card"
  onClick={() => {
    console.log("clicked", subject.id); // 👈 debug
    nav(`/subjects/${subject.id}`);
  }}
>
  <div className="subject-card-top">
    <div
      className="subject-color-dot"
      style={{ background: subject.color || "#3b82f6" }}
    ></div>

    <button
      className="subject-delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteSubject(subject.id);
      }}
    >
      🗑
    </button>
  </div>

  <h3>{subject.name}</h3>
  <p className="muted">{(subject.topics || []).length} topics</p>
</div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="subject-modal-overlay" onClick={handleCloseModal}>
          <div className="subject-modal" onClick={(e) => e.stopPropagation()}>
            <button className="subject-modal-close" onClick={handleCloseModal}>
              ×
            </button>

            <h2>Create New Subject</h2>
            <p className="muted">
              Add a new subject to organize your study materials
            </p>

            <div className="subject-modal-field">
              <label>Subject Name</label>
              <input
                type="text"
                placeholder={subjectPlaceholder}
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>

            <div className="subject-suggestion-box">
              <p className="subject-suggestion-title">Suggested for you:</p>
              <div className="subject-suggestion-list">
                {suggestionList.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="subject-suggestion-chip"
                    onClick={() => setSubjectName(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="subject-modal-field">
              <label>Color</label>

              <div className="subject-color-grid">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`subject-color-btn ${
                      selectedColor === color ? "selected-color" : ""
                    }`}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                  ></button>
                ))}
              </div>
            </div>

            <div className="subject-modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button className="primary" onClick={handleCreateSubject}>
                Create Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}