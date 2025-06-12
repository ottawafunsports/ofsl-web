import { Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./screens/HomePage";
import { VolleyballPage } from "./screens/VolleyballPage";
import { LeaguesPage } from "./screens/LeaguesPage";
import { LoginPage } from "./screens/LoginPage";
import { SignupPage } from "./screens/SignupPage";
import { AboutUsPage } from "./screens/AboutUsPage";
import { StandardsOfPlayPage } from "./screens/StandardsOfPlayPage";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { LeagueDetailPage } from "./screens/LeagueDetailPage";
import { ToastProvider } from "./components/ui/toast";

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/volleyball" element={<VolleyballPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/leagues/:id" element={<LeagueDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/standards-of-play" element={<StandardsOfPlayPage />} />
            
            {/* Example protected route - uncomment when needed */}
            {/* <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}