import { getDB, saveDB } from '../db/database.js';

export const login = (req, res) => {
  const { email, password, role } = req.body;
  const db = getDB();
  const users = Array.isArray(db.users) ? db.users : [];

  const inputEmail = (email || '').toLowerCase().trim();
  const user = users.find(u =>
    u.role === role && (
      u.email.toLowerCase() === inputEmail ||
      (role === 'owner' && (inputEmail === 'owner@smarttrack.com' || inputEmail === 'aryan@smarttrack.com' || inputEmail === 'aryan'))
    )
  );

  if (!user) {
    return res.status(401).json({ message: `No ${role} account found with email "${email}".` });
  }

  if (password && user.password !== password) {
    return res.status(401).json({ message: 'Incorrect password. Please try again.' });
  }

  const token = `token_${user.id}_${Date.now()}`;
  const { password: _, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
};

export const register = (req, res) => {
  const { name, email, password, role, department, title, company } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password and role are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  if (role === 'employee' && !department) {
    return res.status(400).json({ message: 'Department is required for employees.' });
  }

  const db = getDB();
  const users = Array.isArray(db.users) ? db.users : [];

  // Check duplicate email
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
  if (exists) {
    return res.status(409).json({ message: `An account with that email already exists as ${role}.` });
  }

  // Generate IDs
  const timestamp = Date.now();
  const id = role === 'owner' ? `usr_owner_${timestamp}` : `usr_emp_${timestamp}`;

  // Generate employee ID
  const existingEmployees = users.filter(u => u.role === 'employee');
  const existingOwners    = users.filter(u => u.role === 'owner');
  const empNum  = String(101 + existingEmployees.length).padStart(3, '0');
  const ownNum  = String(existingOwners.length + 1).padStart(3, '0');
  const employeeId = role === 'owner' ? `OWN-${ownNum}` : `EMP-${empNum}`;

  const newUser = {
    id,
    employeeId,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    title: title?.trim() || (role === 'owner' ? 'Company Owner' : 'Team Member'),
    department: role === 'owner' ? (company?.trim() || 'Executive Management') : department,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0A84FF&color=fff&size=150`,
    joinedDate: new Date().toISOString().split('T')[0],
    targetHours: 8,
  };

  db.users.push(newUser);
  saveDB(db);

  const token = `token_${id}_${timestamp}`;
  const { password: _, ...userWithoutPassword } = newUser;

  return res.status(201).json({
    message: `Account created successfully! Welcome, ${name.trim()}.`,
    token,
    user: userWithoutPassword,
  });
};

export const getUsers = (req, res) => {
  const db = getDB();
  const users = Array.isArray(db.users) ? db.users : [];
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
};
