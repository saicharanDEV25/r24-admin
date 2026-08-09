import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;