# 🧠 MindWell – AI-Powered Mental Wellness Journal

MindWell is a **full-stack mental wellness application** with **Machine Learning integration** that allows users to securely write journal entries, track moods, and get real-time AI-powered emotional insights.

---

## 🚀 Key Features

### 🔐 Secure Authentication
- JWT-based login/register
- AES-encrypted journal entries (even DB admins can't read them)
- bcrypt password hashing

### 🤖 ML/AI Integration (Python Microservice)
- **DistilBERT NLP sentiment analysis** on every journal entry
- Detects emotions: Joy, Sadness, Anger, Fear, Surprise, Disgust
- **scikit-learn mood prediction** — predicts tomorrow's mood from history
- **Isolation Forest anomaly detection** — alerts when mood pattern is unusual

### 📝 Smart Journaling
- AI-generated daily prompts
- Real-time emotion badge after saving entry
- Confidence score from NLP model
- AES encrypted storage in MongoDB

### 📊 Wellness Dashboard
- Mood + Energy dual-line chart (Chart.js)
- Stat cards: Latest mood, Average mood, AI-predicted mood
- Wellness alert banner for anomaly detection
- Mood logger with sliders

### 🌬️ Breathing Exercise
- 4-7-8 breathing technique
- Animated breathing guide

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Chart.js, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| ML Service | Python, FastAPI, HuggingFace Transformers |
| ML Models | DistilBERT, scikit-learn, Isolation Forest |
| Security | JWT, AES Encryption, bcrypt |

---

## 📂 Project Structure

```
MindWell/
├── client/                 # React frontend
│   └── src/
│       ├── pages/          # Dashboard, Journal, Login, Register, Breathing
│       ├── components/     # Navbar, ProtectedRoute
│       └── api/            # Axios config
│
├── server/                 # Node.js backend
│   ├── controllers/        # journalController, moodController
│   ├── models/             # JournalEntry, MoodEntry, User
│   ├── routes/             # auth, journal, mood routes
│   └── utils/              # AES encryption
│
└── ml-service/             # Python FastAPI ML microservice
    └── main.py             # 3 endpoints: sentiment, prediction, anomaly
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Avirajsinghsagar/Mindness-journal.git
cd Mindness-journal
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

```bash
node server.js
```

### 3. ML Service Setup
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate       # Windows
pip install fastapi uvicorn transformers torch scikit-learn pandas numpy
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd client
npm install
npm start
```

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user

### Journal
- `POST /api/journal` — Create entry (triggers ML sentiment analysis)
- `GET /api/journal` — Get all entries (decrypted)
- `GET /api/journal/export` — Export journal as JSON

### Mood
- `POST /api/mood` — Log mood + energy
- `GET /api/mood` — Get mood history

### ML Service (Port 8000)
- `POST /analyze-sentiment` — DistilBERT emotion detection
- `POST /predict-mood` — scikit-learn mood prediction
- `POST /detect-anomaly` — Isolation Forest anomaly detection

---

## 🤖 ML Pipeline

```
User writes journal entry
        ↓
Node.js backend receives text
        ↓
Calls Python FastAPI ML service
        ↓
DistilBERT analyzes emotion (Joy/Sadness/Anger etc.)
        ↓
Returns emotion + confidence score
        ↓
Stored in MongoDB alongside encrypted entry
        ↓
Displayed as emotion badge in UI
```

---

## 👨‍💻 Author

**Aviraj Singh Sagar**
Full Stack Developer Intern

---

## ⭐ Resume Highlights

- Integrated **DistilBERT NLP** model via Python FastAPI microservice for real-time sentiment analysis
- Built **mood prediction** using scikit-learn GradientBoosting on user's mood history
- Implemented **Isolation Forest anomaly detection** for wellness alerts
- **AES encryption at rest** — journal entries encrypted before MongoDB storage
- Full-stack: React + Node.js + Python ML microservice architecture