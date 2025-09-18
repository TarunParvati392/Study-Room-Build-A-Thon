const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String },
  image: { type: String }, // base64 or URL
  createdAt: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    messages: [messageSchema], // store messages here
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
