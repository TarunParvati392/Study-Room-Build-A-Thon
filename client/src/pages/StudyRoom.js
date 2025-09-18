import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import Flashcards from "./FlashCards"
import Quiz from "./Quiz";
import Whiteboard from "./WhiteBoard";


export default function StudyRoom() {
  const { roomId } = useParams();
  const [selectedFeature, setSelectedFeature] = useState(""); // track sidebar selection
  const userName = "User" + Math.floor(Math.random() * 1000); // demo username

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 bg-gray-800 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Room: {roomId}</h1>
        <button
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
          onClick={() => window.location.href = "/"} // simple leave
        >
          Leave Room
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 space-y-4">
          <button
            onClick={() => setSelectedFeature("chat")}
            className={`w-full py-2 rounded ${
              selectedFeature === "chat" ? "bg-blue-600" : "bg-indigo-600"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setSelectedFeature("whiteboard")}
            className={`w-full py-2 rounded ${
              selectedFeature === "whiteboard" ? "bg-blue-600" : "bg-indigo-600"
            }`}
          >
            Whiteboard
          </button>
          <button
            onClick={() => setSelectedFeature("flashcards")}
            className={`w-full py-2 rounded ${
              selectedFeature === "flashcards" ? "bg-blue-600" : "bg-indigo-600"
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setSelectedFeature("quiz")}
            className={`w-full py-2 rounded ${
              selectedFeature === "quiz" ? "bg-blue-600" : "bg-indigo-600"
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setSelectedFeature("timer")}
            className={`w-full py-2 rounded ${
              selectedFeature === "timer" ? "bg-blue-600" : "bg-indigo-600"
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setSelectedFeature("calendar")}
            className={`w-full py-2 rounded ${
              selectedFeature === "calendar" ? "bg-blue-600" : "bg-indigo-600"
            }`}
          >
            Calendar
          </button>
        </aside>

        {/* Content */}
        <section className="flex-1 p-6">
          {selectedFeature === "" && (
            <h2 className="text-xl font-bold mb-4">
              Select a feature from sidebar →
            </h2>
          )}

          {selectedFeature === "chat" && (
            <ChatRoom roomId={roomId} userName={userName} />
          )}

          {selectedFeature === "whiteboard" && (
            <Whiteboard roomId={roomId} />
          )}

          {selectedFeature === "flashcards" && (
            <Flashcards roomId={roomId} />
          )}

          {selectedFeature === "quiz" && (
            <Quiz roomId={roomId} />
          )}

          {selectedFeature === "timer" && (
            <div className="text-white text-lg">Timer coming soon...</div>
          )}

          {selectedFeature === "calendar" && (
            <div className="text-white text-lg">Calendar coming soon...</div>
          )}
        </section>
      </main>
    </div>
  );
}
