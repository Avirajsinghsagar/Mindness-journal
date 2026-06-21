import { useEffect, useState } from "react";
import API from "../api/axios";

const EMOTION_CONFIG = {
  joy:      { emoji: "😊", color: "#4CAF50", label: "Joyful" },
  sadness:  { emoji: "😢", color: "#2196F3", label: "Sad" },
  anger:    { emoji: "😠", color: "#f44336", label: "Angry" },
  fear:     { emoji: "😨", color: "#9C27B0", label: "Fearful" },
  surprise: { emoji: "😮", color: "#FF9800", label: "Surprised" },
  disgust:  { emoji: "🤢", color: "#795548", label: "Disgusted" },
  neutral:  { emoji: "😐", color: "#9E9E9E", label: "Neutral" },
};

function SentimentBadge({ sentiment }) {
  if (!sentiment) return null;
  const emotion = sentiment.dominant_emotion || "neutral";
  const config = EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;
  const score = Number(sentiment.sentiment_score) || 5.0;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: config.color + "22", border: `1px solid ${config.color}`,
      borderRadius: "20px", padding: "4px 12px", marginTop: "8px",
      fontSize: "13px", flexShrink: 0
    }}>
      <span style={{ fontSize: "16px" }}>{config.emoji}</span>
      <span style={{ color: config.color, fontWeight: "600" }}>{config.label}</span>
      <span style={{ color: "#666", fontSize: "11px" }}>{score.toFixed(1)}/10</span>
      <span style={{
        background: sentiment.sentiment === "POSITIVE" ? "#4CAF5033" : "#f4433633",
        color: sentiment.sentiment === "POSITIVE" ? "#4CAF50" : "#f44336",
        borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: "600"
      }}>
        {sentiment.sentiment === "POSITIVE" ? "↑ Positive" : "↓ Negative"}
      </span>
    </div>
  );
}

function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSentiment, setLastSentiment] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const prompts = [
    "What made you smile today?",
    "What are you grateful for today?",
    "What challenged you today?",
    "What did you learn today?",
    "How are you feeling right now?",
    "What are you looking forward to tomorrow?",
    "Describe one thing that brought you peace today.",
  ];

  const fetchEntries = async () => {
    try {
      const res = await API.get("/journal");
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLastSentiment(null);
    setSuccessMsg("");
    try {
      const res = await API.post("/journal", { title, content });
      console.log("API response:", JSON.stringify(res.data));
      const s = res.data.sentiment;
      if (s && s.dominant_emotion && s.dominant_emotion !== "neutral") {
        setLastSentiment(s);
        setSuccessMsg("Entry saved! Here's what AI detected:");
      } else if (s && s.dominant_emotion === "neutral") {
        setLastSentiment(s);
        setSuccessMsg("Entry saved! AI detected:");
      } else {
        setSuccessMsg("Entry saved! ✅");
        setLastSentiment(null);
      }
      setTitle("");
      setContent("");
      fetchEntries();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const res = await API.get("/journal/export");
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mindwell-journal.json";
      a.click();
    } catch (err) { console.error(err); }
  };

  const refreshPrompt = () => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>MindWell Journal</h2>

      <div style={{
        background: "#f0f4ff", padding: "12px 16px", marginBottom: "20px",
        borderRadius: "8px", display: "flex", justifyContent: "space-between",
        alignItems: "center", borderLeft: "4px solid #4a90e2"
      }}>
        <span><b>Daily Prompt:</b> {prompt}</span>
        <button onClick={refreshPrompt} style={{
          background: "none", border: "1px solid #4a90e2", borderRadius: "6px",
          padding: "4px 10px", cursor: "pointer", color: "#4a90e2", fontSize: "12px"
        }}>New Prompt</button>
      </div>

      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Title" value={title}
          onChange={(e) => setTitle(e.target.value)} required
          style={{ width: "100%", padding: "10px", borderRadius: "6px",
            border: "1px solid #ccc", fontSize: "15px", boxSizing: "border-box" }}
        />
        <br /><br />
        <textarea placeholder="Write your thoughts..." value={content}
          onChange={(e) => setContent(e.target.value)} required rows={5}
          style={{ width: "100%", padding: "10px", borderRadius: "6px",
            border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
        />
        <br /><br />
        <button type="submit" disabled={loading} style={{
          background: loading ? "#aaa" : "#4a90e2", color: "white", border: "none",
          borderRadius: "6px", padding: "10px 24px", fontSize: "15px",
          cursor: loading ? "not-allowed" : "pointer"
        }}>
          {loading ? "🧠 Analyzing..." : "Save Entry"}
        </button>
      </form>

      {successMsg && (
        <div style={{
          background: "#f9fff9", border: "1px solid #c3e6cb",
          borderRadius: "8px", padding: "14px 18px", marginTop: "16px"
        }}>
          <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#2d6a2d" }}>
            ✅ {successMsg}
          </p>
          {lastSentiment && (
            <>
              <SentimentBadge sentiment={lastSentiment} />
              <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#888" }}>
                🤖 DistilBERT NLP • Confidence: {((lastSentiment.confidence || 0) * 100).toFixed(1)}%
              </p>
            </>
          )}
        </div>
      )}

      <br />
      <button onClick={exportData} style={{
        background: "white", border: "1px solid #ccc", borderRadius: "6px",
        padding: "8px 18px", cursor: "pointer", fontSize: "14px"
      }}>
        📥 Download My Journal Data
      </button>

      <hr style={{ margin: "24px 0" }} />
      <h3>Your Entries</h3>

      {entries.length === 0 && (
        <p style={{ color: "#888" }}>No entries yet. Write your first journal entry above!</p>
      )}

      {entries.map((entry) => (
        <div key={entry._id} style={{
          border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px",
          marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
            <h4 style={{ margin: "0 0 8px 0" }}>{entry.title}</h4>
            {entry.sentiment && <SentimentBadge sentiment={entry.sentiment} />}
          </div>
          <p style={{ color: "#444", lineHeight: "1.6", margin: "8px 0" }}>
            {typeof entry.content === "string" ? entry.content : ""}
          </p>
          <small style={{ color: "#999" }}>
            🕒 {new Date(entry.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default Journal;