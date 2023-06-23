import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ModeSelection from "./pages/ModeSelection";
import Tutorial from "./pages/Tutorial";
import GlobalHighscore from "./pages/GlobalHighscore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSettings from "./pages/ProfileSettings";
import UserHighscore from "./pages/UserHighscore";
import StandardGame from "./pages/StandardGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/modeselection" element={<ModeSelection />} />
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/globalhighscore" element={<GlobalHighscore />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/userhighscore" element={<UserHighscore />} />
      <Route path="/standardGame" element={<StandardGame />} />
    </Routes>
  );
}

export default App;
