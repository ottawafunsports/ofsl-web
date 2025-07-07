import { Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./screens/HomePage";
import { VolleyballPage } from "./screens/VolleyballPage";
import { BadmintonPage } from "./screens/BadmintonPage";
import { LeaguesPage } from "./screens/LeaguesPage";
import { LoginPage } from "./screens/LoginPage";
import { SignupPage } from "./screens/SignupPage";
import { ForgotPasswordPage } from "./screens/ForgotPasswordPage";
import { ResetPasswordPage } from "./screens/ResetPasswordPage";
import { AboutUsPage } from "./screens/AboutUsPage";
import { StandardsOfPlayPage } from "./screens/StandardsOfPlayPage";
import { SuccessPage } from "./screens/SuccessPage";
import { CancelPage } from "./screens/CancelPage";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { LeagueDetailPage } from "./screens/LeagueDetailPage";
import { ToastProvider } from "./components/ui/toast";
import { 
  AccountLayout,
  ProfileTab,
  TeamsTab,
  LeaguesTab,
  SchoolsTab,
  UsersTab
} from "./screens/MyAccount";
import { LeagueEditPage } from "./screens/MyAccount/components/LeagueEditPage";
import { TeamEditPage } from "./screens/MyAccount/components/TeamEditPage";
import { Navigate } from "react-router-dom";
import { LeagueNewPage } from "./screens/MyAccount/components/LeagueNewPage";

// Create a catch-all route component to handle direct URL access
// const CatchAllRoute = () => {
//   // This will redirect any unknown routes to the home page
//   return <Navigate to="/" replace />;
// };

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/volleyball" element={<VolleyballPage />} />
            <Route path="/badminton" element={<BadmintonPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/google-signup-redirect" element={<GoogleSignupRedirect />} />
            <Route path="/leagues/:id" element={<LeagueDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* Ensure reset-password route can handle both query params and hash fragments */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/standards-of-play" element={<StandardsOfPlayPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            
            {/* My Account routes with proper routing */}
            <Route path="/my-account" element={
              <ProtectedRoute>
               <Navigate to="/my-account/profile" replace />
              </ProtectedRoute>
            } />
            <Route path="/my-account" element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }>
              <Route path="teams" element={<TeamsTab />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="leagues" element={
                <ProtectedRoute requireAdmin>
                  <LeaguesTab />
                </ProtectedRoute>
              } />
              <Route path="schools" element={
                <ProtectedRoute requireAdmin>
                  <SchoolsTab />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute requireAdmin>
                  <UsersTab />
                </ProtectedRoute>
              } />
            </Route>

            {/* League New Page - separate route */}
            <Route path="/my-account/leagues/new" element={
              <ProtectedRoute requireAdmin>
                <LeagueNewPage />
              </ProtectedRoute>
            } />

            {/* League Edit Page - separate route */}
            <Route path="/my-account/leagues/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <LeagueEditPage />
              </ProtectedRoute>
            } />

            {/* Team Edit Page - separate route */}
            <Route path="/my-account/teams/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <TeamEditPage />
              </ProtectedRoute>
            } />

            {/* Catch-all route for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Legacy redirects for backward compatibility */}
            <Route path="/my-teams" element={
              <ProtectedRoute>
                <Navigate to="/my-account/teams" replace />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}