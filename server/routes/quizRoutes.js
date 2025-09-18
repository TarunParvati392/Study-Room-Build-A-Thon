const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

// Create a new quiz
router.post("/", async (req, res) => {
  try {
    const { roomCode, title, questions } = req.body;
    const newQuiz = new Quiz({ roomCode, title, questions });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).json({ error: "Error creating quiz" });
  }
});

// Get quizzes for a room
router.get("/:roomCode", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ roomCode: req.params.roomCode });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching quizzes" });
  }
});

module.exports = router;
