import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import PatientDashboard from "../pages/patient/PatientDashboard.jsx";
import PatientHistory from "../pages/patient/PatientHistory.jsx";
import NurseDashboard from "../pages/nurse/NurseDashboard.jsx";
import DoctorDashboard from "../pages/doctor/DoctorDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminSymptoms from "../pages/admin/AdminSymptoms.jsx";
import AdminDailyCap from "../pages/admin/adminDailyCap.jsx";
import AdminStaff from "../pages/admin/AdminStaff.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/history"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/dashboard"
        element={
          <ProtectedRoute allowedRoles={["nurse"]}>
            <NurseDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/symptoms"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSymptoms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDailyCap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStaff />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;