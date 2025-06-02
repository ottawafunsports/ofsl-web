import { Route, Routes } from "react-router-dom";
import { HomePage } from "./screens/HomePage";
import { VolleyballPage } from "./screens/VolleyballPage";
import { LeaguesPage } from "./screens/LeaguesPage";
import { LoginPage } from "./screens/LoginPage";
import { SignupPage } from "./screens/SignupPage";
import { AboutUsPage } from "./screens/AboutUsPage";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/volleyball" element={<VolleyballPage />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          
          {/* Example protected route - uncomment when needed */}
          {/* <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } /> */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}