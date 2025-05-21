import { Route, Routes } from "react-router-dom";
import { HomePage } from "./screens/HomePage";
import { VolleyballPage } from "./screens/VolleyballPage";
import { LeaguesPage } from "./screens/LeaguesPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/volleyball" element={<VolleyballPage />} />
      <Route path="/leagues" element={<LeaguesPage />} />
    </Routes>
  );
}