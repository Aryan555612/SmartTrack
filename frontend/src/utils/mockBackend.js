// Mock Backend Engine for Seamless Client-Side Fallback on Vercel

const MALE_OWNER_AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80';

const DEFAULT_EMPLOYEES = [
  { id: "usr_emp_1", employeeId: "EMP-101", name: "Alex Rivera", email: "alex@smarttrack.com", role: "employee", title: "Senior Frontend Engineer", department: "Development", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", tasksCompleted: 14, tasksAssigned: 15, totalHours: 42, efficiencyRate: 93, status: "On Track" },
  { id: "usr_emp_2", employeeId: "EMP-102", name: "Sarah Chen", email: "sarah@smarttrack.com", role: "employee", title: "Lead Backend Developer", department: "Development", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", tasksCompleted: 18, tasksAssigned: 19, totalHours: 45, efficiencyRate: 95, status: "On Track" },
  { id: "usr_emp_3", employeeId: "EMP-103", name: "Omar Al-Fayed", email: "omar@smarttrack.com", role: "employee", title: "DevOps & Infrastructure", department: "Development", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", tasksCompleted: 2, tasksAssigned: 8, totalHours: 12, efficiencyRate: 25, status: "Needs Attention", hasAlert: true, alertReason: "Low task efficiency (25%)" },
  { id: "usr_emp_4", employeeId: "EMP-104", name: "Elena Rostova", email: "elena@smarttrack.com", role: "employee", title: "UI/UX Product Designer", department: "Development", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", tasksCompleted: 11, tasksAssigned: 12, totalHours: 36, efficiencyRate: 91, status: "On Track" },
  { id: "usr_emp_5", employeeId: "EMP-105", name: "Marcus Vance", email: "marcus@smarttrack.com", role: "employee", title: "QA & Automation Specialist", department: "Development", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", tasksCompleted: 13, tasksAssigned: 14, totalHours: 39, efficiencyRate: 92, status: "On Track" },
  { id: "usr_emp_6", employeeId: "EMP-106", name: "Priya Patel", email: "priya@smarttrack.com", role: "employee", title: "Full Stack Engineer", department: "Development", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", tasksCompleted: 5, tasksAssigned: 11, totalHours: 20, efficiencyRate: 45, status: "Needs Attention", hasAlert: true, alertReason: "Low efficiency (45%)" },
  { id: "usr_emp_7", employeeId: "EMP-201", name: "James Wilson", email: "james@smarttrack.com", role: "employee", title: "Enterprise Account Executive", department: "Sales", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", tasksCompleted: 22, tasksAssigned: 22, totalHours: 48, efficiencyRate: 100, status: "On Track" },
  { id: "usr_emp_8", employeeId: "EMP-202", name: "Aisha Kamara", email: "aisha@smarttrack.com", role: "employee", title: "Sales Development Rep", department: "Sales", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80", tasksCompleted: 16, tasksAssigned: 17, totalHours: 40, efficiencyRate: 94, status: "On Track" },
  { id: "usr_emp_9", employeeId: "EMP-203", name: "Vikram Malhotra", email: "vikram@smarttrack.com", role: "employee", title: "Commercial Account Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", tasksCompleted: 4, tasksAssigned: 10, totalHours: 18, efficiencyRate: 40, status: "Needs Attention", hasAlert: true, alertReason: "Critical sales quota gap" },
  { id: "usr_emp_10", employeeId: "EMP-204", name: "Chloe Bennett", email: "chloe@smarttrack.com", role: "employee", title: "Inbound Pipeline Manager", department: "Sales", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", tasksCompleted: 15, tasksAssigned: 16, totalHours: 38, efficiencyRate: 93, status: "On Track" },
  { id: "usr_emp_11", employeeId: "EMP-205", name: "Sameer Khan", email: "sameer@smarttrack.com", role: "employee", title: "Outbound Growth Specialist", department: "Sales", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", tasksCompleted: 3, tasksAssigned: 9, totalHours: 14, efficiencyRate: 33, status: "Needs Attention", hasAlert: true, alertReason: "Low task efficiency (33%)" },
  { id: "usr_emp_12", employeeId: "EMP-301", name: "David Kim", email: "david@smarttrack.com", role: "employee", title: "Customer Success Lead", department: "Support", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", tasksCompleted: 19, tasksAssigned: 20, totalHours: 44, efficiencyRate: 95, status: "On Track" },
  { id: "usr_emp_13", employeeId: "EMP-302", name: "Maria Garcia", email: "maria@smarttrack.com", role: "employee", title: "Technical Support Engineer", department: "Support", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", tasksCompleted: 17, tasksAssigned: 18, totalHours: 41, efficiencyRate: 94, status: "On Track" },
  { id: "usr_emp_14", employeeId: "EMP-303", name: "Lucas Santos", email: "lucas@smarttrack.com", role: "employee", title: "Tier-2 Escalations Lead", department: "Support", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", tasksCompleted: 12, tasksAssigned: 13, totalHours: 35, efficiencyRate: 92, status: "On Track" },
  { id: "usr_emp_15", employeeId: "EMP-304", name: "Neha Gupta", email: "neha@smarttrack.com", role: "employee", title: "Support Operations Specialist", department: "Support", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80", tasksCompleted: 2, tasksAssigned: 7, totalHours: 10, efficiencyRate: 28, status: "Needs Attention", hasAlert: true, alertReason: "Low ticket resolution rate (28%)" }
];

export async function handleMockApi(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Mock Response Helper
  const createRes = (data, status = 200) => {
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
    };
  };

  // 1. POST /api/auth/login
  if (endpoint.includes('/auth/login') && method === 'POST') {
    const { email, role } = body;
    const inputEmail = (email || '').toLowerCase().trim();

    if (role === 'owner' || inputEmail.includes('owner') || inputEmail.includes('aryan')) {
      const ownerUser = {
        id: "usr_owner_1",
        employeeId: "OWN-001",
        name: "Aryan Patel",
        email: "owner@smarttrack.com",
        role: "owner",
        title: "CEO & Founder",
        company: "Patel PVT LTD",
        department: "Executive Management",
        avatar: MALE_OWNER_AVATAR,
      };
      return createRes({ token: `mock_token_owner_${Date.now()}`, user: ownerUser });
    }

    // Employee Sign In
    const emp = DEFAULT_EMPLOYEES.find(e => e.email.toLowerCase() === inputEmail) || {
      id: "usr_emp_1",
      employeeId: "EMP-101",
      name: body.name || "Alex Rivera",
      email: inputEmail || "alex@smarttrack.com",
      role: "employee",
      title: "Senior Frontend Engineer",
      department: "Development",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };

    return createRes({ token: `mock_token_emp_${Date.now()}`, user: emp });
  }

  // 2. POST /api/auth/register
  if (endpoint.includes('/auth/register') && method === 'POST') {
    const newUser = {
      id: body.role === 'owner' ? `usr_owner_${Date.now()}` : `usr_emp_${Date.now()}`,
      employeeId: body.role === 'owner' ? "OWN-002" : "EMP-116",
      name: body.name || (body.role === 'owner' ? "Aryan Patel" : "New Employee"),
      email: body.email || "user@smarttrack.com",
      role: body.role || "employee",
      title: body.title || (body.role === 'owner' ? "CEO & Founder" : "Team Member"),
      company: body.company || "Patel PVT LTD",
      department: body.department || "Development",
      avatar: body.role === 'owner' ? MALE_OWNER_AVATAR : `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name || 'User')}&background=0A84FF&color=fff`,
    };
    return createRes({ message: "Registration successful!", token: `mock_token_reg_${Date.now()}`, user: newUser });
  }

  // 3. GET /api/users/analytics
  if (endpoint.includes('/users/analytics')) {
    const analyticsData = {
      companyName: "Patel PVT LTD",
      owner: {
        id: "usr_owner_1",
        name: "Aryan Patel",
        title: "CEO & Founder",
        company: "Patel PVT LTD",
        avatar: MALE_OWNER_AVATAR,
      },
      summary: {
        totalEmployees: 15,
        avgEfficiency: 82.4,
        totalTasksAssigned: 206,
        totalTasksCompleted: 168,
        activeAlertsCount: 5,
        onTrackCount: 10,
        needsAttentionCount: 5,
      },
      employees: DEFAULT_EMPLOYEES,
      leaderboards: {
        topPerformers: DEFAULT_EMPLOYEES.filter(e => e.efficiencyRate >= 90).slice(0, 5),
        needsAttention: DEFAULT_EMPLOYEES.filter(e => e.efficiencyRate < 50),
      },
      departmentEfficiency: [
        { name: "Development", efficiency: 86, color: "#0A84FF" },
        { name: "Sales", efficiency: 84, color: "#30D158" },
        { name: "Support", efficiency: 77, color: "#FF9F0A" },
      ],
    };
    return createRes(analyticsData);
  }

  // 4. GET /api/tasks
  if (endpoint.includes('/tasks')) {
    const sampleTasks = [
      { id: "tsk_1", title: "Implement OAuth2 Authentication Flow", category: "Development", priority: "High", status: "Completed", loggedHours: 4, date: new Date().toISOString().split('T')[0], rating: 5, feedback: "Excellent code quality!" },
      { id: "tsk_2", title: "Optimize PostgreSQL Query Indexing", category: "Development", priority: "Medium", status: "In Progress", loggedHours: 3, date: new Date().toISOString().split('T')[0] },
      { id: "tsk_3", title: "Close Enterprise Sales Renewal ($50k)", category: "Sales", priority: "High", status: "Completed", loggedHours: 5, date: new Date().toISOString().split('T')[0], rating: 5, feedback: "Great work closing the renewal!" }
    ];
    return createRes(sampleTasks);
  }

  // 5. POST /api/tasks (Assign Task)
  if (endpoint.includes('/tasks') && method === 'POST') {
    return createRes({ success: true, message: "Task assigned successfully!", task: { id: `tsk_${Date.now()}`, ...body } }, 201);
  }

  // 6. GET /api/messages
  if (endpoint.includes('/messages')) {
    const sampleMessages = [
      {
        id: "msg_1",
        fromUserName: "Aryan Patel (CEO)",
        title: "Performance Alert: Pending Tasks",
        message: "Hi team, please ensure all high-priority daily tasks are completed by EOD.",
        type: "warning",
        date: new Date().toISOString().split('T')[0],
        read: false
      }
    ];
    return createRes(sampleMessages);
  }

  // 7. POST /api/messages (Send Alert)
  if (endpoint.includes('/messages') && method === 'POST') {
    return createRes({ success: true, message: "Alert sent to employee successfully!", notification: { id: `msg_${Date.now()}`, ...body } }, 201);
  }

  // Generic success fallback
  return createRes({ success: true, message: "Operation completed." });
}
