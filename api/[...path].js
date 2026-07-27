import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../backend/src/routes/authRoutes.js';
import taskRoutes from '../backend/src/routes/taskRoutes.js';
import userRoutes from '../backend/src/routes/userRoutes.js';
import messageRoutes from '../backend/src/routes/messageRoutes.js';
import { initDB } from '../backend/src/db/database.js';

dotenv.config();

const app = express();

// Initialize DB
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Mount API routes without /api prefix
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

// Health check endpoint
app.get(['/api/health', '/health', '/'], (req, res) => {
  res.json({
    status: 'healthy',
    app: 'SmartTrack CRM API (Vercel Serverless)',
    timestamp: new Date().toISOString()
  });
});

export default app;
