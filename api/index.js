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

// Initialize Database
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'SmartTrack CRM API (Vercel Serverless)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default app;
