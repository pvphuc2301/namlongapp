import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            state.token = action.payload.accessToken;
        },
        logout: (state) => {
            state.userInfo = null;
            state.token = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => {
    const token = state.auth.token;

    if (!token) return null;

    const decoded = JSON.parse(atob(token.split('.')[1]));

    const { id, username, email, role } = decoded.UserInfo;

    return { id, username, email, role };
}

export const selectCurrentToken = (state) => state.auth.token;