import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'sub_admin' | 'manager'>;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { admin, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && admin && !allowedRoles.includes(admin.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Access Denied</h2>
          <p className="text-gray-500 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-400">
            Required role: {allowedRoles.join(' or ')}
            <br />
            Your role: {admin.role}
          </p>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render child routes or children
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
