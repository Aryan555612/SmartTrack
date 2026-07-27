import { getDB, saveDB } from '../db/database.js';

export const getTasks = (req, res) => {
  const { userId, role } = req.query;
  const db = getDB();

  let tasks = Array.isArray(db.tasks) ? [...db.tasks] : [];
  if (role === 'employee' && userId) {
    tasks = tasks.filter(t => t.userId === userId);
  }

  // Sort by date descending
  tasks.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  res.json(tasks);
};

export const createTask = (req, res) => {
  const { userId, userName, title, description, category, priority, date, status, loggedHours } = req.body;
  if (!title || !userId) {
    return res.status(400).json({ message: 'Task title and userId are required.' });
  }

  const db = getDB();
  if (!Array.isArray(db.tasks)) {
    db.tasks = [];
  }

  const newTask = {
    id: `tsk_${Date.now()}`,
    userId,
    userName: userName || 'Employee',
    title,
    description: description || '',
    category: category || 'General',
    priority: priority || 'Medium',
    status: status || 'In Progress',
    loggedHours: Number(loggedHours) || 0,
    date: date || new Date().toISOString().split('T')[0],
    dueDate: date || new Date().toISOString().split('T')[0],
    feedback: '',
    rating: null
  };

  db.tasks.unshift(newTask);
  saveDB(db);

  res.status(201).json(newTask);
};

export const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status, loggedHours, rating, feedback } = req.body;

  const db = getDB();
  if (!Array.isArray(db.tasks)) db.tasks = [];

  const taskIndex = db.tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const task = db.tasks[taskIndex];

  if (status !== undefined) task.status = status;
  if (loggedHours !== undefined) task.loggedHours = Number(loggedHours);
  if (rating !== undefined) task.rating = Number(rating);
  if (feedback !== undefined) task.feedback = feedback;

  db.tasks[taskIndex] = task;
  saveDB(db);

  res.json(task);
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  if (!Array.isArray(db.tasks)) db.tasks = [];
  
  db.tasks = db.tasks.filter(t => t.id !== id);
  saveDB(db);

  res.json({ message: 'Task deleted successfully.' });
};
