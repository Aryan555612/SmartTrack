import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL ? path.join('/tmp', 'db.json') : path.join(__dirname, 'db.json');

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 259200000).toISOString().split('T')[0];

const defaultData = {
  company: "Patel PVT LTD",
  users: [
    {
      id: "usr_owner_1",
      employeeId: "OWN-001",
      name: "Aryan Patel",
      email: "owner@smarttrack.com",
      password: "password123",
      role: "owner",
      title: "CEO & Founder",
      department: "Executive Management",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      joinedDate: "2023-01-15"
    },
    // --- DEVELOPMENT DEPARTMENT (6 Employees) ---
    { id: "usr_emp_1", employeeId: "EMP-101", name: "Alex Rivera", email: "alex@smarttrack.com", password: "password123", role: "employee", title: "Senior Frontend Engineer", department: "Development", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-03-01" },
    { id: "usr_emp_2", employeeId: "EMP-102", name: "David Chen", email: "david@smarttrack.com", password: "password123", role: "employee", title: "Lead Backend Developer", department: "Development", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-01-10" },
    { id: "usr_emp_3", employeeId: "EMP-103", name: "Omar Al-Fayed", email: "omar@smarttrack.com", password: "password123", role: "employee", title: "DevOps & Infrastructure", department: "Development", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-01-25" },
    { id: "usr_emp_4", employeeId: "EMP-104", name: "Elena Rostova", email: "elena@smarttrack.com", password: "password123", role: "employee", title: "UI/UX Product Designer", department: "Development", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-02-20" },
    { id: "usr_emp_5", employeeId: "EMP-105", name: "Rohan Sharma", email: "rohan@smarttrack.com", password: "password123", role: "employee", title: "QA & Automation Lead", department: "Development", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-04-05" },
    { id: "usr_emp_6", employeeId: "EMP-106", name: "Priya Patel", email: "priya@smarttrack.com", password: "password123", role: "employee", title: "Full Stack Engineer", department: "Development", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-05-12" },

    // --- SALES DEPARTMENT (5 Employees) ---
    { id: "usr_emp_7", employeeId: "EMP-107", name: "James Wilson", email: "james@smarttrack.com", password: "password123", role: "employee", title: "Enterprise Sales Director", department: "Sales", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-03-15" },
    { id: "usr_emp_8", employeeId: "EMP-108", name: "Ananya Roy", email: "ananya@smarttrack.com", password: "password123", role: "employee", title: "Sales Development Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-02-01" },
    { id: "usr_emp_9", employeeId: "EMP-109", name: "Vikram Malhotra", email: "vikram@smarttrack.com", password: "password123", role: "employee", title: "Commercial Account Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-04-18" },
    { id: "usr_emp_10", employeeId: "EMP-110", name: "Marcus Vance", email: "marcus@smarttrack.com", password: "password123", role: "employee", title: "Inbound Pipeline Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-04-12" },
    { id: "usr_emp_11", employeeId: "EMP-111", name: "Sameer Khan", email: "sameer@smarttrack.com", password: "password123", role: "employee", title: "Outbound Sales Rep", department: "Sales", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-06-10" },

    // --- SUPPORT DEPARTMENT (4 Employees) ---
    { id: "usr_emp_12", employeeId: "EMP-112", name: "Maria Garcia", email: "maria@smarttrack.com", password: "password123", role: "employee", title: "Customer Success Lead", department: "Support", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-06-01" },
    { id: "usr_emp_13", employeeId: "EMP-113", name: "Kevin Zhang", email: "kevin@smarttrack.com", password: "password123", role: "employee", title: "Technical Support Engineer", department: "Support", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-03-20" },
    { id: "usr_emp_14", employeeId: "EMP-114", name: "Neha Gupta", email: "neha@smarttrack.com", password: "password123", role: "employee", title: "Support Operations Specialist", department: "Support", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-05-15" },
    { id: "usr_emp_15", employeeId: "EMP-115", name: "Daniel Martinez", email: "daniel@smarttrack.com", password: "password123", role: "employee", title: "Tier-2 Support Specialist", department: "Support", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", joinedDate: "2024-02-10" }
  ],
  tasks: [
    // Pre-seeded tasks for Photo 4 stats
    { id: "tsk_101", userId: "usr_emp_1", userName: "Alex Rivera", title: "Refactor CRM Dashboard Component", category: "Development", priority: "High", status: "Completed", loggedHours: 3.5, date: today },
    { id: "tsk_102", userId: "usr_emp_1", userName: "Alex Rivera", title: "Fix Auth Cookie Persistence Bug", category: "Bug Fix", priority: "Medium", status: "Completed", loggedHours: 2.0, date: yesterday },
    { id: "tsk_103", userId: "usr_emp_1", userName: "Alex Rivera", title: "Build Owner Table View", category: "Development", priority: "High", status: "Completed", loggedHours: 4.5, date: twoDaysAgo },
    { id: "tsk_104", userId: "usr_emp_1", userName: "Alex Rivera", title: "Code Review for EMP-104", category: "Development", priority: "Low", status: "In Progress", loggedHours: 2.5, date: today }
  ]
};

let inMemoryDB = null;

export const initDB = (force = true) => {
  if (process.env.VERCEL) {
    inMemoryDB = JSON.parse(JSON.stringify(defaultData));
    return;
  }
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  } catch (e) {
    inMemoryDB = JSON.parse(JSON.stringify(defaultData));
  }
};

export const getDB = () => {
  if (process.env.VERCEL) {
    if (!inMemoryDB) inMemoryDB = JSON.parse(JSON.stringify(defaultData));
    return inMemoryDB;
  }
  initDB(true);
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    if (!inMemoryDB) inMemoryDB = JSON.parse(JSON.stringify(defaultData));
    return inMemoryDB;
  }
};

export const saveDB = (data) => {
  if (process.env.VERCEL) {
    inMemoryDB = data;
    return;
  }
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    inMemoryDB = data;
  }
};
