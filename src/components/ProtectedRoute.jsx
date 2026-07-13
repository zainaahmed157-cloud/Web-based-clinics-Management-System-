import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * Usage in router:
 *   { element: <ProtectedRoute allowedRoles={['doctor']} />, children: [...] }
 *
 * Props:
 *   allowedRoles  - optional array of user_type strings that may access this route.
 *                   When omitted, any authenticated user is allowed.
 *   redirectTo    - where to send unauthenticated visitors (default: /Login)
 */
export default function ProtectedRoute({
  allowedRoles,
  redirectTo = '/Login',
}) {
  const { isAuthenticated, user, loading } = useAuth();

  // Wait until the /api/auth/me check resolves before making a decision
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

  // Not logged in → send to login page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Logged in but wrong role → send to home
  if (allowedRoles && !allowedRoles.includes(user?.user_type)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}