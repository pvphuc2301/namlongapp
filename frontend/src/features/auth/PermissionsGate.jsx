import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";

const PermissionsGate = ({ roles, owner = undefined, children }) => {

    const currentUser = useSelector(selectCurrentUser);

    if (roles.includes(currentUser?.role) || owner === currentUser?.id) {
        return <>{children}</>;
    }

    return <></>
}

export default PermissionsGate;