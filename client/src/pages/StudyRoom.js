import { useParams } from "react-router-dom";

export default function StudyRoom() {
  const { roomId } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 bg-gray-800 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Room: {roomId}</h1>
        <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded">
          Leave Room
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 space-y-4">
          <button className="w-full bg-indigo-600 py-2 rounded">Chat</button>
          <button className="w-full bg-indigo-600 py-2 rounded">
            Whiteboard
          </button>
          <button className="w-full bg-indigo-600 py-2 rounded">
            Flashcards
          </button>
          <button className="w-full bg-indigo-600 py-2 rounded">Quiz</button>
          <button className="w-full bg-indigo-600 py-2 rounded">Timer</button>
          <button className="w-full bg-indigo-600 py-2 rounded">Calendar</button>
        </aside>

        {/* Content */}
        <section className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">
            Select a feature from sidebar →
          </h2>
        </section>
      </main>
    </div>
  );
}
