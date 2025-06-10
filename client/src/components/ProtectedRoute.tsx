import type { ReactNode } from "react";
 import { useAuth } from "../context/AuthContext";
 import { Navigate } from "react-router-dom";
 
 const ProtectedRoute = ({ children }: { children: ReactNode }) => {
   const { isLoggedIn } = useAuth();
 
   if (!isLoggedIn) {
     return <Navigate to={"/Login"} replace />;
   }
 
   return children;
 };
 
 export default ProtectedRoute;