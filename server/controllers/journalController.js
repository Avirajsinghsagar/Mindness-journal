const JournalEntry = require("../models/JournalEntry");
const { encrypt, decrypt } = require("../utils/encryption");
const axios = require("axios");

const ML_SERVICE_URL = "http://127.0.0.1:8000";

async function analyzeSentiment(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/analyze-sentiment`, { text });
    return response.data;
  } catch (err) {
    console.log("ML error:", err.message);
    return { dominant_emotion: "neutral", sentiment: "NEUTRAL", sentiment_score: 5.0, confidence: 0.0 };
  }
}

exports.createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;
    const encryptedContent = encrypt(content);
    const sentimentResult = await analyzeSentiment(content);

    const entry = await JournalEntry.create({
      user: req.user._id,
      title,
      content: encryptedContent,
      sentiment: {
        dominant_emotion: sentimentResult.dominant_emotion || "neutral",
        sentiment: sentimentResult.sentiment || "NEUTRAL",
        sentiment_score: sentimentResult.sentiment_score || 5.0,
        confidence: sentimentResult.confidence || 0.0,
      },
    });

    const sentimentData = {
      dominant_emotion: sentimentResult.dominant_emotion || "neutral",
      sentiment: sentimentResult.sentiment || "NEUTRAL",
      sentiment_score: sentimentResult.sentiment_score || 5.0,
      confidence: sentimentResult.confidence || 0.0,
    };

    console.log("Sending response with sentiment:", JSON.stringify(sentimentData));

    res.status(201).json({
      _id: entry._id,
      user: entry.user,
      title: entry.title,
      content: content,
      sentiment: sentimentData,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    const decryptedEntries = entries.map((entry) => ({
      _id: entry._id,
      title: entry.title,
      content: decrypt(entry.content),
      sentiment: entry.sentiment,
      createdAt: entry.createdAt,
    }));
    res.json(decryptedEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportJournal = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id });
    const decryptedEntries = entries.map((entry) => ({
      title: entry.title,
      content: decrypt(entry.content),
      sentiment: entry.sentiment,
      createdAt: entry.createdAt,
    }));
    res.json({
      exportedAt: new Date(),
      totalEntries: decryptedEntries.length,
      entries: decryptedEntries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};