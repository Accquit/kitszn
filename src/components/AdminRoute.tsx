
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user, isAdmin, isLoading, isAdminLoading } = useAuth();

  if (isLoading || isAdminLoading) {
    return <div className="flex justify-center items-center h-screen bg-background">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
