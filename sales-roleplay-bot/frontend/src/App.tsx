import { Route, Routes } from "react-router-dom";
import Arena from "./pages/Arena";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/arena" element={<Arena />} />
    </Routes>
  );
}
