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

// XYZ Pvt Ltd - 15 Employees across 3 Departments (Development, Sales, Support) + 1 Owner
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
    {
      id: "usr_emp_1",
      employeeId: "EMP-101",
      name: "Alex Rivera",
      email: "alex@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Senior Frontend Engineer",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-03-01",
      targetHours: 8
    },
    {
      id: "usr_emp_2",
      employeeId: "EMP-102",
      name: "David Chen",
      email: "david@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Backend Architect",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-01-10",
      targetHours: 8
    },
    {
      id: "usr_emp_3",
      employeeId: "EMP-103",
      name: "Omar Al-Fayed",
      email: "omar@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "DevOps & Cloud Specialist",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-01-25",
      targetHours: 8
    },
    {
      id: "usr_emp_4",
      employeeId: "EMP-104",
      name: "Elena Rostova",
      email: "elena@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Lead UI/UX Designer",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-02-20",
      targetHours: 8
    },
    {
      id: "usr_emp_5",
      employeeId: "EMP-105",
      name: "Rohan Sharma",
      email: "rohan@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Full Stack Engineer",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-04-05",
      targetHours: 8
    },
    {
      id: "usr_emp_6",
      employeeId: "EMP-106",
      name: "Priya Patel",
      email: "priya@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "QA Automation Lead",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-05-12",
      targetHours: 8
    },

    // --- SALES DEPARTMENT (5 Employees) ---
    {
      id: "usr_emp_7",
      employeeId: "EMP-107",
      name: "James Wilson",
      email: "james@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Enterprise Account Executive",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-03-15",
      targetHours: 8
    },
    {
      id: "usr_emp_8",
      employeeId: "EMP-108",
      name: "Ananya Roy",
      email: "ananya@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Regional Sales Manager",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-02-01",
      targetHours: 8
    },
    {
      id: "usr_emp_9",
      employeeId: "EMP-109",
      name: "Vikram Malhotra",
      email: "vikram@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Business Development Executive",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-04-18",
      targetHours: 8
    },
    {
      id: "usr_emp_10",
      employeeId: "EMP-110",
      name: "Marcus Vance",
      email: "marcus@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Growth Sales Strategist",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-04-12",
      targetHours: 8
    },
    {
      id: "usr_emp_11",
      employeeId: "EMP-111",
      name: "Sameer Khan",
      email: "sameer@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Inside Sales Representative",
      department: "Sales",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-06-10",
      targetHours: 8
    },

    // --- SUPPORT DEPARTMENT (4 Employees) ---
    {
      id: "usr_emp_12",
      employeeId: "EMP-112",
      name: "Maria Garcia",
      email: "maria@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Customer Success Lead",
      department: "Support",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-06-01",
      targetHours: 8
    },
    {
      id: "usr_emp_13",
      employeeId: "EMP-113",
      name: "Kevin Zhang",
      email: "kevin@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Technical Support Specialist",
      department: "Support",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-03-20",
      targetHours: 8
    },
    {
      id: "usr_emp_14",
      employeeId: "EMP-114",
      name: "Neha Gupta",
      email: "neha@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Help Desk Specialist",
      department: "Support",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-05-15",
      targetHours: 8
    },
    {
      id: "usr_emp_15",
      employeeId: "EMP-115",
      name: "Daniel Martinez",
      email: "daniel@smarttrack.com",
      password: "password123",
      role: "employee",
      title: "Escalations Lead",
      department: "Support",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      joinedDate: "2024-02-10",
      targetHours: 8
    }
  ],

  // Pre-seeded Daily Tasks for 15 Employees to yield realistic efficiencies
  tasks: [
    // --- Alex Rivera (EMP-101: 3 completed out of 4 = 75% Efficiency) ---
    { id: "tsk_101", userId: "usr_emp_1", userName: "Alex Rivera", title: "Refactor CRM Dashboard Component", category: "Development", priority: "High", status: "Completed", loggedHours: 3.5, date: today },
    { id: "tsk_102", userId: "usr_emp_1", userName: "Alex Rivera", title: "Fix Auth Cookie Persistence Bug", category: "Bug Fix", priority: "Medium", status: "Completed", loggedHours: 2.0, date: yesterday },
    { id: "tsk_103", userId: "usr_emp_1", userName: "Alex Rivera", title: "Build Owner Table View", category: "Development", priority: "High", status: "Completed", loggedHours: 4.5, date: twoDaysAgo },
    { id: "tsk_104", userId: "usr_emp_1", userName: "Alex Rivera", title: "Code Review for EMP-104", category: "Development", priority: "Low", status: "In Progress", loggedHours: 2.5, date: today },

    // --- David Chen (EMP-102: 5 completed out of 5 = 100% Efficiency - GREEN) ---
    { id: "tsk_105", userId: "usr_emp_2", userName: "David Chen", title: "Database Query Indexing & Caching", category: "Development", priority: "High", status: "Completed", loggedHours: 4.0, date: today },
    { id: "tsk_106", userId: "usr_emp_2", userName: "David Chen", title: "Setup Redis Session Storage", category: "Development", priority: "High", status: "Completed", loggedHours: 3.0, date: yesterday },
    { id: "tsk_107", userId: "usr_emp_2", userName: "David Chen", title: "API Rate Limiter Implementation", category: "Development", priority: "Medium", status: "Completed", loggedHours: 2.5, date: twoDaysAgo },
    { id: "tsk_108", userId: "usr_emp_2", userName: "David Chen", title: "Data Migration Script", category: "Development", priority: "Medium", status: "Completed", loggedHours: 3.5, date: threeDaysAgo },
    { id: "tsk_109", userId: "usr_emp_2", userName: "David Chen", title: "Backend Unit Test Suite", category: "Development", priority: "High", status: "Completed", loggedHours: 4.0, date: threeDaysAgo },

    // --- Omar Al-Fayed (EMP-103: 1 completed out of 4 = 25% Efficiency - RED) ---
    { id: "tsk_110", userId: "usr_emp_3", userName: "Omar Al-Fayed", title: "Kubernetes Auto-Scaling Rule Fix", category: "Development", priority: "High", status: "Completed", loggedHours: 4.0, date: yesterday },
    { id: "tsk_111", userId: "usr_emp_3", userName: "Omar Al-Fayed", title: "CI/CD Pipeline Security Scan", category: "Development", priority: "Medium", status: "In Progress", loggedHours: 2.0, date: today },
    { id: "tsk_112", userId: "usr_emp_3", userName: "Omar Al-Fayed", title: "Staging Server TLS Renewal", category: "Development", priority: "High", status: "Pending", loggedHours: 0, date: today },
    { id: "tsk_113", userId: "usr_emp_3", userName: "Omar Al-Fayed", title: "Docker Base Image Upgrade", category: "Development", priority: "Low", status: "Pending", loggedHours: 0, date: today },

    // --- Elena Rostova (EMP-104: 4 completed out of 5 = 80% Efficiency - GREEN) ---
    { id: "tsk_114", userId: "usr_emp_4", userName: "Elena Rostova", title: "Design System Dark Theme Palette", category: "Design", priority: "High", status: "Completed", loggedHours: 5.0, date: today },
    { id: "tsk_115", userId: "usr_emp_4", userName: "Elena Rostova", title: "Employee Dashboard Wireframes", category: "Design", priority: "High", status: "Completed", loggedHours: 4.0, date: yesterday },
    { id: "tsk_116", userId: "usr_emp_4", userName: "Elena Rostova", title: "Owner Table Layout Prototypes", category: "Design", priority: "Medium", status: "Completed", loggedHours: 3.5, date: twoDaysAgo },
    { id: "tsk_117", userId: "usr_emp_4", userName: "Elena Rostova", title: "Icon Set Export & SVG Optimization", category: "Design", priority: "Low", status: "Completed", loggedHours: 2.0, date: threeDaysAgo },
    { id: "tsk_118", userId: "usr_emp_4", userName: "Elena Rostova", title: "Mobile Navigation Usability Testing", category: "Design", priority: "Medium", status: "In Progress", loggedHours: 1.5, date: today },

    // --- Rohan Sharma (EMP-105: 3 completed out of 4 = 75% Efficiency) ---
    { id: "tsk_119", userId: "usr_emp_5", userName: "Rohan Sharma", title: "Task Status Dropdown API Linkage", category: "Development", priority: "High", status: "Completed", loggedHours: 3.5, date: today },
    { id: "tsk_120", userId: "usr_emp_5", userName: "Rohan Sharma", title: "User Search Filter Backend Logic", category: "Development", priority: "Medium", status: "Completed", loggedHours: 4.0, date: yesterday },
    { id: "tsk_121", userId: "usr_emp_5", userName: "Rohan Sharma", title: "JSON DB Auto-Save Transaction Fix", category: "Bug Fix", priority: "High", status: "Completed", loggedHours: 3.0, date: twoDaysAgo },
    { id: "tsk_122", userId: "usr_emp_5", userName: "Rohan Sharma", title: "Export Table to CSV Feature", category: "Development", priority: "Low", status: "In Progress", loggedHours: 1.5, date: today },

    // --- Priya Patel (EMP-106: 1 completed out of 3 = 33% Efficiency - RED) ---
    { id: "tsk_123", userId: "usr_emp_6", userName: "Priya Patel", title: "End-to-End Cypress Login Test Suite", category: "Development", priority: "High", status: "Completed", loggedHours: 4.5, date: yesterday },
    { id: "tsk_124", userId: "usr_emp_6", userName: "Priya Patel", title: "Regression Test Suite Run Q3", category: "Development", priority: "High", status: "Pending", loggedHours: 1.0, date: today },
    { id: "tsk_125", userId: "usr_emp_6", userName: "Priya Patel", title: "Load Test API Under 1000 Users", category: "Development", priority: "Medium", status: "Pending", loggedHours: 0, date: today },

    // --- James Wilson (EMP-107: 5 completed out of 5 = 100% Efficiency - GREEN) ---
    { id: "tsk_126", userId: "usr_emp_7", userName: "James Wilson", title: "Enterprise Pitch Demo with TechCorp", category: "Sales", priority: "High", status: "Completed", loggedHours: 4.0, date: today },
    { id: "tsk_127", userId: "usr_emp_7", userName: "James Wilson", title: "Close Q3 Contract Renewal ($120k)", category: "Sales", priority: "High", status: "Completed", loggedHours: 3.5, date: yesterday },
    { id: "tsk_128", userId: "usr_emp_7", userName: "James Wilson", title: "Draft Proposal for Apex Solutions", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 2.5, date: twoDaysAgo },
    { id: "tsk_129", userId: "usr_emp_7", userName: "James Wilson", title: "Quarterly Sales Pipeline Review", category: "Sales", priority: "High", status: "Completed", loggedHours: 3.0, date: threeDaysAgo },
    { id: "tsk_130", userId: "usr_emp_7", userName: "James Wilson", title: "Follow-up Calls with 10 Prospects", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 3.5, date: threeDaysAgo },

    // --- Ananya Roy (EMP-108: 4 completed out of 4 = 100% Efficiency - GREEN) ---
    { id: "tsk_131", userId: "usr_emp_8", userName: "Ananya Roy", title: "Q4 Regional Sales Target Plan", category: "Sales", priority: "High", status: "Completed", loggedHours: 5.0, date: today },
    { id: "tsk_132", userId: "usr_emp_8", userName: "Ananya Roy", title: "Sales Rep Monthly KPI Assessment", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 3.5, date: yesterday },
    { id: "tsk_133", userId: "usr_emp_8", userName: "Ananya Roy", title: "Negotiate Enterprise SLA Terms", category: "Sales", priority: "High", status: "Completed", loggedHours: 4.0, date: twoDaysAgo },
    { id: "tsk_134", userId: "usr_emp_8", userName: "Ananya Roy", title: "Client Onboarding Briefing", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 2.5, date: threeDaysAgo },

    // --- Vikram Malhotra (EMP-109: 2 completed out of 5 = 40% Efficiency - RED) ---
    { id: "tsk_135", userId: "usr_emp_9", userName: "Vikram Malhotra", title: "Outbound Cold Outreach Campaign", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 4.0, date: yesterday },
    { id: "tsk_136", userId: "usr_emp_9", userName: "Vikram Malhotra", title: "Update CRM Lead Contact Details", category: "Sales", priority: "Low", status: "Completed", loggedHours: 2.0, date: twoDaysAgo },
    { id: "tsk_137", userId: "usr_emp_9", userName: "Vikram Malhotra", title: "Schedule 15 Discovery Calls", category: "Sales", priority: "High", status: "In Progress", loggedHours: 2.5, date: today },
    { id: "tsk_138", userId: "usr_emp_9", userName: "Vikram Malhotra", title: "Draft Partner Affiliate Contract", category: "Sales", priority: "Medium", status: "Pending", loggedHours: 0, date: today },
    { id: "tsk_139", userId: "usr_emp_9", userName: "Vikram Malhotra", title: "Competitor Pricing Analysis", category: "Sales", priority: "Low", status: "Pending", loggedHours: 0, date: today },

    // --- Marcus Vance (EMP-110: 3 completed out of 4 = 75% Efficiency) ---
    { id: "tsk_140", userId: "usr_emp_10", userName: "Marcus Vance", title: "Growth Marketing Campaign Q3", category: "Sales", priority: "High", status: "Completed", loggedHours: 4.5, date: today },
    { id: "tsk_141", userId: "usr_emp_10", userName: "Marcus Vance", title: "LinkedIn Lead Gen Ads Setup", category: "Sales", priority: "High", status: "Completed", loggedHours: 3.5, date: yesterday },
    { id: "tsk_142", userId: "usr_emp_10", userName: "Marcus Vance", title: "Email Newsletter Copywriting", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 2.5, date: twoDaysAgo },
    { id: "tsk_143", userId: "usr_emp_10", userName: "Marcus Vance", title: "SEO Keyword Landing Page Polish", category: "Sales", priority: "Low", status: "In Progress", loggedHours: 2.0, date: today },

    // --- Sameer Khan (EMP-111: 1 completed out of 3 = 33% Efficiency - RED) ---
    { id: "tsk_144", userId: "usr_emp_11", userName: "Sameer Khan", title: "Qualify Inbound Web Leads", category: "Sales", priority: "Medium", status: "Completed", loggedHours: 4.0, date: yesterday },
    { id: "tsk_145", userId: "usr_emp_11", userName: "Sameer Khan", title: "Send 30 Follow-Up Quotes", category: "Sales", priority: "High", status: "Pending", loggedHours: 1.0, date: today },
    { id: "tsk_146", userId: "usr_emp_11", userName: "Sameer Khan", title: "Log Deal Stages in CRM", category: "Sales", priority: "Low", status: "Pending", loggedHours: 0, date: today },

    // --- Maria Garcia (EMP-112: 5 completed out of 5 = 100% Efficiency - GREEN) ---
    { id: "tsk_147", userId: "usr_emp_12", userName: "Maria Garcia", title: "Address 25 Priority Ticket Queue", category: "Support", priority: "High", status: "Completed", loggedHours: 6.0, date: today },
    { id: "tsk_148", userId: "usr_emp_12", userName: "Maria Garcia", title: "Conduct Customer Health Checkup", category: "Support", priority: "High", status: "Completed", loggedHours: 3.5, date: yesterday },
    { id: "tsk_149", userId: "usr_emp_12", userName: "Maria Garcia", title: "Update FAQ Knowledge Base Articles", category: "Support", priority: "Medium", status: "Completed", loggedHours: 2.5, date: twoDaysAgo },
    { id: "tsk_150", userId: "usr_emp_12", userName: "Maria Garcia", title: "Client Onboarding Video Call", category: "Support", priority: "High", status: "Completed", loggedHours: 3.0, date: threeDaysAgo },
    { id: "tsk_151", userId: "usr_emp_12", userName: "Maria Garcia", title: "CSAT Feedback Score Analysis", category: "Support", priority: "Medium", status: "Completed", loggedHours: 2.0, date: threeDaysAgo },

    // --- Kevin Zhang (EMP-113: 3 completed out of 4 = 75% Efficiency) ---
    { id: "tsk_152", userId: "usr_emp_13", userName: "Kevin Zhang", title: "Debug API Webhook Failures for Client", category: "Support", priority: "High", status: "Completed", loggedHours: 4.5, date: today },
    { id: "tsk_153", userId: "usr_emp_13", userName: "Kevin Zhang", title: "Troubleshoot SSO Integration Issue", category: "Support", priority: "High", status: "Completed", loggedHours: 3.5, date: yesterday },
    { id: "tsk_154", userId: "usr_emp_13", userName: "Kevin Zhang", title: "Database Connection Timeout Triage", category: "Support", priority: "Medium", status: "Completed", loggedHours: 2.5, date: twoDaysAgo },
    { id: "tsk_155", userId: "usr_emp_13", userName: "Kevin Zhang", title: "Prepare Support Operations Metrics", category: "Support", priority: "Low", status: "In Progress", loggedHours: 1.5, date: today },

    // --- Neha Gupta (EMP-114: 1 completed out of 4 = 25% Efficiency - RED) ---
    { id: "tsk_156", userId: "usr_emp_14", userName: "Neha Gupta", title: "Reset User Password Batch Tickets", category: "Support", priority: "Low", status: "Completed", loggedHours: 3.0, date: yesterday },
    { id: "tsk_157", userId: "usr_emp_14", userName: "Neha Gupta", title: "Triage Live Chat Requests", category: "Support", priority: "High", status: "Pending", loggedHours: 1.0, date: today },
    { id: "tsk_158", userId: "usr_emp_14", userName: "Neha Gupta", title: "Draft Escalation Escalation Protocol", category: "Support", priority: "Medium", status: "Pending", loggedHours: 0, date: today },
    { id: "tsk_159", userId: "usr_emp_14", userName: "Neha Gupta", title: "Organize Support Team Shifts", category: "Support", priority: "Low", status: "Pending", loggedHours: 0, date: today },

    // --- Daniel Martinez (EMP-115: 4 completed out of 4 = 100% Efficiency - GREEN) ---
    { id: "tsk_160", userId: "usr_emp_15", userName: "Daniel Martinez", title: "Resolve Critical SLA Breach Ticket", category: "Support", priority: "High", status: "Completed", loggedHours: 4.5, date: today },
    { id: "tsk_161", userId: "usr_emp_15", userName: "Daniel Martinez", title: "Root Cause Analysis for Outage", category: "Support", priority: "High", status: "Completed", loggedHours: 4.0, date: yesterday },
    { id: "tsk_162", userId: "usr_emp_15", userName: "Daniel Martinez", title: "Executive Escalation Briefing", category: "Support", priority: "High", status: "Completed", loggedHours: 3.0, date: twoDaysAgo },
    { id: "tsk_163", userId: "usr_emp_15", userName: "Daniel Martinez", title: "Support Tier-2 Training Docs", category: "Support", priority: "Medium", status: "Completed", loggedHours: 3.5, date: threeDaysAgo }
  ]
};

let inMemoryDB = null;

// Ensure db file exists or force re-seed if user count is not 16 (15 employees + 1 owner)
export const initDB = (force = false) => {
  if (process.env.VERCEL) {
    if (!inMemoryDB || force) {
      inMemoryDB = JSON.parse(JSON.stringify(defaultData));
    }
    return;
  }
  try {
    if (force || !fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error("FS Init error, using in-memory DB:", e);
    inMemoryDB = JSON.parse(JSON.stringify(defaultData));
  }
};

export const getDB = () => {
  if (process.env.VERCEL) {
    if (!inMemoryDB) inMemoryDB = JSON.parse(JSON.stringify(defaultData));
    return inMemoryDB;
  }
  initDB();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.users || !Array.isArray(parsed.users)) {
      saveDB(defaultData);
      return defaultData;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading DB file, resetting to defaults", err);
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
