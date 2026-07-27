import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { initDB } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Root Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'SmartTrack CRM API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 SmartTrack CRM Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
