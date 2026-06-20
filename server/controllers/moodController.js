const MoodEntry = require("../models/MoodEntry");

/* ===============================
   CREATE MOOD ENTRY
================================ */

exports.createMood = async (req, res) => {
  try {

    const { mood, energy } = req.body;

    const entry = await MoodEntry.create({
      user: req.user._id,
      mood,
      energy
    });

    res.status(201).json(entry);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   GET MOOD HISTORY
================================ */

exports.getMoods = async (req, res) => {
  try {

    const moods = await MoodEntry.find({
      user: req.user._id
    }).sort({ date: -1 });

    res.json(moods);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};