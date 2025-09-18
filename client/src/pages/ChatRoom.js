import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://study-room-build-a-thon.onrender.com"); // Replace with backend URL

export default function ChatRoom({ roomId, userName }) {
  // ...existing code...
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const fileInputRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(-1);
  // ...existing code...
  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("previous-messages", (msgs) => {
      setMessages(msgs);
    });
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("delete-messages", (indices) => {
      setMessages((prev) => prev.filter((_, i) => !indices.includes(i)));
    });
    socket.on("delete-single-message", (index) => {
      setMessages((prev) => prev.filter((_, i) => i !== index));
    });
    return () => {
      socket.off("receive-message");
      socket.off("previous-messages");
      socket.off("delete-messages");
      socket.off("delete-single-message");
    };
  }, [roomId]);
  // ...existing code...
  // Removed multi-select/delete logic
  const sendMessage = () => {
    if (!input.trim() && !image) return;
    const msg = {
      user: userName,
      text: input,
      image: image || undefined,
      createdAt: new Date().toISOString(),
      replyTo: replyTo ? {
        user: replyTo.user,
        text: replyTo.text,
        image: replyTo.image,
        createdAt: replyTo.createdAt,
      } : undefined,
    };
    socket.emit("send-message", { roomId, message: msg });
    setInput("");
    setImage(null);
    setShowEmoji(false);
    setReplyTo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // ...existing code...
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`relative p-2 rounded-xl max-w-xs ${
              msg.user === userName
                ? "bg-blue-600 self-end"
                : "bg-gray-800 self-start"
            }`}
            onMouseLeave={() => setDropdownOpen(-1)}
          >
            {/* Dropdown menu */}
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={() => setDropdownOpen(i)}
                className="text-white bg-gray-700 rounded-full px-2 py-1 hover:bg-gray-600"
              >
                &#8942;
              </button>
              {dropdownOpen === i && (
                <div className="absolute right-0 mt-2 w-28 bg-gray-800 rounded shadow-lg border border-gray-700">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    onClick={() => {
                      setReplyTo(msg);
                      setDropdownOpen(-1);
                    }}
                  >Reply</button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                    onClick={() => {
                      socket.emit("delete-single-message", { roomId, index: i });
                      setDropdownOpen(-1);
                    }}
                  >Delete</button>
                </div>
              )}
            </div>
            {/* Reply preview */}
            {msg.replyTo && (
              <div className="mb-2 p-2 rounded bg-gray-700 text-xs">
                <span className="font-bold">Reply to {msg.replyTo.user}:</span>
                {msg.replyTo.text && <span> {msg.replyTo.text}</span>}
                {msg.replyTo.image && (
                  <img src={msg.replyTo.image} alt="reply-img" className="inline-block max-w-[50px] ml-2" />
                )}
              </div>
            )}
            <p className="text-xs text-gray-300">{msg.user}</p>
            {msg.text && <p>{msg.text}</p>}
            {msg.image && (
              <img
                src={msg.image}
                alt="shared"
                className="mt-2 max-w-[200px] rounded-lg border border-gray-700"
              />
            )}
            {msg.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
      {/* Input + Emoji + Image + Reply Preview */}
      <div className="flex flex-col bg-gray-800 p-4">
        {replyTo && (
          <div className="mb-2 p-2 rounded bg-gray-700 text-xs flex items-center justify-between">
            <span>
              Replying to <b>{replyTo.user}</b>: {replyTo.text}
              {replyTo.image && (
                <img src={replyTo.image} alt="reply-img" className="inline-block max-w-[50px] ml-2" />
              )}
            </span>
            <button className="ml-2 text-red-400" onClick={() => setReplyTo(null)}>✕</button>
          </div>
        )}
        <div className="flex items-center mb-2">
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="ml-2"
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
