import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetails from "./pages/SubjectDetails";
import Timer from "./pages/Timer";
import Progress from "./pages/Progress";
import SelectClass from "./pages/SelectClass";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Schedule from "./pages/Schedule";
import Notes from "./pages/Notes";
import CurrentAffairs from "./pages/CurrentAffairs";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";

// 🔒 PROTECTED ROUTE
function Protected({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// ✅ AUTH CENTER WRAPPER (MISSING THA)
function AuthLayout({ children }) {
  return <div className="auth-page">{children}</div>;
}

// ✅ FOOTER CONTROL
function AppContent() {
  const location = useLocation();

  const hideFooterRoutes = ["/login", "/register", "/select-class"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

          <Route
            path="/select-class"
            element={
              <Protected>
                <AuthLayout>
                  <SelectClass />
                </AuthLayout>
              </Protected>
            }
          />

          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/subjects" element={<Protected><Subjects /></Protected>} />
          <Route path="/subjects/:id" element={<Protected><SubjectDetails /></Protected>} />
          <Route path="/timer" element={<Protected><Timer /></Protected>} />
          <Route path="/progress" element={<Protected><Progress /></Protected>} />
          <Route path="/schedule" element={<Protected><Schedule /></Protected>} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/notes" element={<Protected><Notes /></Protected>} />
          <Route path="/CurrentAffairs" element={<Protected><CurrentAffairs /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/about" element={<Protected><About /></Protected>} />
          <Route path="/faq" element={<Protected><FAQ /></Protected>} />
          <Route path="/contact" element={<Protected><Contact /></Protected>} />
        </Routes>
      </div>

      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}