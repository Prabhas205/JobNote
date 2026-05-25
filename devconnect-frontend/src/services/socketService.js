// src/services/socketService.js
// Manages Socket.io connection — singleton pattern
// WHY singleton: one connection shared across entire app

import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    // ─── Connect ───
    connect(userId) {
        if (this.socket?.connected) {
            console.log('Already connected');
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            // ↑ try WebSocket first, fall back to polling
            reconnection: true,
            // ↑ auto-reconnect if connection drops
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 10000,
        });

        // ─── Connection events ───
        this.socket.on('connect', () => {
            this.isConnected = true;
            console.log('🔌 Socket connected:', this.socket.id);

            // Join user's personal room after connecting
            if (userId) {
                this.socket.emit('join', userId);
                console.log(`👤 Joined user room: user:${userId}`);
            }
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            console.log('❌ Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        this.socket.on('reconnect', (attempt) => {
            console.log(`🔄 Reconnected after ${attempt} attempts`);
        });

        return this.socket;
    }

    // ─── Disconnect ───
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            console.log('Socket disconnected manually');
        }
    }

    // ─── Join job room ───
    joinJobRoom(jobId) {
        if (this.socket?.connected) {
            this.socket.emit('joinJob', jobId);
        }
    }

    // ─── Leave job room ───
    leaveJobRoom(jobId) {
        if (this.socket?.connected) {
            this.socket.emit('leaveJob', jobId);
        }
    }

    // ─── Listen for event ───
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // ─── Remove listener ───
    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    // ─── Emit event ───
    emit(event, data) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }

    // ─── Get connection status ───
    get connected() {
        return this.socket?.connected ?? false;
    }
}

// Export single instance — shared across entire app
export default new SocketService();