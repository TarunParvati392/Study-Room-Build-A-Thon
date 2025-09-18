const express = require("express");
const Room = require("../models/room");
const router = express.Router();

// Create new room
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const code = Math.random().toString(36).substring(2, 8); // random roomId
    const newRoom = new Room({ name, code });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: "Error creating room" });
  }
});

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
});

// Get room by code
router.get("/:code", async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Error fetching room" });
  }
});

module.exports = router;
