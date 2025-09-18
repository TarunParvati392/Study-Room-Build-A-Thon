import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExploreRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/rooms")
      .then(res => setRooms(res.data))
      .catch(() => console.log("Error fetching rooms"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Rooms</h1>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {rooms.map((room) => (
          <div
            key={room.code}
            onClick={() => navigate(`/room/${room.code}`)}
            className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition"
          >
            <h2 className="text-2xl font-semibold">{room.name}</h2>
            <p className="text-sm mt-2 opacity-70">Room ID: {room.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
