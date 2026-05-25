// src/context/SocketContext.jsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import { useAppSelector } from '../store/hooks.js';
import { selectUser, selectIsLoggedIn } from '../store/slices/authSlice.js';
import socketService from '../services/socketService.js';
import { useQueryClient } from '@tanstack/react-query';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const queryClient = useQueryClient();

    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [newJobAlert, setNewJobAlert] = useState(null);

    // ─── Connect when user logs in ───
    useEffect(() => {
        if (isLoggedIn && user?._id) {
            // Connect socket and join user room
            socketService.connect(user._id);

            // Listen for connection status
            socketService.on('connect', () => {
                setIsConnected(true);
            });

            socketService.on('disconnect', () => {
                setIsConnected(false);
            });

            // ─── Listen for new application notification ───
            // Only employer receives this
            socketService.on('newApplication', (data) => {
                console.log('📩 New application received:', data);

                // Add to notifications list
                setNotifications(prev => [
                    {
                        id: Date.now(),
                        ...data,
                        read: false,
                    },
                    ...prev,
                ]);

                // Increment unread count
                setUnreadCount(prev => prev + 1);

                // Invalidate applications query — dashboard updates
                queryClient.invalidateQueries({ queryKey: ['jobs'] });
            });

            // ─── Listen for new job posted ───
            // All connected users receive this
            socketService.on('newJob', (data) => {
                console.log('💼 New job posted:', data);

                // Show alert banner
                setNewJobAlert(data);

                // Auto-hide after 5 seconds
                setTimeout(() => setNewJobAlert(null), 5000);

                // Invalidate jobs list — new job appears
                queryClient.invalidateQueries({ queryKey: ['jobs', 'list'] });
            });

            // ─── Listen for job updates ───
            socketService.on('jobUpdate', (data) => {
                console.log('🔄 Job updated:', data);

                // Invalidate specific job query
                queryClient.invalidateQueries({
                    queryKey: ['jobs', 'detail', data.jobId],
                });
            });

        } else {
            // Disconnect when logged out
            socketService.disconnect();
            setIsConnected(false);
            setNotifications([]);
            setUnreadCount(0);
        }

        // Cleanup on unmount
        return () => {
            socketService.off('newApplication');
            socketService.off('newJob');
            socketService.off('jobUpdate');
        };
    }, [isLoggedIn, user?._id]);


    // ─── Mark notification as read ───
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);


    // ─── Mark all as read ───
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);


    // ─── Clear notification ───
    const clearNotification = useCallback((notificationId) => {
        setNotifications(prev => {
            const notif = prev.find(n => n.id === notificationId);
            if (notif && !notif.read) {
                setUnreadCount(c => Math.max(0, c - 1));
            }
            return prev.filter(n => n.id !== notificationId);
        });
    }, []);


    // ─── Join job room (for job detail page) ───
    const joinJobRoom = useCallback((jobId) => {
        socketService.joinJobRoom(jobId);
    }, []);


    // ─── Leave job room ───
    const leaveJobRoom = useCallback((jobId) => {
        socketService.leaveJobRoom(jobId);
    }, []);


    const value = {
        isConnected,
        notifications,
        unreadCount,
        newJobAlert,
        markAsRead,
        markAllAsRead,
        clearNotification,
        joinJobRoom,
        leaveJobRoom,
        setNewJobAlert,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used inside SocketProvider');
    }
    return context;
}

export default SocketContext;