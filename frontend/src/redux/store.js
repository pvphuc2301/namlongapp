import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import authReducer, { setCredentials } from './slices/authSlice';

const tokenMiddleware = store => next => action => {
    if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
    }
    return next(action);
};

const createAppStore = async () => {
    try {
        const store = configureStore({
            reducer: {
                auth: authReducer
            },
            middleware: (getDefaultMiddleware) => {
                return [thunk, tokenMiddleware]
            },
        });

        console.log(store.getState());

        // await store.dispatch(setCredentials({ userInfo: null }));
        return store;
    } catch (error) {
        throw new Error(`Failed to create store: ${error.message}`);
    }
};

export default createAppStore;