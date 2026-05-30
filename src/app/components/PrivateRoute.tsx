import { Navigate } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="h-full bg-[#0F0F0F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#1A1A1A] border-t-[#FF6B2B] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
