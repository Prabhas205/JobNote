// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
// ↑ need HTTP server to attach Socket.io
import { Server } from 'socket.io';
// ↑ Socket.io server
import connectDB from './config/db.js';
import requestLogger from './middleware/requestLogger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();
const httpServer = createServer(app);
// ↑ wrap express app in HTTP server
// WHY: Socket.io needs raw HTTP server, not express app

// ─── Socket.io setup ───
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Make io accessible in routes/controllers
// WHY: controllers need to emit events
app.set('io', io);
// Usage in controller: const io = req.app.get('io');

connectDB();

// ─── Middleware ───
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        connections: io.engine.clientsCount,
        // ↑ how many users currently connected
    });
});

// ─── Socket.io Connection Handler ───
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // ─── User joins their personal room ───
    // WHY: send notifications to specific user only
    socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
        // ↑ room named "user:abc123"
        console.log(`👤 User ${userId} joined room user:${userId}`);
    });

    // ─── User joins a job room ───
    // WHY: get live updates for a specific job
    socket.on('joinJob', (jobId) => {
        socket.join(`job:${jobId}`);
        console.log(`💼 Socket joined job room: job:${jobId}`);
    });

    // ─── User leaves a job room ───
    socket.on('leaveJob', (jobId) => {
        socket.leave(`job:${jobId}`);
        console.log(`👋 Socket left job room: job:${jobId}`);
    });

    // ─── Disconnect ───
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });

    // ─── Error handling ───
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// ─── Error Handlers ───
app.use(notFound);
app.use(errorHandler);

// ─── Start server ───
// IMPORTANT: use httpServer.listen not app.listen
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`\n🚀 DevConnect API → http://localhost:${PORT}`);
    console.log(`🔌 Socket.io ready on port ${PORT}\n`);
});