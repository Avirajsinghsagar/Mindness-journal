const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createMood,
  getMoods
} = require("../controllers/moodController");


router.post("/", protect, createMood);
router.get("/", protect, getMoods);

module.exports = router;