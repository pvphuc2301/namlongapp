import { useDispatch } from "react-redux";
import axios from "../api/axios";
import { setCredentials } from "../redux/slices/authSlice";

const useRefreshToken = () => {
    const dispatch = useDispatch();

    const refresh = async () => {
        try {
            const response = await axios.get('/api/v1/auth/refresh', { withCredentials: true });
            dispatch(setCredentials({ ...response.data }));
            return response.data.accessToken;
        } catch (err) {
            console.log(err);
        }
    }

    return refresh;
}

export default useRefreshToken;