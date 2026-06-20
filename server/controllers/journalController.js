const JournalEntry = require("../models/JournalEntry");
const { encrypt, decrypt } = require("../utils/encryption");

/* =========================
   CREATE JOURNAL ENTRY
========================= */

exports.createEntry = async (req, res) => {
  try {

    const { title, content } = req.body;

    const encryptedContent = encrypt(content);

    const entry = await JournalEntry.create({
      user: req.user._id,
      title,
      content: encryptedContent
    });

    res.status(201).json(entry);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   GET JOURNAL ENTRIES
========================= */

exports.getEntries = async (req, res) => {
  try {

    const entries = await JournalEntry.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    const decryptedEntries = entries.map(entry => ({
      _id: entry._id,
      title: entry.title,
      content: decrypt(entry.content),
      createdAt: entry.createdAt
    }));

    res.json(decryptedEntries);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   EXPORT JOURNAL DATA
========================= */

exports.exportJournal = async (req, res) => {
  try {

    const entries = await JournalEntry.find({
      user: req.user._id
    });

    const decryptedEntries = entries.map(entry => ({
      title: entry.title,
      content: decrypt(entry.content),
      createdAt: entry.createdAt
    }));

    res.json({
      exportedAt: new Date(),
      totalEntries: decryptedEntries.length,
      entries: decryptedEntries
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};