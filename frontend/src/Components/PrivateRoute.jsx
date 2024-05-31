import { Navigate,Outlet } from "react-router-dom"
import { useSelector } from "react-redux";


const PrivateRoute = () => {
    const user  = localStorage.getItem('userData');
    const userData = JSON.parse(user);
    
    return userData ? <Outlet /> : <Navigate to="/login" replace />;
  
}

export default PrivateRoute;