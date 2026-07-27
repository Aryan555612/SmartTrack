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

// Path normalizer middleware for Vercel Serverless Function routing
app.use((req, res, next) => {
  let url = req.url;
  if (url.startsWith('/api')) {
    url = url.substring(4);
  }
  if (!url || !url.startsWith('/')) {
    url = '/' + url;
  }
  req.url = url;
  next();
});

// Mounted Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoints
app.get(['/health', '/api/health', '/'], (req, res) => {
  res.json({
    status: 'healthy',
    app: 'SmartTrack CRM API (Vercel Serverless)',
    timestamp: new Date().toISOString()
  });
});

export default app;
