// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import requestLogger from './middleware/requestLogger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

// Allow requests from your Vite frontend
app.use(cors({ origin: 'http://localhost:5173' }));

connectDB();

app.use(express.json());
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 DevConnect API → http://localhost:${PORT}`);
    console.log(`\n📋 Routes:`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   GET  /api/companies`);
    console.log(`   POST /api/companies`);
    console.log(`   GET  /api/jobs`);
    console.log(`   POST /api/jobs`);
    console.log(`   POST /api/jobs/:id/apply`);
    console.log(`   GET  /api/jobs/my/applications\n`);
});