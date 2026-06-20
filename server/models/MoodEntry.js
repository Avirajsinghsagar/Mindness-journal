const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    energy: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoodEntry", moodSchema);