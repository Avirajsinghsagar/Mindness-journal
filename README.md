# 🧠 MindWell – Secure Mental Wellness Journal

MindWell is a **privacy-focused full-stack mental wellness application** that allows users to securely write personal journal entries, track moods, visualize emotional patterns, and practice guided breathing exercises.

The main goal of this project is to build a **secure digital journaling platform where user data privacy is the top priority**.

Journal entries are **encrypted before being stored in the database**, ensuring that even database administrators cannot read user content.

---

# 📌 Project Overview

In today's digital world, mental health applications are becoming essential. However, users are often hesitant to store personal thoughts online due to privacy concerns.

MindWell solves this problem by implementing **encryption-based journaling**, ensuring that personal reflections remain **completely secure and private**.

Users can:

* Write secure journal entries
* Track mood and energy levels
* Visualize mood trends
* Use a breathing assistant for relaxation
* Export personal data

---

# 🚀 Key Features

## 🔐 User Authentication

* User Registration
* User Login
* JWT Authentication
* Protected API routes

---

## 📝 Secure Journal Entries

Users can write journal entries that are **encrypted before storage**.

### Encryption Strategy

The system uses **AES encryption (crypto-js)** to secure journal content.

Example encrypted entry stored in MongoDB:

U2FsdGVkX1+8rKAr3HVHHDRnugeDErK1jty4Ly4K8jTnxZ0pMVw8bXNbQzufKnO2

This ensures **Encryption at Rest**, meaning raw database data cannot be read.

---

## 💡 Guided Journal Prompts

To help users begin writing, the system provides **random prompts** such as:

* What made you smile today?
* What are you grateful for today?
* What challenged you today?
* What did you learn today?

These prompts encourage self-reflection and mindfulness.

---

## 🙂 Mood Tracking

Users can log:

* Mood Level (1–10)
* Energy Level (1–10)

This allows users to reflect on emotional patterns over time.

---

## 📊 Mood Analytics Dashboard

Mood entries are visualized using **Chart.js** to display emotional trends.

Users can view:

* Mood over time
* Daily emotional progress

This helps users better understand their mental wellbeing.

---

## 🌬️ Breathing Exercise Tool

MindWell includes a **breathing assistant** that helps users relax.

Breathing pattern used:

Inhale – 4 seconds
Hold – 7 seconds
Exhale – 8 seconds

The UI provides a simple breathing animation to guide users.

---

## 🌙 Dark Mode

The application includes a **Dark Mode toggle** to provide a calming interface and reduce eye strain.

Users can switch between:

* Light Mode
* Dark Mode

---

## 📥 Data Export

Users can download their personal journal data.

Export format:

JSON File

Example file:

mindwell-journal.json

This ensures **data ownership and transparency**.

---

# 🛠 Tech Stack

## Frontend

* React.js
* Axios
* Chart.js
* CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Security

* JWT Authentication
* AES Encryption (crypto-js)
* Password Hashing (bcrypt)

---

# 📂 Project Structure

MindWell
│
├── client
│   ├── src
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Breathing.jsx
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │
│   │   ├── api
│   │   │   ├── axios.js
│
├── server
│   ├── models
│   │   ├── User.js
│   │   ├── JournalEntry.js
│   │   ├── MoodEntry.js
│   │
│   ├── controllers
│   │   ├── journalController.js
│   │   ├── moodController.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── journalRoutes.js
│   │   ├── moodRoutes.js
│   │
│   ├── utils
│   │   ├── encryption.js
│   │
│   ├── server.js
│
└── README.md

---

# ⚙️ Installation Guide

## Clone the Repository

git clone https://github.com/yourusername/mindwell-journal.git

---

## Install Backend

cd server
npm install

Run backend server:

node server.js

Backend runs on:

http://localhost:5000

---

## Install Frontend

cd client
npm install

Run frontend:

npm start

Frontend runs on:

http://localhost:3000

---

# 🔑 Environment Variables

Create `.env` inside the **server folder**.

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

ENCRYPTION_KEY=your_encryption_key

---

# 📊 Database Security Example

Raw data stored in MongoDB:

content: "U2FsdGVkX1+8rKAr3HVHHDRnugeDErK1jty4Ly4K8jTnxZ0pMVw8bXNbQzufKnO2"

This confirms that journal entries are **encrypted before storage**.

---

# 📅 Development Timeline

Week 1
Authentication, Encryption, Journal CRUD

Week 2
Mood Tracking and Analytics Dashboard

Week 3
Breathing Assistant and UI Improvements

Week 4
Data Export and Final Testing

---

# 📸 Screenshots

Add screenshots of:

* Login Page
* Journal Entry Page
* MongoDB Encrypted Data
* Mood Dashboard
* Breathing Exercise
* Exported JSON File

---

# 👨‍💻 Author

Aviraj Singh Sagar
Full Stack Developer Intern Project

---

# ⭐ Future Improvements

* Mobile responsive UI
* PDF export
* Weekly mood reports
* Premium analytics
