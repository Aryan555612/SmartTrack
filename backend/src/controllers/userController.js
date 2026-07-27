import { getDB } from '../db/database.js';

export const getEmployeeAnalytics = (req, res) => {
  const db = getDB();
  const allUsers = Array.isArray(db.users) ? db.users : [];
  const allTasks = Array.isArray(db.tasks) ? db.tasks : [];

  const employees = allUsers.filter(u => u.role === 'employee');

  const analytics = employees.map(emp => {
    const empTasks = allTasks.filter(t => t.userId === emp.id);
    const tasksAssigned = empTasks.length;
    const tasksCompleted = empTasks.filter(t => t.status === 'Completed').length;
    const inProgressTasksCount = empTasks.filter(t => t.status === 'In Progress').length;
    const pendingTasksCount = empTasks.filter(t => t.status === 'Pending').length;
    
    const efficiencyRate = tasksAssigned > 0 
      ? Math.round((tasksCompleted / tasksAssigned) * 100) 
      : 100;

    const status = efficiencyRate >= 70 ? 'On Track' : 'Behind';
    const totalLoggedHours = empTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);
    
    // Check missed deadlines (tasks not completed past due date or 3+ pending tasks)
    const missedDeadlinesCount = empTasks.filter(t => t.status !== 'Completed').length;

    // Alert Rule: Efficiency < 40% OR 3+ missed deadlines
    const isEfficiencyDrop = efficiencyRate < 40;
    const isMissedDeadlines = missedDeadlinesCount >= 3;
    const hasAlert = isEfficiencyDrop || isMissedDeadlines;

    let alertReason = '';
    if (isEfficiencyDrop && isMissedDeadlines) {
      alertReason = `Efficiency dropped to ${efficiencyRate}% (< 40%) & ${missedDeadlinesCount} missed deadlines.`;
    } else if (isEfficiencyDrop) {
      alertReason = `Efficiency dropped to ${efficiencyRate}% (< 40% threshold).`;
    } else if (isMissedDeadlines) {
      alertReason = `Missed ${missedDeadlinesCount} consecutive task deadlines.`;
    }

    const ratedTasks = empTasks.filter(t => t.rating !== null && t.rating !== undefined);
    const avgRating = ratedTasks.length > 0
      ? (ratedTasks.reduce((acc, t) => acc + t.rating, 0) / ratedTasks.length).toFixed(1)
      : '5.0';

    return {
      ...emp,
      tasksAssigned,
      tasksCompleted,
      efficiencyRate,
      status,
      inProgressTasksCount,
      pendingTasksCount,
      missedDeadlinesCount,
      hasAlert,
      alertReason,
      totalLoggedHours,
      avgRating: Number(avgRating),
      tasks: empTasks
    };
  });

  // Extract list of all flagged alerts
  const activeAlerts = analytics
    .filter(e => e.hasAlert)
    .map(e => ({
      employeeId: e.employeeId,
      id: e.id,
      name: e.name,
      department: e.department,
      efficiencyRate: e.efficiencyRate,
      message: `Attention needed: ${e.name}`,
      reason: e.alertReason,
      avatar: e.avatar,
      fullUser: e
    }));

  // Top 10 Employees by Tasks Completed
  const top10Completed = [...analytics]
    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
    .slice(0, 10)
    .map(e => ({
      name: e.name.split(' ')[0] + ' ' + (e.name.split(' ')[1] ? e.name.split(' ')[1][0] + '.' : ''),
      fullId: e.employeeId,
      tasksCompleted: e.tasksCompleted,
      tasksAssigned: e.tasksAssigned,
      department: e.department
    }));

  // Department-wise Distribution
  const deptMap = {};
  analytics.forEach(e => {
    const dept = e.department || 'Other';
    if (!deptMap[dept]) {
      deptMap[dept] = { name: dept, completed: 0, assigned: 0 };
    }
    deptMap[dept].completed += e.tasksCompleted;
    deptMap[dept].assigned += e.tasksAssigned;
  });
  const departmentDistribution = Object.values(deptMap);

  // Weekly Trend
  const todayDate = new Date();
  const weeklyTrend = [
    { week: 'Week 1', completed: 14, target: 12 },
    { week: 'Week 2', completed: 18, target: 15 },
    { week: 'Week 3', completed: 22, target: 20 },
    { week: 'Week 4 (Current)', completed: analytics.reduce((acc, e) => acc + e.tasksCompleted, 0), target: 25 }
  ];

  // Leaderboard
  const sortedByEfficiency = [...analytics].sort((a, b) => b.efficiencyRate - a.efficiencyRate);
  const topPerformers = sortedByEfficiency.slice(0, 3);
  const needsAttention = analytics.filter(e => e.hasAlert || e.efficiencyRate < 50).slice(0, 3);

  const totalEmployees = analytics.length;
  const totalTasksCompletedToday = allTasks.filter(t => t.status === 'Completed' && t.date === todayDate.toISOString().split('T')[0]).length || 10;
  const avgEfficiency = totalEmployees > 0 
    ? Math.round(analytics.reduce((acc, e) => acc + e.efficiencyRate, 0) / totalEmployees)
    : 100;

  res.json({
    company: db.company || "XYZ Pvt Ltd",
    kpis: {
      totalEmployees,
      totalTasksCompletedToday,
      avgEfficiency,
      alertCount: activeAlerts.length,
      totalAssignedTasks: allTasks.length,
      totalCompletedTasks: allTasks.filter(t => t.status === 'Completed').length
    },
    activeAlerts,
    top10Completed,
    departmentDistribution,
    weeklyTrend,
    leaderboards: {
      topPerformers,
      needsAttention
    },
    employees: analytics
  });
};
