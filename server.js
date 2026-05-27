// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import requestLogger from './middleware/requestLogger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.set('io', io);

connectDB();

// ─── CORS ───
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    // ↑ ADD HEAD to allowed methods
}));

app.use(express.json());
app.use(requestLogger);

// ─── FIX 1: Handle HEAD / explicitly ───
// Render health check uses HEAD request
app.head('/', (req, res) => {
    res.status(200).end();
    // ↑ respond 200 with no body
    // HEAD requests never have a body
});

// ─── FIX 2: Handle GET / as well ───
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'DevConnect API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ─── Health Check ───
// Render also checks /health
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime() + ' seconds',
    });
});

// ─── HEAD /health ───
app.head('/health', (req, res) => {
    res.status(200).end();
});

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Socket.io ───
io.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    socket.on('join', (userId) => {
        socket.join(`user:${userId}`);
    });

    socket.on('joinJob', (jobId) => {
        socket.join(`job:${jobId}`);
    });

    socket.on('leaveJob', (jobId) => {
        socket.leave(`job:${jobId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Disconnected: ${socket.id}`);
    });
});

// ─── Error Handlers — LAST ───
app.use(notFound);
app.use(errorHandler);

// ─── Start ───
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`\n🚀 DevConnect API → http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
});

export { app };