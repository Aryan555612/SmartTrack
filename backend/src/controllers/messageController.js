import { getDB, saveDB } from '../db/database.js';

export const getMessages = (req, res) => {
  const { userId, role } = req.query;
  const db = getDB();
  let messages = Array.isArray(db.messages) ? [...db.messages] : [];

  if (role === 'employee' && userId) {
    messages = messages.filter(m => m.toUserId === userId);
  }

  messages.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  res.json(messages);
};

export const sendMessage = (req, res) => {
  const { fromUserId, fromUserName, toUserId, toUserName, title, message, type } = req.body;

  if (!toUserId || !message || !title) {
    return res.status(400).json({ message: 'Target employee, title, and message content are required.' });
  }

  const db = getDB();
  if (!Array.isArray(db.messages)) {
    db.messages = [];
  }

  const newMessage = {
    id: `msg_${Date.now()}`,
    fromUserId: fromUserId || 'usr_owner_1',
    fromUserName: fromUserName || 'Aryan Patel (CEO)',
    toUserId,
    toUserName: toUserName || 'Employee',
    title: title.trim(),
    message: message.trim(),
    type: type || 'warning',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    read: false,
  };

  db.messages.unshift(newMessage);
  saveDB(db);

  res.status(201).json(newMessage);
};

export const markMessageRead = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  if (!Array.isArray(db.messages)) db.messages = [];

  const msg = db.messages.find(m => m.id === id);
  if (msg) {
    msg.read = true;
    saveDB(db);
  }

  res.json({ success: true, message: msg });
};
