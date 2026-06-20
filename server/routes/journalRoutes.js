const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createEntry,
  getEntries,
  exportJournal
} = require("../controllers/journalController");

/* CREATE JOURNAL ENTRY */
router.post("/", protect, createEntry);

/* GET ALL JOURNAL ENTRIES */
router.get("/", protect, getEntries);

/* EXPORT JOURNAL DATA */
router.get("/export", protect, exportJournal);

module.exports = router;