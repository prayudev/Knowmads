import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";

const faqData = [
  {
    id: 1,
    category: "general",
    question: "What is Knowmads?",
    answer:
      "Knowmads is a smart study platform where students can manage subjects, topics, schedules, notes, current affairs, timers, and progress in one place."
  },
  {
    id: 2,
    category: "general",
    question: "Who can use Knowmads?",
    answer:
      "Knowmads can be used by school students, college students, government exam aspirants, and anyone who wants a simple and organized study system."
  },
  {
    id: 3,
    category: "account",
    question: "Will my data stay saved after login?",
    answer:
      "Yes. Your subjects, topics, progress, notes, profile details, and other saved study data remain stored for your account so that you can continue later."
  },
  {
    id: 4,
    category: "account",
    question: "Can I change my username or password?",
    answer:
      "Yes. You can change your username and password from your profile section. For password update, the old password is required first."
  },
  {
    id: 5,
    category: "subjects",
    question: "Can I add and delete subjects?",
    answer:
      "Yes. You can create subjects, choose colors, add topics inside them, and also delete subjects whenever needed."
  },
  {
    id: 6,
    category: "subjects",
    question: "Can I mark topics as completed?",
    answer:
      "Yes. Topics can be marked as completed and the dashboard and progress page will reflect that progress automatically."
  },
  {
    id: 7,
    category: "schedule",
    question: "How does the schedule page work?",
    answer:
      "The schedule page helps you add tasks, due dates, mark tasks completed, edit tasks, delete tasks, and track pending or overdue work."
  },
  {
    id: 8,
    category: "timer",
    question: "Does the timer save study time?",
    answer:
      "Yes. The timer can save actual study time. Focus sessions and stopwatch study sessions are added to your total saved study time."
  },
  {
    id: 9,
    category: "notes",
    question: "Can users upload notes?",
    answer:
      "Yes. Public users can upload notes, images, and PDFs within the allowed size limit. Admin resources can also be added separately."
  },
  {
    id: 10,
    category: "notes",
    question: "Are admin resources different from public notes?",
    answer:
      "Yes. Admin resources are managed separately and can include special links, notes, and study material shared for users."
  },
  {
    id: 11,
    category: "current",
    question: "Does the current affairs page update automatically?",
    answer:
      "Yes. The current affairs page fetches live news feed data and refreshes it automatically after a fixed interval."
  },
  {
    id: 12,
    category: "current",
    question: "Can I read the full article from current affairs?",
    answer:
      "Yes. Each current affairs card includes a button that opens the full article link in a new tab."
  },
  {
    id: 13,
    category: "progress",
    question: "How is progress calculated?",
    answer:
      "Progress is calculated from completed topics, completed tasks, saved study time, and subject-wise completion percentages."
  },
  {
    id: 14,
    category: "support",
    question: "How can I contact for help?",
    answer:
      "You can use the floating WhatsApp and Telegram buttons on the About page to contact directly for help or support."
  }
];

export default function FAQ() {
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState(null);

  const filteredFaqs = useMemo(() => {
    let result = [...faqData];

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((item) =>
        [item.question, item.answer, item.category]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    return result;
  }, [search, category]);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Header />
    <Helmet>
      <title>FAQ - Knowmads Study Planner</title>
      <meta
        name="description"
        content="Find answers to common questions about Knowmads, the smart study platform. Get help with account management, subjects, schedule, timer, notes, current affairs, progress tracking, and more."
      />
    </Helmet>
      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">FAQ</h1>
            <p className="muted">
              Find answers to common questions about Knowmads
            </p>
          </div>
        </div>

        <div className="card big-card faq-top-card">
          <div className="faq-search-row">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="faq-category-row">
            <button
              type="button"
              className={category === "all" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("all")}
            >
              All
            </button>

            <button
              type="button"
              className={category === "general" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("general")}
            >
              General
            </button>

            <button
              type="button"
              className={category === "account" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("account")}
            >
              Account
            </button>

            <button
              type="button"
              className={category === "subjects" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("subjects")}
            >
              Subjects
            </button>

            <button
              type="button"
              className={category === "schedule" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("schedule")}
            >
              Schedule
            </button>

            <button
              type="button"
              className={category === "timer" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("timer")}
            >
              Timer
            </button>

            <button
              type="button"
              className={category === "notes" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("notes")}
            >
              Notes
            </button>

            <button
              type="button"
              className={category === "current" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("current")}
            >
              Current Affairs
            </button>

            <button
              type="button"
              className={category === "progress" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("progress")}
            >
              Progress
            </button>

            <button
              type="button"
              className={category === "support" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("support")}
            >
              Support
            </button>
          </div>
        </div>

        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="card">
              <p className="muted">No FAQs found.</p>
            </div>
          ) : (
            filteredFaqs.map((item) => (
              <div
                key={item.id}
                className={`card faq-item ${openId === item.id ? "faq-item-open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(item.id)}
                >
                  <div className="faq-question-left">
                    <span className="task-badge pending-badge faq-badge">
                      {item.category}
                    </span>
                    <span>{item.question}</span>
                  </div>

                  <span className="faq-toggle-icon">
                    {openId === item.id ? "−" : "+"}
                  </span>
                </button>

                {openId === item.id && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="card big-card faq-help-card">
          <h3>Still need help?</h3>
          <p className="muted">
            If you still have questions, you can check the About page and use
            the WhatsApp or Telegram contact buttons for direct help.
          </p>
        </div>
      </div>
    </>
  );
}