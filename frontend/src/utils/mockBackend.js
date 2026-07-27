// Mock Backend Engine for Seamless Client-Side Fallback on Vercel
// Supports unique login & dashboard for all 15 employees (David, James, Maria, Alex, Daniel, etc.)

const MALE_OWNER_AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80';

// Exact 15 Employees from Photo 4
const PHOTO_EMPLOYEES = [
  { id: "usr_emp_1", employeeId: "EMP-101", name: "Alex Rivera", email: "alex@smarttrack.com", role: "employee", title: "Senior Frontend Engineer", department: "Development", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 3, efficiencyRate: 75, status: "On Track" },
  { id: "usr_emp_2", employeeId: "EMP-102", name: "David Chen", email: "david@smarttrack.com", role: "employee", title: "Lead Backend Developer", department: "Development", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", tasksAssigned: 5, tasksCompleted: 5, efficiencyRate: 100, status: "On Track" },
  { id: "usr_emp_3", employeeId: "EMP-103", name: "Omar Al-Fayed", email: "omar@smarttrack.com", role: "employee", title: "DevOps & Infrastructure", department: "Development", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 1, efficiencyRate: 25, status: "Behind", hasAlert: true, alertReason: "Attention needed: Omar" },
  { id: "usr_emp_4", employeeId: "EMP-104", name: "Elena Rostova", email: "elena@smarttrack.com", role: "employee", title: "UI/UX Product Designer", department: "Development", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", tasksAssigned: 5, tasksCompleted: 4, efficiencyRate: 80, status: "On Track" },
  { id: "usr_emp_5", employeeId: "EMP-105", name: "Rohan Sharma", email: "rohan@smarttrack.com", role: "employee", title: "QA & Automation Lead", department: "Development", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 3, efficiencyRate: 75, status: "On Track" },
  { id: "usr_emp_6", employeeId: "EMP-106", name: "Priya Patel", email: "priya@smarttrack.com", role: "employee", title: "Full Stack Engineer", department: "Development", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", tasksAssigned: 3, tasksCompleted: 1, efficiencyRate: 33, status: "Behind", hasAlert: true, alertReason: "Attention needed: Priya" },
  
  { id: "usr_emp_7", employeeId: "EMP-107", name: "James Wilson", email: "james@smarttrack.com", role: "employee", title: "Enterprise Sales Director", department: "Sales", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", tasksAssigned: 5, tasksCompleted: 5, efficiencyRate: 100, status: "On Track" },
  { id: "usr_emp_8", employeeId: "EMP-108", name: "Ananya Roy", email: "ananya@smarttrack.com", role: "employee", title: "Sales Development Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 4, efficiencyRate: 100, status: "On Track" },
  { id: "usr_emp_9", employeeId: "EMP-109", name: "Vikram Malhotra", email: "vikram@smarttrack.com", role: "employee", title: "Commercial Account Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", tasksAssigned: 5, tasksCompleted: 2, efficiencyRate: 40, status: "Behind", hasAlert: true, alertReason: "Attention needed: Vikram" },
  { id: "usr_emp_10", employeeId: "EMP-110", name: "Marcus Vance", email: "marcus@smarttrack.com", role: "employee", title: "Inbound Pipeline Lead", department: "Sales", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 3, efficiencyRate: 75, status: "On Track" },
  { id: "usr_emp_11", employeeId: "EMP-111", name: "Sameer Khan", email: "sameer@smarttrack.com", role: "employee", title: "Outbound Sales Rep", department: "Sales", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", tasksAssigned: 3, tasksCompleted: 1, efficiencyRate: 33, status: "Behind", hasAlert: true, alertReason: "Attention needed: Sameer" },
  
  { id: "usr_emp_12", employeeId: "EMP-112", name: "Maria Garcia", email: "maria@smarttrack.com", role: "employee", title: "Customer Success Lead", department: "Support", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", tasksAssigned: 5, tasksCompleted: 5, efficiencyRate: 100, status: "On Track" },
  { id: "usr_emp_13", employeeId: "EMP-113", name: "Kevin Zhang", email: "kevin@smarttrack.com", role: "employee", title: "Technical Support Engineer", department: "Support", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 3, efficiencyRate: 75, status: "On Track" },
  { id: "usr_emp_14", employeeId: "EMP-114", name: "Neha Gupta", email: "neha@smarttrack.com", role: "employee", title: "Support Operations Specialist", department: "Support", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 1, efficiencyRate: 25, status: "Behind", hasAlert: true, alertReason: "Attention needed: Neha" },
  { id: "usr_emp_15", employeeId: "EMP-115", name: "Daniel Martinez", email: "daniel@smarttrack.com", role: "employee", title: "Tier-2 Support Specialist", department: "Support", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", tasksAssigned: 4, tasksCompleted: 4, efficiencyRate: 100, status: "On Track" }
];

export async function handleMockApi(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  const createRes = (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });

  // 1. POST /api/auth/login (Smart matching for each employee)
  if (endpoint.includes('/auth/login') && method === 'POST') {
    const { email, role } = body;
    const inputEmail = (email || '').toLowerCase().trim();
    const inputPrefix = inputEmail.split('@')[0].replace(/[^a-z0-9]/g, '');

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

    // Match exact email OR email prefix OR name OR employee ID
    const emp = PHOTO_EMPLOYEES.find(e => e.email.toLowerCase() === inputEmail)
      || PHOTO_EMPLOYEES.find(e => e.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(inputPrefix))
      || PHOTO_EMPLOYEES.find(e => e.employeeId.toLowerCase() === (body.employeeId || '').toLowerCase())
      || PHOTO_EMPLOYEES[0];

    return createRes({ token: `mock_token_emp_${Date.now()}`, user: emp });
  }

  // 2. POST /api/auth/register
  if (endpoint.includes('/auth/register') && method === 'POST') {
    const newUser = {
      id: body.role === 'owner' ? `usr_owner_${Date.now()}` : `usr_emp_${Date.now()}`,
      employeeId: body.role === 'owner' ? "OWN-002" : `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name || "User",
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
    const activeAlerts = [
      { id: "usr_emp_3", employeeId: "EMP-103", name: "Omar Al-Fayed", department: "Development", efficiencyRate: 25, message: "Attention needed: Omar", reason: "Efficiency dropped to 25% (< 40% threshold).", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", fullUser: PHOTO_EMPLOYEES[2] },
      { id: "usr_emp_6", employeeId: "EMP-106", name: "Priya Patel", department: "Development", efficiencyRate: 33, message: "Attention needed: Priya", reason: "Efficiency dropped to 33% (< 40% threshold).", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", fullUser: PHOTO_EMPLOYEES[5] },
      { id: "usr_emp_9", employeeId: "EMP-109", name: "Vikram Malhotra", department: "Sales", efficiencyRate: 40, message: "Attention needed: Vikram", reason: "Efficiency dropped to 40% (< 50% threshold).", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", fullUser: PHOTO_EMPLOYEES[8] },
      { id: "usr_emp_11", employeeId: "EMP-111", name: "Sameer Khan", department: "Sales", efficiencyRate: 33, message: "Attention needed: Sameer", reason: "Efficiency dropped to 33% (< 40% threshold).", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", fullUser: PHOTO_EMPLOYEES[10] },
      { id: "usr_emp_14", employeeId: "EMP-114", name: "Neha Gupta", department: "Support", efficiencyRate: 25, message: "Attention needed: Neha", reason: "Efficiency dropped to 25% (< 40% threshold).", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80", fullUser: PHOTO_EMPLOYEES[13] }
    ];

    const top10Completed = [
      { name: 'David', fullId: 'EMP-102', tasksCompleted: 5, tasksAssigned: 5, department: 'Development' },
      { name: 'James', fullId: 'EMP-107', tasksCompleted: 5, tasksAssigned: 5, department: 'Sales' },
      { name: 'Maria', fullId: 'EMP-112', tasksCompleted: 5, tasksAssigned: 5, department: 'Support' },
      { name: 'Elena', fullId: 'EMP-104', tasksCompleted: 4, tasksAssigned: 5, department: 'Development' },
      { name: 'Ananya', fullId: 'EMP-108', tasksCompleted: 4, tasksAssigned: 4, department: 'Sales' },
      { name: 'Daniel', fullId: 'EMP-115', tasksCompleted: 4, tasksAssigned: 4, department: 'Support' },
      { name: 'Alex', fullId: 'EMP-101', tasksCompleted: 3, tasksAssigned: 4, department: 'Development' },
      { name: 'Rohan', fullId: 'EMP-105', tasksCompleted: 3, tasksAssigned: 4, department: 'Development' },
      { name: 'Marcus', fullId: 'EMP-110', tasksCompleted: 3, tasksAssigned: 4, department: 'Sales' },
      { name: 'Kevin', fullId: 'EMP-113', tasksCompleted: 3, tasksAssigned: 4, department: 'Support' }
    ];

    const departmentDistribution = [
      { name: "Development", completed: 17, assigned: 25 },
      { name: "Sales", completed: 15, assigned: 21 },
      { name: "Support", completed: 13, assigned: 17 }
    ];

    const weeklyTrend = [
      { week: 'Week 1', completed: 14, target: 12 },
      { week: 'Week 2', completed: 18, target: 15 },
      { week: 'Week 3', completed: 22, target: 20 },
      { week: 'Week 4', completed: 45, target: 25 }
    ];

    const analyticsData = {
      company: "Patel PVT LTD",
      kpis: {
        totalEmployees: 15,
        totalTasksCompletedToday: 10,
        avgEfficiency: 69,
        alertCount: 5,
        totalAssignedTasks: 63,
        totalCompletedTasks: 45
      },
      activeAlerts,
      top10Completed,
      departmentDistribution,
      weeklyTrend,
      leaderboards: {
        topPerformers: PHOTO_EMPLOYEES.filter(e => e.efficiencyRate >= 80).slice(0, 3),
        needsAttention: PHOTO_EMPLOYEES.filter(e => e.hasAlert).slice(0, 3)
      },
      employees: PHOTO_EMPLOYEES
    };

    return createRes(analyticsData);
  }

  // 4. GET /api/tasks (Tailored tasks per employee)
  if (endpoint.includes('/tasks')) {
    // Extract userId from endpoint query parameter if present
    const urlObj = new URL(endpoint, 'http://localhost');
    const targetUserId = urlObj.searchParams.get('userId') || 'usr_emp_2';
    const currentEmp = PHOTO_EMPLOYEES.find(e => e.id === targetUserId) || PHOTO_EMPLOYEES[1];

    const todayStr = new Date().toISOString().split('T')[0];

    const generatedTasks = Array.from({ length: currentEmp.tasksAssigned }).map((_, i) => {
      const isDone = i < currentEmp.tasksCompleted;
      return {
        id: `tsk_${currentEmp.employeeId}_${i + 1}`,
        userId: currentEmp.id,
        userName: currentEmp.name,
        title: `${currentEmp.department} Priority Task #${i + 1}`,
        category: currentEmp.department === 'Sales' ? 'Sales' : currentEmp.department === 'Support' ? 'Support' : 'Development',
        priority: i === 0 ? 'High' : 'Medium',
        status: isDone ? 'Completed' : (i === currentEmp.tasksCompleted ? 'In Progress' : 'Pending'),
        loggedHours: isDone ? 4.0 : (i === currentEmp.tasksCompleted ? 2.0 : 0.0),
        date: todayStr,
        rating: isDone ? 5.0 : null,
        feedback: isDone ? "Task reviewed and verified by Owner." : null
      };
    });

    return createRes(generatedTasks);
  }

  // 5. POST /api/tasks (Assign Task)
  if (endpoint.includes('/tasks') && method === 'POST') {
    return createRes({ success: true, message: "Task assigned successfully!", task: { id: `tsk_${Date.now()}`, ...body } }, 201);
  }

  // 6. GET /api/messages
  if (endpoint.includes('/messages')) {
    const urlObj = new URL(endpoint, 'http://localhost');
    const targetUserId = urlObj.searchParams.get('userId');
    const currentEmp = PHOTO_EMPLOYEES.find(e => e.id === targetUserId);

    const sampleMessages = currentEmp && currentEmp.hasAlert ? [
      {
        id: `msg_alert_${Date.now()}`,
        fromUserName: "Aryan Patel (CEO)",
        title: `Performance Notice for ${currentEmp.name}`,
        message: `Hi ${currentEmp.name.split(' ')[0]}, your task efficiency rate is currently ${currentEmp.efficiencyRate}%. Please update your pending tasks today.`,
        type: "warning",
        date: new Date().toISOString().split('T')[0],
        read: false
      }
    ] : [];

    return createRes(sampleMessages);
  }

  // 7. POST /api/messages (Send Alert)
  if (endpoint.includes('/messages') && method === 'POST') {
    return createRes({ success: true, message: "Alert sent to employee successfully!", notification: { id: `msg_${Date.now()}`, ...body } }, 201);
  }

  return createRes({ success: true, message: "Operation completed." });
}
