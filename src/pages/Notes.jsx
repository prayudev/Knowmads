import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";

const ADMIN_PASSWORD = "Prisensei@2505";
const CLOUD_NAME = "dvthsktx0";
const UPLOAD_PRESET = "l8vquohu";
const STORAGE_KEY = "studyhub_notes_v2";

export default function Notes() {
  const [activeTab, setActiveTab] = useState("admin"); // default admin
  const [notes, setNotes] = useState([]);

  const [noteType, setNoteType] = useState("text"); // text | file | link | youtube
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | title
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setNotes(saved);
  }, []);

  const persistNotes = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  const resetComposer = () => {
    setTitle("");
    setDescription("");
    setTextContent("");
    setLinkUrl("");
    setYoutubeUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setNoteType("text");
  };

  const isYouTubeLink = (url) => /youtube\.com|youtu\.be/.test(url || "");

  const getFileCategory = (file) => {
    if (!file) return null;
    if (file.type.startsWith("image/")) return "image";
    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      return "pdf";
    }
    return null;
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxMb = activeTab === "admin" ? 50 : 10;
    const maxBytes = maxMb * 1024 * 1024;

    if (file.size > maxBytes) {
      alert(`${activeTab === "admin" ? "Admin" : "Public"} file limit is ${maxMb} MB ❌`);
      e.target.value = "";
      return;
    }

    const category = getFileCategory(file);
    if (!category) {
      alert("Only PDF or image files are allowed ❌");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const uploadToCloudinary = async (file, role) => {
    // auto => Cloudinary auto-detects asset type
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", `studyhub/${role}`);

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Upload failed");
    }

    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
      resourceType: data.resource_type,
      format: data.format
    };
  };

  const createNoteRecord = async (role) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      alert("Title required ❌");
      return null;
    }

    const baseNote = {
      id: Date.now(),
      role, // public | admin
      title: trimmedTitle,
      description: trimmedDescription,
      createdAt: new Date().toISOString()
    };

    if (noteType === "text") {
      if (!textContent.trim()) {
        alert("Write your note first ❌");
        return null;
      }

      return {
        ...baseNote,
        type: "text",
        content: textContent.trim()
      };
    }

    if (noteType === "link") {
      if (!linkUrl.trim()) {
        alert("Link required ❌");
        return null;
      }

      return {
        ...baseNote,
        type: "link",
        url: linkUrl.trim()
      };
    }

    if (noteType === "youtube") {
      if (!youtubeUrl.trim()) {
        alert("YouTube link required ❌");
        return null;
      }

      if (!isYouTubeLink(youtubeUrl.trim())) {
        alert("Enter a valid YouTube link ❌");
        return null;
      }

      return {
        ...baseNote,
        type: "youtube",
        url: youtubeUrl.trim()
      };
    }

    if (noteType === "file") {
      if (!selectedFile) {
        alert("Choose a file first ❌");
        return null;
      }

      const uploaded = await uploadToCloudinary(selectedFile, role);
      const category = getFileCategory(selectedFile);

      return {
        ...baseNote,
        type: category, // image | pdf
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        format: uploaded.format
      };
    }

    return null;
  };

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);

      const role = activeTab;

      if (role === "admin") {
        const entered = window.prompt("Enter admin password");
        if (entered !== ADMIN_PASSWORD) {
          alert("Wrong admin password ❌");
          setIsSubmitting(false);
          return;
        }
      }

      const newNote = await createNoteRecord(role);
      if (!newNote) {
        setIsSubmitting(false);
        return;
      }

      const updated = [newNote, ...notes];
      persistNotes(updated);
      resetComposer();
      alert(`${role === "admin" ? "Admin" : "Public"} note published ✅`);
    } catch (error) {
      alert(error.message || "Upload failed ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredByRole = useMemo(() => {
    return notes.filter((item) => item.role === activeTab);
  }, [notes, activeTab]);

  const searchedNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredByRole;

    return filteredByRole.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        item.content,
        item.fileName,
        item.url
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [filteredByRole, searchQuery]);

  const visibleNotes = useMemo(() => {
    const arr = [...searchedNotes];

    if (sortBy === "oldest") {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "title") {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return arr;
  }, [searchedNotes, sortBy]);

  const groupedNotes = useMemo(() => {
    const base = {
      pdf: [],
      image: [],
      text: [],
      link: [],
      youtube: []
    };

    visibleNotes.forEach((item) => {
      if (base[item.type]) base[item.type].push(item);
    });

    return base;
  }, [visibleNotes]);

  const handleDeleteNote = (id) => {
    const ok = window.confirm("Delete this note?");
    if (!ok) return;
    const updated = notes.filter((item) => item.id !== id);
    persistNotes(updated);
  };

  const renderCard = (item) => {
    return (
      <div key={item.id} className="card notes-feed-card">
        <div className="notes-feed-top">
          <div>
            <h3>{item.title}</h3>
            {item.description ? <p className="muted">{item.description}</p> : null}
          </div>

          <div className="notes-card-actions">
            <span
              className={`task-badge ${
                item.role === "admin" ? "completed-badge" : "pending-badge"
              }`}
            >
              {item.role === "admin" ? "Admin" : "Public"}
            </span>

            <button
              type="button"
              className="task-delete-btn"
              onClick={() => handleDeleteNote(item.id)}
              title="Delete Note"
            >
              🗑
            </button>
          </div>
        </div>

        {item.type === "text" && (
          <div className="notes-text-box">
            <p>{item.content}</p>
          </div>
        )}

        {item.type === "pdf" && (
          <div className="notes-file-box">
            <p className="muted">{item.fileName || "PDF file"}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="notes-link-btn"
            >
              Open PDF
            </a>
          </div>
        )}

        {item.type === "image" && (
          <div className="notes-image-box">
            <img src={item.url} alt={item.title} className="notes-preview-image" />
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="notes-link-btn"
            >
              Open Image
            </a>
          </div>
        )}

        {item.type === "link" && (
          <div className="notes-file-box">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="notes-link-btn"
            >
              Open Link
            </a>
          </div>
        )}

        {item.type === "youtube" && (
          <div className="notes-file-box">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="notes-link-btn"
            >
              Watch Video
            </a>
          </div>
        )}

        <p className="muted notes-time-text">
          {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
    );
  };

  const renderSection = (titleText, items) => (
    <div className="card big-card">
      <h3>{titleText}</h3>
      {items.length === 0 ? (
        <p className="muted">No items here yet.</p>
      ) : (
        <div className="notes-row-scroll">
          {items.map(renderCard)}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">Shared Study Notes</h1>
            <h4 className="muted">
              Here, we will provide notes and study-related resources for you.
            </h4>
          </div>
        </div>

        <div className="notes-tab-row">
          <button
            type="button"
            className={activeTab === "admin" ? "filter-btn active-filter-btn" : "filter-btn"}
            onClick={() => setActiveTab("admin")}
          >
            Admin Notes
          </button>

          <button
            type="button"
            className={activeTab === "public" ? "filter-btn active-filter-btn" : "filter-btn"}
            onClick={() => setActiveTab("public")}
          >
            Public Notes
          </button>
        </div>

        <div className="card big-card">
          <h2>{activeTab === "admin" ? "Admin Composer" : "Public Composer"}</h2>
          <p className="muted">
            {activeTab === "admin"
              ? "Here, Notes and resources shared by Priya Study Diary."
              : "Upload notes, images, and PDFs to help each other."}
          </p>

          <div className="notes-limit-row">
            <span className="task-badge pending-badge">
              {activeTab === "admin" ? "Upload limit: 50 MB" : "Upload limit: 10 MB"}
            </span>
            <span className="task-badge completed-badge">Single upload area</span>
            <span className="task-badge pending-badge">Auto sorting by category</span>
          </div>

          <div className="notes-composer-grid">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Short description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="notes-type-row">
            <button
              type="button"
              className={noteType === "text" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setNoteType("text")}
            >
              Text Note
            </button>

            <button
              type="button"
              className={noteType === "file" ? "filter-btn active-filter-btn" : "filter-btn"}
              onClick={() => setNoteType("file")}
            >
              PDF / Image
            </button>

            {activeTab === "admin" && (
              <>
                <button
                  type="button"
                  className={noteType === "link" ? "filter-btn active-filter-btn" : "filter-btn"}
                  onClick={() => setNoteType("link")}
                >
                  Link
                </button>

                <button
                  type="button"
                  className={noteType === "youtube" ? "filter-btn active-filter-btn" : "filter-btn"}
                  onClick={() => setNoteType("youtube")}
                >
                  YouTube
                </button>
              </>
            )}
          </div>

          {noteType === "text" && (
            <textarea
              className="notes-textarea"
              placeholder="Write your note here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          )}

          {noteType === "file" && (
            <div className="notes-file-picker-box">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFilePick}
              />
              <p className="muted">
                Choose one PDF or image file.
              </p>
              {selectedFile ? (
                <p className="notes-selected-file">Selected: {selectedFile.name}</p>
              ) : null}
            </div>
          )}

          {activeTab === "admin" && noteType === "link" && (
            <input
              type="url"
              placeholder="Paste useful website/resource link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          )}

          {activeTab === "admin" && noteType === "youtube" && (
            <input
              type="url"
              placeholder="Paste YouTube video link"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          )}

          <div className="notes-action-row">
            <button type="button" onClick={resetComposer}>
              Clear
            </button>

            <button
              type="button"
              className="primary"
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Publish"}
            </button>
          </div>
        </div>

        <div className="card big-card">
          <div className="notes-toolbar">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {renderSection("PDF Files", groupedNotes.pdf)}
        {renderSection("Image Notes", groupedNotes.image)}
        {renderSection("Text Notes", groupedNotes.text)}

        {activeTab === "admin" && (
          <>
            {renderSection("Useful Links", groupedNotes.link)}
            {renderSection("YouTube Videos", groupedNotes.youtube)}
          </>
        )}
      </div>
    </>
  );
}