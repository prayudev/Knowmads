import React, { useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { optionsData } from "../lib/options";
import { useEffect } from "react";

export default function SelectClass() {
  const { user, updateUser } = useAuth();
  const nav = useNavigate();

  const [selectedType, setSelectedType] = useState(null);
  const [subOption, setSubOption] = useState("");
  const [examCategory, setExamCategory] = useState(null);
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnnbkyqk";

  // ✅ MAIN SELECT FIX (IMPORTANT)
  const handleMainSelect = (type) => {
    setSelectedType(type);
    setSubOption("");
    setExamCategory(null);
  };

  useEffect(() => {
    if (user?.category && user?.subCategory) {
      nav("/", { replace: true });
    }
  }, []);

  const sendProfileSelectionToFormspree = async (userData) => {
    try {
      const body = new FormData();
      body.append("type", "User Profile Selection");
      body.append("name", userData?.name || "");
      body.append("email", userData?.email || "");
      body.append("username", userData?.username || "");
      body.append("category", userData?.category || "");
      body.append("subCategory", userData?.subCategory || "");
      body.append("updatedAt", new Date().toISOString());

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Formspree profile selection error:", result);
      } else {
        console.log("Profile selection sent to Formspree successfully");
      }
    } catch (error) {
      console.error("Profile selection Formspree submit failed:", error);
    }
  };

  // ✅ FINAL SAVE
  const handleFinal = async () => {
    if (!selectedType) return;

    const updated = {
      ...user,
      category: selectedType,
      subCategory: subOption || selectedType
    };

    updateUser(updated);
    await sendProfileSelectionToFormspree(updated);
    nav("/", { replace: true });
  };

  return (
    <div className="container">
      <h2>Complete Your Profile</h2>

      <p className="sub-text">
        Select your educational class or exam type
      </p>

      {/* ===== STEP 1: MAIN CATEGORY ===== */}
      {selectedType === null && (
        <div className="grid">
          <button onClick={() => handleMainSelect("10th")}>Class 10</button>
          <button onClick={() => handleMainSelect("12th")}>Class 12</button>
          <button onClick={() => handleMainSelect("graduation")}>Graduation</button>
          <button onClick={() => handleMainSelect("government")}>Government Exam</button>
        </div>
      )}

      {/* ===== STEP 2: GRADUATION ===== */}
      {selectedType === "graduation" && (
        <>
          <h3>Select Your Course</h3>

          <div className="grid">
            {optionsData.graduation.options.map((opt, i) => (
              <button
                key={i}
                className={subOption === opt ? "active" : ""}
                onClick={() => setSubOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            className="primary"
            disabled={!subOption}
            onClick={handleFinal}
          >
            Continue
          </button>

          <button
            className="back-btn"
            onClick={() => handleMainSelect(null)}
          >
            Back
          </button>
        </>
      )}

      {/* ===== STEP 2: GOVT CATEGORY ===== */}
      {selectedType === "government" && !examCategory && (
        <>
          <h3>Select Exam Category</h3>

          <div className="grid">
            {Object.keys(optionsData.government.options).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setExamCategory(key);
                  setSubOption("");
                }}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            className="back-btn"
            onClick={() => handleMainSelect(null)}
          >
            Back
          </button>
        </>
      )}

      {/* ===== STEP 3: GOVT EXAMS ===== */}
      {selectedType === "government" && examCategory && (
        <>
          <h3>Select Your Target Exam</h3>

          <div className="grid">
            {optionsData.government.options[examCategory].map((exam, i) => (
              <button
                key={i}
                className={subOption === exam ? "active" : ""}
                onClick={() => setSubOption(exam)}
              >
                {exam}
              </button>
            ))}
          </div>

          <button
            className="primary"
            disabled={!subOption}
            onClick={handleFinal}
          >
            Continue
          </button>

          <button
            className="back-btn"
            onClick={() => setExamCategory(null)}
          >
            Back
          </button>
        </>
      )}

      {/* ===== SIMPLE (10th / 12th) ===== */}
      {(selectedType === "10th" || selectedType === "12th") && (
        <>
          <button className="primary" onClick={handleFinal}>
            Continue
          </button>

          <button
            className="back-btn"
            onClick={() => handleMainSelect(null)}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}