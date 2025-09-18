import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000"); // Replace with backend URL

export default function ChatRoom({ roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = { user: userName, text: input };

    socket.emit("send-message", { roomId, message: msg });
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setShowEmoji(false);
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-xs ${
              msg.user === userName
                ? "bg-blue-600 self-end"
                : "bg-gray-800 self-start"
            }`}
          >
            <p className="text-xs text-gray-300">{msg.user}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input + Emoji */}
      <div className="flex flex-col bg-gray-800 p-4">
        <div className="flex items-center">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="px-3 py-2 mr-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            😀
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
          />

          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Send
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="mt-2 bg-gray-900 rounded-lg p-2">
            <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
          </div>
        )}
      </div>
    </div>
  );
}
