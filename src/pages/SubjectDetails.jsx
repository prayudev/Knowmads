import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function SubjectDetails() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const [topicName, setTopicName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const subject = (user?.subjects || []).find(
    (item) => String(item.id) === String(id)
  );

  if (!subject) {
    return (
      <>
        <Header />
        <div className="dashboard-container">
          <div className="card">
            <h2>Subject not found</h2>
            <p className="muted">This subject does not exist.</p>
          </div>
        </div>
      </>
    );
  }

  const handleAddTopic = () => {
    if (!topicName.trim()) {
      alert("Topic name required ❌");
      return;
    }

    const duplicate = (subject.topics || []).find(
      (topic) =>
        (topic.name || "").toLowerCase() === topicName.trim().toLowerCase()
    );

    if (duplicate) {
      alert("Topic already exists ❌");
      return;
    }

    const newTopic = {
      id: Date.now(),
      name: topicName.trim(),
      done: false
    };

    const updatedSubjects = (user?.subjects || []).map((item) => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          topics: [...(item.topics || []), newTopic]
        };
      }
      return item;
    });

    const updatedUser = {
      ...user,
      subjects: updatedSubjects
    };

    updateUser(updatedUser);
    setTopicName("");
    alert("Topic added ✅");
  };

 const handleToggleTopic = (topicId) => {
  const today = new Date();
  const todayString = today.toDateString();

  const updatedSubjects = (user?.subjects || []).map((item) => {
    if (String(item.id) === String(id)) {
      return {
        ...item,
        topics: (item.topics || []).map((topic) =>
          topic.id === topicId ? { ...topic, done: !topic.done } : topic
        )
      };
    }
    return item;
  });

  let updatedStreak = user?.streak || 0;
  let updatedLastStudyDate = user?.lastStudyDate || "";

  if (!updatedLastStudyDate) {
    // first time
    updatedStreak = 1;
  } else {
    const lastDate = new Date(updatedLastStudyDate);

    const diffInMs =
      today.setHours(0, 0, 0, 0) - lastDate.setHours(0, 0, 0, 0);

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) {
      // same day → no change
    } else if (diffInDays === 1) {
      // continuous streak
      updatedStreak += 1;
    } else {
      // ❌ gap → reset to 1 (new start)
      updatedStreak = 1;
    }
  }

  const updatedUser = {
    ...user,
    subjects: updatedSubjects,
    streak: updatedStreak,
    lastStudyDate: todayString
  };

  updateUser(updatedUser);
};

  const handleDeleteTopic = (topicId) => {
    const confirmDelete = window.confirm("Delete this topic?");
    if (!confirmDelete) return;

    const updatedSubjects = (user?.subjects || []).map((item) => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          topics: (item.topics || []).filter((topic) => topic.id !== topicId)
        };
      }
      return item;
    });

    const updatedUser = {
      ...user,
      subjects: updatedSubjects
    };

    updateUser(updatedUser);
  };

  const totalTopics = (subject.topics || []).length;
  const completedTopics = (subject.topics || []).filter((topic) => topic.done).length;

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="card big-card">
          <div className="subject-details-head">
            <div
              className="subject-details-color"
              style={{ background: subject.color || "#3b82f6" }}
            ></div>

            <div className="subject-details-info">
              <h2>{subject.name}</h2>
              <p className="muted">
                {completedTopics}/{totalTopics} topics completed
              </p>
            </div>
          </div>
        </div>

       <div className="topic-add-box">
  <input
    type="text"
    placeholder="Enter topic name"
    value={topicName}
    onChange={(e) => setTopicName(e.target.value)}
    className="topic-input"
  />


  <button className="primary" onClick={handleAddTopic}>
    Add Topic
  </button>
</div>

        <div className="topic-list-grid">
          {(subject.topics || []).length === 0 ? (
            <div className="card">
              <p className="muted">No topics added yet.</p>
            </div>
          ) : (
            subject.topics.map((topic) => (
              <div
                key={topic.id}
                className={`card topic-card ${topic.done ? "topic-done-card" : ""}`}
              >
                <div className="topic-card-top">
                  <div className="topic-main-info">
                    <h3>{topic.name}</h3>
                    <p className="muted">
                      {topic.done ? "Completed ✅" : "Pending"}
                    </p>
                  </div>

                  <div className="topic-action-group">
                    <button
                      className={`topic-status-btn ${topic.done ? "done-btn" : ""}`}
                      onClick={() => handleToggleTopic(topic.id)}
                    >
                      {topic.done ? "Completed" : "Mark Done"}
                    </button>

                    <button
                      className="topic-delete-btn"
                      onClick={() => handleDeleteTopic(topic.id)}
                      title="Delete Topic"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}