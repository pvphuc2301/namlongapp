import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axios from "../../api/axios";

const useRefresh = () => {
    const dispatch = useDispatch();

    const { mutate: refresh, isLoading, isSuccess, isError, error, isIdle } = useMutation({
        mutationFn: () => axios.get("/api/v1/auth/refresh", { withCredentials: true }),
        onSuccess: ({ data }) => {
            dispatch(setCredentials({ accessToken: data.accessToken }));
            return data.accessToken;
        }
    });

    return { refresh, isLoading, isSuccess, isError, error, isIdle };
}

export default useRefresh;