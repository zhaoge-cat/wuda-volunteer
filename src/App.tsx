import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Badges from "@/pages/Badges";
import BlindBox from "@/pages/BlindBox";
import Honors from "@/pages/Honors";
import Activities from "@/pages/Activities";
import Benefits from "@/pages/Benefits";
import CheckIn from "@/pages/CheckIn";
import AdminDashboard from "@/pages/admin/Dashboard";
import Shifts from "@/pages/admin/Shifts";
import Attendance from "@/pages/admin/Attendance";
import Scoring from "@/pages/admin/Scoring";
import Stats from "@/pages/admin/Stats";
import { useAuthStore } from "@/store";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentUser?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/blindbox" element={<BlindBox />} />
            <Route path="/honors" element={<Honors />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shifts"
              element={
                <AdminRoute>
                  <Shifts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <AdminRoute>
                  <Attendance />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/scoring"
              element={
                <AdminRoute>
                  <Scoring />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <AdminRoute>
                  <Stats />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
