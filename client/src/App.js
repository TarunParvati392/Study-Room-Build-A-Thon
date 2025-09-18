import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudyRoom from "./pages/StudyRoom";
import ExploreRooms from "./pages/ExploreRooms";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/room/:roomId" element={<StudyRoom />} />
        <Route path="/rooms" element={<ExploreRooms />} />
      </Routes>
    </Router>
  );
}

export default App;
