import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";

const RSS2JSON_API = "https://api.rss2json.com/v1/api.json";
const ADMIN_PASSWORD = "Prisensei@2505";
const RESOURCE_STORAGE_KEY = "studyhub_current_resources";

const ENGLISH_FEEDS = [
  "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
];

const HINDI_FEEDS = [
  "https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi"
];

export default function CurrentAffairs() {
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("en");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceDesc, setResourceDesc] = useState("");
  const [resourceImage, setResourceImage] = useState("");
  const [resources, setResources] = useState([]);

  const feedList = language === "en" ? ENGLISH_FEEDS : HINDI_FEEDS;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(RESOURCE_STORAGE_KEY) || "[]");
    setResources(saved);
  }, []);

  const persistResources = (updated) => {
    setResources(updated);
    localStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(updated));
  };

  const fetchFeed = async (rssUrl) => {
    const url = `${RSS2JSON_API}?rss_url=${encodeURIComponent(rssUrl)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.status !== "ok") {
      throw new Error(data?.message || "Failed to fetch feed");
    }

    return data.items || [];
  };

  const fetchCurrentAffairs = async () => {
    try {
      setLoading(true);
      setError("");

      const results = await Promise.all(feedList.map(fetchFeed));
      const merged = results.flat();

      const uniqueMap = new Map();

      merged.forEach((item, index) => {
        const key = `${item.link || ""}-${item.title || ""}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, {
            id: key || String(index),
            title: item.title || "Untitled",
            source: item.author || "News Source",
            date: item.pubDate || new Date().toISOString(),
            description:
              item.description
                ?.replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim() || "No description available.",
            link: item.link || "#",
            thumbnail: item.thumbnail || ""
          });
        }
      });

      const cleaned = Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setArticles(cleaned);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err.message || "Unable to load current affairs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentAffairs();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [language]);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((item) =>
        [item.title, item.source, item.description]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter((item) => {
        const text = [item.title, item.description, item.source]
          .join(" ")
          .toLowerCase();

        if (category === "education") {
          return /education|exam|student|school|college|syllabus|university|परीक्षा|शिक्षा|छात्र/.test(
            text
          );
        }

        if (category === "world") {
          return /world|global|international|summit|country|foreign|अंतरराष्ट्रीय|वैश्विक/.test(
            text
          );
        }

        if (category === "india") {
          return /india|indian|delhi|bihar|government|parliament|भारत|भारतीय|सरकार|दिल्ली/.test(
            text
          );
        }

        if (category === "economy") {
          return /economy|bank|finance|market|inflation|gdp|budget|stock|अर्थव्यवस्था|बजट|बैंक/.test(
            text
          );
        }

        if (category === "science") {
          return /science|tech|technology|space|ai|research|nasa|isro|विज्ञान|तकनीक|अंतरिक्ष/.test(
            text
          );
        }

        return true;
      });
    }

    return result;
  }, [articles, search, category]);

  const topHeadline = filteredArticles[0] || null;
  const restArticles = filteredArticles.slice(1);

  const handleAddResource = () => {
    if (!resourceTitle.trim() || !resourceLink.trim()) {
      alert("Resource title and link required ❌");
      return;
    }

    const entered = window.prompt("Enter admin password");
    if (entered !== ADMIN_PASSWORD) {
      alert("Wrong admin password ❌");
      return;
    }

    const newResource = {
      id: Date.now(),
      title: resourceTitle.trim(),
      link: resourceLink.trim(),
      description: resourceDesc.trim(),
      image: resourceImage.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newResource, ...resources];
    persistResources(updated);

    setResourceTitle("");
    setResourceLink("");
    setResourceDesc("");
    setResourceImage("");

    alert("Admin resource added ✅");
  };

  const handleDeleteResource = (resourceId) => {
    const entered = window.prompt("Enter admin password to delete resource");
    if (entered !== ADMIN_PASSWORD) {
      alert("Wrong admin password ❌");
      return;
    }

    const ok = window.confirm("Delete this admin resource?");
    if (!ok) return;

    const updated = resources.filter((item) => item.id !== resourceId);
    persistResources(updated);
    alert("Resource deleted ✅");
  };

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <Helmet>
              <title>Current Affairs - Knowmads</title>
              <meta
                name="description"
                content="Stay updated with the latest current affairs, daily headlines, and important news curated for students. Explore resources and articles to enhance your general knowledge."
              />
            </Helmet>
            <h1 className="subjects-title">Current Affairs</h1>
            <div className="ca-live-inline">
              <span className="ca-live-dot"></span>
              <span className="ca-live-text">
                {language === "en" ? "Live Updates" : "लाइव अपडेट्स"}
              </span>
            </div>
            <p className="muted">
              Daily headlines, article links and admin-curated resources
            </p>
          </div>
        </div>

        <div className="card big-card">
          <div className="ca-toolbar">
            <div className="ca-language-toggle">
              <button
                type="button"
                className={language === "en" ? "filter-btn active-filter-btn" : "filter-btn"}
                onClick={() => setLanguage("en")}
              >
                English
              </button>

              <button
                type="button"
                className={language === "hi" ? "filter-btn active-filter-btn" : "filter-btn"}
                onClick={() => setLanguage("hi")}
              >
                हिन्दी
              </button>
            </div>

            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Search current affairs..."
                  : "करेंट अफेयर्स खोजें..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ca-search-input"
            />
          </div>

          <div className="ca-category-row">
            <button
              type="button"
              className={category === "all" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("all")}
            >
              All
            </button>

            <button
              type="button"
              className={category === "education" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("education")}
            >
              Education
            </button>

            <button
              type="button"
              className={category === "india" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("india")}
            >
              India
            </button>

            <button
              type="button"
              className={category === "world" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("world")}
            >
              World
            </button>

            <button
              type="button"
              className={category === "economy" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("economy")}
            >
              Economy
            </button>

            <button
              type="button"
              className={category === "science" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setCategory("science")}
            >
              Science
            </button>
          </div>

          <div className="ca-status-row">
            <span className="ca-live-badge">
              <span className="ca-live-dot small"></span>
              {loading
                ? language === "en"
                  ? "Refreshing..."
                  : "रिफ्रेश हो रहा है..."
                : language === "en"
                ? "Live"
                : "लाइव"}
            </span>

            {lastUpdated ? (
              <span className="muted">
                {language === "en" ? "Last updated:" : "आखिरी अपडेट:"} {lastUpdated}
              </span>
            ) : null}
          </div>

          {error ? <p className="notes-error-text">{error}</p> : null}
        </div>

        <div className="ca-main-layout">
          <div className="ca-main-column">
            {resources.length > 0 && (
              <div className="card big-card ca-admin-highlight-card">
                <div className="ca-admin-highlight-head">
                  <div>
                    <h3>Updated by Admin</h3>
                    <p className="muted">
                      {language === "en"
                        ? "Important handpicked resources from admin"
                        : "एडमिन द्वारा चुने गए महत्वपूर्ण रिसोर्स"}
                    </p>
                  </div>

                  <span className="ca-live-badge">
                    <span className="ca-live-dot small"></span>
                    Live
                  </span>
                </div>

                <div className="ca-admin-top-row">
                  {resources.slice(0, 3).map((item) => (
                    <div key={item.id} className="card ca-admin-top-card">
                      <div className="ca-resource-head">
                        <span className="task-badge completed-badge">Admin</span>

                        <button
                          type="button"
                          className="task-delete-btn"
                          onClick={() => handleDeleteResource(item.id)}
                          title="Delete Resource"
                        >
                          🗑
                        </button>
                      </div>

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="ca-resource-image"
                        />
                      ) : null}

                      <h3>{item.title}</h3>

                      {item.description ? (
                        <p className="muted">{item.description}</p>
                      ) : null}

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="notes-link-btn"
                      >
                        {language === "en" ? "Open Resource" : "रिसोर्स खोलें"}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topHeadline && (
              <div className="card big-card ca-hero-card">
                <div className="ca-hero-grid">
                  <div>
                    <span className="task-badge pending-badge">
                      {language === "en" ? "Top Headline" : "मुख्य खबर"}
                    </span>
                    <h2 className="ca-hero-title">{topHeadline.title}</h2>
                    <p className="muted">{topHeadline.description}</p>

                    <div className="ca-card-top">
                      <span className="task-badge completed-badge">{topHeadline.source}</span>
                      <span className="muted">
                        {new Date(topHeadline.date).toLocaleDateString()}
                      </span>
                    </div>

                    <a
                      href={topHeadline.link}
                      target="_blank"
                      rel="noreferrer"
                      className="notes-link-btn"
                    >
                      {language === "en" ? "Read Full Article" : "पूरा लेख पढ़ें"}
                    </a>
                  </div>

                  {topHeadline.thumbnail ? (
                    <img
                      src={topHeadline.thumbnail}
                      alt={topHeadline.title}
                      className="ca-hero-image"
                    />
                  ) : null}
                </div>
              </div>
            )}

            <div className="ca-grid">
              {loading && restArticles.length === 0 ? (
                <div className="card">
                  <p className="muted">
                    {language === "en"
                      ? "Loading current affairs..."
                      : "करेंट अफेयर्स लोड हो रहा है..."}
                  </p>
                </div>
              ) : restArticles.length === 0 ? (
                <div className="card">
                  <p className="muted">
                    {language === "en"
                      ? "No current affairs found."
                      : "कोई करेंट अफेयर्स नहीं मिला।"}
                  </p>
                </div>
              ) : (
                restArticles.map((item) => (
                  <div key={item.id} className="card ca-card">
                    <div className="ca-card-top">
                      <span className="task-badge pending-badge">{item.source}</span>
                      <span className="muted">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>

                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="ca-card-image"
                      />
                    ) : null}

                    <h3>{item.title}</h3>
                    <p className="muted">{item.description}</p>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="notes-link-btn"
                    >
                      {language === "en" ? "Read Full Article" : "पूरा लेख पढ़ें"}
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="ca-side-column">
            <div className="card ca-admin-panel compact-admin-panel">
              <h3>Admin Add Resource</h3>
              <p className="muted">
                Add useful custom resources for students.
              </p>

              <input
                type="text"
                placeholder="Resource title"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
              />

              <input
                type="url"
                placeholder="Resource link"
                value={resourceLink}
                onChange={(e) => setResourceLink(e.target.value)}
              />

              <input
                type="url"
                placeholder="Optional image URL"
                value={resourceImage}
                onChange={(e) => setResourceImage(e.target.value)}
              />

              <textarea
                className="notes-textarea ca-admin-textarea"
                placeholder="Short description (optional)"
                value={resourceDesc}
                onChange={(e) => setResourceDesc(e.target.value)}
              />

              <button type="button" className="primary" onClick={handleAddResource}>
                Add Resource
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}