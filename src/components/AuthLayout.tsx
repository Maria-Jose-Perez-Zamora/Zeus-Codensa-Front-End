import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function AuthLayout() {
  const { user } = useAuth();

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si hay usuario autenticado, mostrar el contenido
  return <Outlet />;
}
