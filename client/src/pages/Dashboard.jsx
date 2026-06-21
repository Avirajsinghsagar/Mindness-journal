import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale, PointElement, Tooltip
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import API from "../api/axios";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const ML_SERVICE = "http://127.0.0.1:8000";

function StatCard({ emoji, label, value, color, sub }) {
  return (
    <div style={{
      background: "white", borderRadius: "16px", padding: "20px 24px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}`,
      minWidth: "160px", flex: 1
    }}>
      <div style={{ fontSize: "28px", marginBottom: "6px" }}>{emoji}</div>
      <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: "700", color }}>{value}</div>
      {sub && <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

function Dashboard() {
  const [moods, setMoods] = useState([]);
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [saving, setSaving] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [savedMsg, setSavedMsg] = useState("");

  const fetchMoods = async () => {
    try {
      const res = await API.get("/mood");
      const data = res.data;
      setMoods(data);
      if (data.length >= 3) runMLAnalysis(data);
    } catch (err) { console.error(err); }
  };

  const runMLAnalysis = async (data) => {
    const moodScores = data.map(m => m.mood).reverse();
    const energyScores = data.map(m => m.energy || 5).reverse();
    try {
      const [predRes, anomRes] = await Promise.all([
        fetch(`${ML_SERVICE}/predict-mood`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood_scores: moodScores, energy_scores: energyScores })
        }),
        fetch(`${ML_SERVICE}/detect-anomaly`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood_scores: moodScores })
        })
      ]);
      setPrediction(await predRes.json());
      setAnomaly(await anomRes.json());
    } catch (err) { console.log("ML not available"); }
  };

  useEffect(() => { fetchMoods(); }, []);

  const submitMood = async () => {
    setSaving(true);
    try {
      await API.post("/mood", { mood, energy });
      setSavedMsg("Mood logged! ✅");
      setTimeout(() => setSavedMsg(""), 3000);
      fetchMoods();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const avgMood = moods.length ? (moods.reduce((s, m) => s + m.mood, 0) / moods.length).toFixed(1) : "—";
  const latest = moods[0]?.mood || "—";
  const trendColor = prediction?.trend === "improving" ? "#4CAF50" : prediction?.trend === "declining" ? "#f44336" : "#FF9800";

  const chartData = {
    labels: [...moods].reverse().map(m => new Date(m.createdAt).toLocaleDateString()),
    datasets: [{
      label: "Mood", data: [...moods].reverse().map(m => m.mood),
      borderColor: "#4a90e2", backgroundColor: "rgba(74,144,226,0.08)",
      tension: 0.4, fill: true, pointBackgroundColor: "#4a90e2", pointRadius: 4,
    }, {
      label: "Energy", data: [...moods].reverse().map(m => m.energy || 0),
      borderColor: "#9b59b6", backgroundColor: "rgba(155,89,182,0.05)",
      tension: 0.4, fill: false, pointBackgroundColor: "#9b59b6", pointRadius: 3, borderDash: [4, 4],
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: {
      y: { min: 1, max: 10, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto", background: "#f7f9fc", minHeight: "100vh" }}>
      <h2 style={{ color: "#2d3748", marginBottom: "6px" }}>📊 Wellness Dashboard</h2>
      <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>Track your mood patterns and emotional wellbeing</p>

      {anomaly?.alert && (
        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>⚠️</span>
          <div>
            <div style={{ fontWeight: "600", color: "#856404" }}>Wellness Alert</div>
            <div style={{ fontSize: "13px", color: "#856404" }}>{anomaly.message}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <StatCard emoji="😊" label="Latest Mood" value={latest} color="#4a90e2" sub="out of 10" />
        <StatCard emoji="📈" label="Average Mood" value={avgMood} color="#4CAF50" sub={`${moods.length} entries`} />
        {prediction && <StatCard emoji="🔮" label="Tomorrow's Mood" value={prediction.predicted_mood} color={trendColor} sub={`Trend: ${prediction.trend} • ${prediction.confidence} confidence`} />}
        {anomaly && !anomaly.alert && <StatCard emoji="✅" label="Pattern" value="Normal" color="#4CAF50" sub={anomaly.message} />}
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#2d3748" }}>📝 Log Today's Mood</h3>
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "8px" }}>😊 Mood: <b style={{ color: "#4a90e2" }}>{mood}/10</b></label>
            <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(Number(e.target.value))} style={{ width: "180px", accentColor: "#4a90e2" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "8px" }}>⚡ Energy: <b style={{ color: "#9b59b6" }}>{energy}/10</b></label>
            <input type="range" min="1" max="10" value={energy} onChange={(e) => setEnergy(Number(e.target.value))} style={{ width: "180px", accentColor: "#9b59b6" }} />
          </div>
          <button onClick={submitMood} disabled={saving} style={{ background: "linear-gradient(135deg, #4a90e2, #7b68ee)", color: "white", border: "none", borderRadius: "10px", padding: "10px 24px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            {saving ? "Saving..." : "Log Mood"}
          </button>
          {savedMsg && <span style={{ color: "#4CAF50", fontSize: "14px" }}>{savedMsg}</span>}
        </div>
      </div>

      {moods.length > 0 ? (
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#2d3748" }}>📉 Mood & Energy Over Time</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", padding: "40px", textAlign: "center", color: "#aaa", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
          <p>No mood data yet. Log your first mood above!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;