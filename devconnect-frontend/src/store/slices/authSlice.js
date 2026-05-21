// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:3000/api';

// ─── Helper — get stored auth ───
const getStoredAuth = () => {
    try {
        const token = localStorage.getItem('devconnect_token');
        const user = localStorage.getItem('devconnect_user');
        return {
            token: token ? JSON.parse(token) : null,
            user: user ? JSON.parse(user) : null,
        };
    } catch {
        return { token: null, user: null };
    }
};

const stored = getStoredAuth();

// ─── Initial State ───
const initialState = {
    user: stored.user,
    token: stored.token,
    isLoggedIn: !!(stored.token && stored.user),
    loading: false,
    error: null,
};


// ════════════════════════════════════════
// ASYNC THUNKS
// ════════════════════════════════════════

// ─── REGISTER ───
export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, email, password, role }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(
                    data.message ?? data.errors?.join(', ') ?? 'Registration failed'
                );
            }

            // Save to localStorage
            localStorage.setItem('devconnect_token', JSON.stringify(data.token));
            localStorage.setItem('devconnect_user', JSON.stringify(data.user));

            return data;
            // { token, user }

        } catch (error) {
            return rejectWithValue('Network error — is the server running?');
        }
    }
);


// ─── LOGIN ───
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message ?? 'Login failed');
            }

            // Save to localStorage
            localStorage.setItem('devconnect_token', JSON.stringify(data.token));
            localStorage.setItem('devconnect_user', JSON.stringify(data.user));

            return data;

        } catch (error) {
            return rejectWithValue('Network error — is the server running?');
        }
    }
);


// ─── GET ME ───
export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            // ↑ getState() = read current Redux state

            const res = await fetch(`${BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (!res.ok) return rejectWithValue(data.message);
            return data.data; // user object

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// ════════════════════════════════════════
// SLICE
// ════════════════════════════════════════
const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        // ─── Logout ───
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.error = null;
            localStorage.removeItem('devconnect_token');
            localStorage.removeItem('devconnect_user');
        },

        // ─── Clear Error ───
        clearAuthError: (state) => {
            state.error = null;
        },
    },

    // ─── Extra Reducers for Async Thunks ───
    extraReducers: (builder) => {
        builder

            // ─── Register ───
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ─── Login ───
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ─── Get Me ───
            .addCase(getMe.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;

// ─── Selectors ───
// WHY: centralize state access — change once if structure changes
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;