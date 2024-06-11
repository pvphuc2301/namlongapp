import { useSelector } from "react-redux"
import { selectCurrentToken } from "../redux/slices/authSlice"

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    let isManager = false;
    let isAdmin = false;
    let status = 'Employee';

    if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const { username, role } = decoded.UserInfo;

        isManager = role === 'manager';
        isAdmin = role === 'admin';

        if (isManager) status = 'Manager';
        if (isAdmin) status = 'Admin';

        return { username, role, isManager, isAdmin, status };
    }

    return {
        username: '',
        roles: [],
        isManager,
        isAdmin,
        status
    }

}

export default useAuth;