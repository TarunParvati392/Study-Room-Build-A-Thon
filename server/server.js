const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Room = require("./models/room");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routes
app.get("/", (req, res) => res.send("Server running..."));

// HTTP + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Send previous messages to this user
    try {
      const room = await Room.findOne({ code: roomId });
      if (room && room.messages) {
        socket.emit("previous-messages", room.messages);
      }
    } catch (err) {
      console.error("Error fetching previous messages:", err);
    }
  });


  // Send message
  socket.on("send-message", async ({ roomId, message }) => {
    try {
      // Save message to DB
      const room = await Room.findOne({ code: roomId });
      if (room) {
        room.messages.push(message);
        await room.save();
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }

    // Broadcast to room
    io.to(roomId).emit("receive-message", message);
  });

  // Delete selected messages
  socket.on("delete-messages", async ({ roomId, indices }) => {
    try {
      const room = await Room.findOne({ code: roomId });
      if (room && Array.isArray(indices)) {
        // Remove messages by indices
        room.messages = room.messages.filter((_, i) => !indices.includes(i));
        await room.save();
        // Broadcast to all clients in room
        io.to(roomId).emit("delete-messages", indices);
      }
    } catch (err) {
      console.error("Error deleting messages:", err);
    }
  });

  // Delete a single message (WhatsApp style)
  socket.on("delete-single-message", async ({ roomId, index }) => {
    try {
      const room = await Room.findOne({ code: roomId });
      if (room && typeof index === "number") {
        room.messages = room.messages.filter((_, i) => i !== index);
        await room.save();
        io.to(roomId).emit("delete-single-message", index);
      }
    } catch (err) {
      console.error("Error deleting single message:", err);
    }
  });

  // Whiteboard draw event
  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("draw", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const roomRoutes = require("./routes/roomRoutes");
app.use("/api/rooms", roomRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quizzes", quizRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
