import { Route, Routes } from "react-router-dom";
import { HomePage } from "./screens/HomePage";
import { VolleyballPage } from "./screens/VolleyballPage";
import { LeaguesPage } from "./screens/LeaguesPage";
import { LoginPage } from "./screens/LoginPage";
import { Layout } from "./components/Layout";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/volleyball" element={<VolleyballPage />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}