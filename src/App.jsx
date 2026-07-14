import React, { useEffect } from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';

// Public layout & pages
import Layout from './pages/layout';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Appointments from './pages/Appointments';
import About from './pages/About';
import Contact from './pages/Contact';
import Specialties from './pages/Specialties';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// Auth pages
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import ForgetPassword from './pages/ForgetPassword';

// Doctor Dashboard
import DoctorDashboardLayout from './pages/DoctorDashboard/layout';
import DoctorDashboardHome from './pages/DoctorDashboard/index';
import DoctorDashboardPatients from './pages/DoctorDashboard/pages/patients/index';
import DoctorDashboardPatientDetail from './pages/DoctorDashboard/pages/patients/[id]';
import DoctorDashboardAppointments from './pages/DoctorDashboard/pages/appointments/index';
import DoctorDashboardPrescriptions from './pages/DoctorDashboard/pages/prescriptions/index';
import DoctorDashboardFinancial from './pages/DoctorDashboard/financial/index';
import DoctorDashboardNotifications from './pages/DoctorDashboard/notifications/index';
import DoctorDashboardSettings from './pages/DoctorDashboard/settings/index';

// Admin Dashboard
import AdminDashboardLayout from './pages/AdminDashboard/layout';
import AdminDashboardHome from './pages/AdminDashboard/index';
import AdminDashboardPatients from './pages/AdminDashboard/pages/patients/index';
import AdminDashboardDoctorsRequests from './pages/AdminDashboard/pages/doctors/requests/index';
import AdminDashboardDoctorsSchedule from './pages/AdminDashboard/pages/doctors/[id]/Schedule/index';
import AdminDashboardAppointments from './pages/AdminDashboard/pages/appointments/index';
import AdminDashboardAppointmentsRequests from './pages/AdminDashboard/pages/appointments/requests/index';
import AdminDashboardStaff from './pages/AdminDashboard/pages/staff/index';
import AdminDashboardAuditLogs from './pages/AdminDashboard/audit-logs/index';
import AdminDashboardNotifications from './pages/AdminDashboard/notifications/index';
import AdminDashboardSettings from './pages/AdminDashboard/settings/index';

// ─── Guard components ─────────────────────────────────────────────────────────

/**
 * GuestRoute — blocks access to /Login, /CreateAccount etc. when already
 * logged in. Redirects doctors to /doctor-dashboard, patients to /.
 *
 * IMPORTANT: must be defined inside App() so it sits inside AuthProvider.
 */
function GuestRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  // Wait for the synchronous localStorage restore to finish
  if (loading) return null;

  if (isAuthenticated) {
    if (user?.user_type === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (user?.user_type === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

/**
 * ProtectedRoute — requires authentication.
 * Optional allowedRoles restricts by user_type.
 */
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f8f9ff',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #e0e4ff',
            borderTopColor: '#1F2B6C',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/Login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.user_type)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// ─── App ──────────────────────────────────────────────────────────────────────
// The router is created INSIDE App so that GuestRoute and ProtectedRoute are
// rendered inside <AuthProvider> and can safely call useAuth().
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir  = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const router = createBrowserRouter([
    // ── Public site ──────────────────────────────────────────────────────────
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true,          element: <Home /> },
        { path: 'Specialties',  element: <Specialties /> },
        { path: 'Doctors',      element: <Doctors /> },
        { path: 'doctors/:id',  element: <DoctorProfile /> },
        { path: 'Appointments', element: <Appointments /> },
        { path: 'About',        element: <About /> },
        { path: 'Contact',      element: <Contact /> },
        // Patient-only
        {
          element: <ProtectedRoute allowedRoles={['patient']} />,
          children: [
            { path: 'Profile', element: <Profile /> },
          ],
        },
        // Logged-in users
        {
          element: <ProtectedRoute />,
          children: [
            { path: 'Notifications', element: <Notifications /> },
          ],
        },
      ],
    },

    // ── Auth pages (guest-only — redirect away if already logged in) ──────────
    {
      element: <GuestRoute />,
      children: [
        { path: '/Login',          element: <Login /> },
        { path: '/CreateAccount',  element: <CreateAccount /> },
        { path: '/ForgetPassword', element: <ForgetPassword /> },
      ],
    },

    // ── Doctor Dashboard (doctor-only) ────────────────────────────────────────
    {
      element: <ProtectedRoute allowedRoles={['doctor']} />,
      children: [
        {
          path: '/doctor-dashboard',
          element: <DoctorDashboardLayout />,
          children: [
            { index: true,            element: <DoctorDashboardHome /> },
            { path: 'patients',       element: <DoctorDashboardPatients /> },
            { path: 'patients/:id',   element: <DoctorDashboardPatientDetail /> },
            { path: 'appointments',   element: <DoctorDashboardAppointments /> },
            { path: 'prescriptions',  element: <DoctorDashboardPrescriptions /> },
            { path: 'financial',      element: <DoctorDashboardFinancial /> },
            { path: 'notifications',  element: <DoctorDashboardNotifications /> },
            { path: 'settings',       element: <DoctorDashboardSettings /> },
          ],
        },
      ],
    },
    // ── Admin Dashboard (admin-only) ────────────────────────────────────────
    {
      element: <ProtectedRoute allowedRoles={['admin']} />,
      children: [
        {
          path: '/admin-dashboard',
          element: <AdminDashboardLayout />,
          children: [
            { index: true,            element: <AdminDashboardHome /> },
            { path: 'pages/patients', element: <AdminDashboardPatients /> },
            { path: 'pages/doctors/requests', element: <AdminDashboardDoctorsRequests /> },
            { path: 'pages/doctors/:id/Schedule', element: <AdminDashboardDoctorsSchedule /> },
            { path: 'pages/appointments', element: <AdminDashboardAppointments /> },
            { path: 'pages/appointments/requests', element: <AdminDashboardAppointmentsRequests /> },
            { path: 'pages/staff',    element: <AdminDashboardStaff /> },
            { path: 'audit-logs',     element: <AdminDashboardAuditLogs /> },
            { path: 'notifications',  element: <AdminDashboardNotifications /> },
            { path: 'settings',       element: <AdminDashboardSettings /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
