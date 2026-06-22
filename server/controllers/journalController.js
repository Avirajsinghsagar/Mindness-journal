const JournalEntry = require("../models/JournalEntry");
const { encrypt, decrypt } = require("../utils/encryption");
const axios = require("axios");

const ML_SERVICE_URL = "http://127.0.0.1:8000";

async function analyzeSentiment(text) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/analyze-sentiment`, { text });
    return response.data;
  } catch (err) {
    // Fallback: rule-based sentiment
    const positiveWords = ["happy", "joy", "great", "amazing", "wonderful", "good", "excellent", "love", "lucky", "excited", "fantastic", "blessed", "grateful", "successful"];
    const negativeWords = ["sad", "bad", "terrible", "awful", "hate", "angry", "frustrated", "depressed", "anxious", "worried", "upset"];
    
    const lowerText = text.toLowerCase();
    const posCount = positiveWords.filter(w => lowerText.includes(w)).length;
    const negCount = negativeWords.filter(w => lowerText.includes(w)).length;
    
    if (posCount > negCount) {
      return { dominant_emotion: "joy", sentiment: "POSITIVE", sentiment_score: 7.0 + posCount, confidence: 0.75 };
    } else if (negCount > posCount) {
      return { dominant_emotion: "sadness", sentiment: "NEGATIVE", sentiment_score: 3.0 - negCount, confidence: 0.75 };
    }
    return { dominant_emotion: "neutral", sentiment: "NEUTRAL", sentiment_score: 5.0, confidence: 0.0 };
  }
}

exports.createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("📝 Creating entry, content:", content.substring(0, 30));
    const encryptedContent = encrypt(content);
    const sentimentResult = await analyzeSentiment(content);
    console.log("💾 Saving with sentiment:", JSON.stringify(sentimentResult));

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

    res.status(201).json({
      ...entry.toObject(),
      content: content,
      sentiment: entry.sentiment,
    });
  } catch (error) {
    console.log("💥 createEntry error:", error.message);
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