import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaDoorOpen, FaPlusCircle, FaUsers } from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/rooms", {
        name: "Study Room",
      });
      navigate(`/room/${res.data.code}`);
    } catch (err) {
      alert("Error creating room");
    }
  };

  const joinRoom = async () => {
    const roomId = prompt("Enter Room ID:");
    if (roomId) {
      try {
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        if (res.data) navigate(`/room/${roomId}`);
      } catch (err) {
        alert("Room not found");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-6">
      <div className="max-w-5xl w-full text-center space-y-10">
        <h1 className="text-5xl font-extrabold mb-6">Collaborative Study Rooms 🚀</h1>
        <p className="text-lg opacity-80 mb-8">
          Join or create real-time study rooms with chat, whiteboards, quizzes, and more.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div
            onClick={createRoom}
            className="bg-indigo-700 hover:bg-indigo-600 p-8 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all"
          >
            <FaPlusCircle className="text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold">Create Room</h2>
            <p className="mt-2 text-sm opacity-80">Start a new study session.</p>
          </div>

          <div
            onClick={joinRoom}
            className="bg-purple-700 hover:bg-purple-600 p-8 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all"
          >
            <FaDoorOpen className="text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold">Join Room</h2>
            <p className="mt-2 text-sm opacity-80">Enter a room ID to join instantly.</p>
          </div>

          <div
            onClick={() => navigate("/rooms")}
            className="bg-pink-700 hover:bg-pink-600 p-8 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all"
          >
            <FaUsers className="text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold">Explore Rooms</h2>
            <p className="mt-2 text-sm opacity-80">Browse available study rooms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
