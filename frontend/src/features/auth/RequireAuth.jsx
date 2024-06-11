import { Result } from "antd";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../../redux/slices/authSlice";

const RequiredAuth = ({ allowedRoles = [] }) => {
    const location = useLocation();
    const userInfo = useSelector(selectCurrentUser);

    return allowedRoles.includes(userInfo?.role) ? <Outlet /> :
        <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." extra={<Link to="/" state={{ from: location }} replace> Back Home</Link>} />

    // return roles.some(role => allowedRoles.includes(role)) ? children : <Navigate to="/login" state={{ from: location }} replace />
}

export default RequiredAuth;