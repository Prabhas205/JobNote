// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import jobReducer from './slices/jobSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // ↑ state.auth = all auth state
        jobs: jobReducer,
        // ↑ state.jobs = all job state
    },

    // Redux DevTools enabled automatically in development
    // Install: Chrome → Redux DevTools Extension
});

export default store;