import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/userStore"

function RequireAuth() {
  const user = useUserStore(state => state.user);

  return user ? <Outlet /> : < Navigate to="/welcome" replace />
}

export default RequireAuth