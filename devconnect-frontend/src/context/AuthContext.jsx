// src/context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

// ─── Create Context ───
const AuthContext = createContext();

// ─── Initial State ───
const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

// ─── Reducer ───
const authReducer = (state, action) => {
    switch (action.type) {

        case 'AUTH_START':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                token: action.payload.token,
                isLoggedIn: true,
                error: null,
            };

        case 'AUTH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
                isLoggedIn: false,
            };

        case 'LOGOUT':
            return {
                ...initialState,
                // reset everything to initial state
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};


// ─── Provider Component ───
export function AuthProvider({ children }) {

    const [state, dispatch] = useReducer(authReducer, initialState);

    // Persist token in localStorage
    const [storedToken, setStoredToken, removeToken] =
        useLocalStorage('devconnect_token', null);

    const [storedUser, setStoredUser, removeUser] =
        useLocalStorage('devconnect_user', null);

    // Rehydrate auth state on page refresh
    useEffect(() => {
        if (storedToken && storedUser) {
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { token: storedToken, user: storedUser },
            });
        }
    }, []);
    // [] = runs once on mount
    // if token exists in localStorage → restore logged in state


    // ─── REGISTER ───
    const register = async (name, email, password, role = 'user') => {
        dispatch({ type: 'AUTH_START' });

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? 'Registration failed');
            }

            // Save to localStorage
            setStoredToken(data.token);
            setStoredUser(data.user);

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { token: data.token, user: data.user },
            });

            return { success: true };

        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };


    // ─── LOGIN ───
    const login = async (email, password) => {
        dispatch({ type: 'AUTH_START' });

        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? 'Login failed');
            }

            // Save to localStorage
            setStoredToken(data.token);
            setStoredUser(data.user);

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { token: data.token, user: data.user },
            });

            return { success: true };

        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };


    // ─── LOGOUT ───
    const logout = () => {
        removeToken();
        removeUser();
        dispatch({ type: 'LOGOUT' });
    };


    // ─── CLEAR ERROR ───
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };


    // ─── Context Value ───
    const value = {
        // State
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        loading: state.loading,
        error: state.error,
        // Actions
        register,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


// ─── Custom Hook to consume context ───
// WHY: cleaner than importing useContext + AuthContext everywhere
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
        // helpful error if someone forgets to wrap with Provider
    }

    return context;
}

export default AuthContext;