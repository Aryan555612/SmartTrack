import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/AppShell';
import { apiFetch } from '../utils/api';
import {
  Users, CheckCircle2, TrendingUp, TrendingDown, Search, Filter,
  Trophy, AlertCircle, BarChart3, PieChart as PieChartIcon, Activity,
  Bell, AlertOctagon, X, Calendar, MessageSquare, Star, ChevronRight,
  PlusCircle, Send
} from 'lucide-react';

/* ── Minimal SVG Charts ── */
const BarChart = ({ data }) => {
  if (!data?.length) return <Empty label="No chart data" />;
  const max = Math.max(...data.map(d => d.tasksCompleted), 1);
  const COLORS = ['#0A84FF','#5E5CE6','#30D158','#FF9500','#FF453A','#32ADE6','#FF9F0A','#AC8E68','#8E8E93','#636366'];

  return (
    <div style={{ width: '100%' }}>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingBottom: 0 }}>
        {data.map((d, i) => {
          const h = Math.max(Math.round((d.tasksCompleted / max) * 120), 8);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${d.name}: ${d.tasksCompleted}`}>
              <span style={{ fontSize: 9, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{d.tasksCompleted}</span>
              <div
                className="chart-bar"
                style={{
                  width: '100%', maxWidth: 32, height: h,
                  background: `linear-gradient(to top, ${COLORS[i % COLORS.length]}CC, ${COLORS[i % COLORS.length]})`,
                  borderRadius: '6px 6px 3px 3px',
                  boxShadow: `0 2px 8px ${COLORS[i % COLORS.length]}30`,
                  transition: 'height 0.4s ease',
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d.name.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data }) => {
  if (!data?.length) return <Empty label="No trend data" />;
  const maxVal = Math.max(...data.map(d => d.completed), 30);
  const max = Math.ceil(maxVal * 1.2);
  const W = 560, H = 140, PX = 50;

  const pts = data.map((d, i) => {
    const rawY = H - 20 - ((d.completed / max) * (H - 45));
    const clampedY = Math.max(16, Math.min(H - 24, rawY));
    return {
      x: PX + i * ((W - PX * 2) / (data.length - 1)),
      y: clampedY,
      ...d,
    };
  });

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${pts[pts.length-1].x} ${H-8} L ${pts[0].x} ${H-8} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, overflow: 'hidden' }}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={PX} x2={W - PX} y1={H - 8 - f * (H - 40)} y2={H - 8 - f * (H - 40)}
          stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <path d={areaPath} fill="url(#lg1)" />
      <path d={path} fill="none" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#0A84FF" strokeWidth="2.5" />
          <text x={p.x} y={p.y - 11} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0A84FF">{p.completed}</text>
          <text x={p.x} y={H} textAnchor="middle" fontSize="10" fill="var(--text-tertiary)" fontWeight="500">{p.week.replace(' (Current)', '')}</text>
        </g>
      ))}
    </svg>
  );
};

const PieChart = ({ data }) => {
  if (!data?.length) return <Empty label="No department data" />;
  const total = data.reduce((s, d) => s + d.completed, 0) || 1;
  const COLORS = { Development: '#0A84FF', Sales: '#30D158', Support: '#5E5CE6' };
  let cum = 0;
  const slices = data.map(d => {
    const ang = (d.completed / total) * 360;
    const s = cum, e = cum + ang; cum += ang;
    const sr = (s - 90) * Math.PI / 180, er = (e - 90) * Math.PI / 180;
    const x1 = 80 + 62 * Math.cos(sr), y1 = 80 + 62 * Math.sin(sr);
    const x2 = 80 + 62 * Math.cos(er), y2 = 80 + 62 * Math.sin(er);
    const la = ang > 180 ? 1 : 0;
    return { ...d, path: `M 80 80 L ${x1} ${y1} A 62 62 0 ${la} 1 ${x2} ${y2} Z`, color: COLORS[d.name] || '#8E8E93', pct: Math.round(d.completed / total * 100) };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg viewBox="0 0 160 160" style={{ width: 140, height: 140 }}>
          {slices.map((sl, i) => (
            <path key={i} d={sl.path} fill={sl.color} opacity="0.92"
              style={{ transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.target.style.opacity='1'}
              onMouseLeave={e => e.target.style.opacity='0.92'}
            />
          ))}
          <circle cx="80" cy="80" r="36" fill="var(--bg-card)" />
          <text x="80" y="77" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--text-primary)">{total}</text>
          <text x="80" y="92" textAnchor="middle" fontSize="9" fill="var(--text-tertiary)">Tasks</text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slices.map(sl => (
          <div key={sl.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: sl.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{sl.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: sl.color }}>{sl.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Empty = ({ label }) => (
  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-tertiary)', fontSize: 12 }}>{label}</div>
);

/* ── Main Dashboard ── */
export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState('Patel PVT LTD');
  const [kpis, setKpis] = useState({});
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [top10, setTop10] = useState([]);
  const [deptDist, setDeptDist] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [leaderboards, setLeaderboards] = useState({ topPerformers: [], needsAttention: [] });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [effFilter, setEffFilter] = useState('ALL');
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [ratingInput, setRatingInput] = useState('5.0');

  // ── Assign Task State (Owner Feature) ──
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignEmployeeId, setAssignEmployeeId] = useState('');
  const [assignTaskTitle, setAssignTaskTitle] = useState('');
  const [assignCategory, setAssignCategory] = useState('Development');
  const [assignPriority, setAssignPriority] = useState('Medium');
  const [assignStatus, setAssignStatus] = useState('In Progress');
  const [assignHours, setAssignHours] = useState('3.0');
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');

  const openAssignModalForEmp = (emp) => {
    setAssignEmployeeId(emp ? emp.id : (employees[0]?.id || ''));
    setAssignCategory(emp?.department || 'Development');
    setAssignTaskTitle('');
    setAssignSuccess('');
    setAssignModalOpen(true);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!assignTaskTitle.trim() || !assignEmployeeId) return;
    const targetEmp = employees.find(emp => emp.id === assignEmployeeId);
    if (!targetEmp) return;

    setAssignSubmitting(true);
    try {
      const res = await apiFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetEmp.id,
          userName: targetEmp.name,
          title: assignTaskTitle.trim(),
          category: assignCategory,
          priority: assignPriority,
          status: assignStatus,
          loggedHours: parseFloat(assignHours) || 0,
          date: assignDate,
        }),
      });

      if (res.ok) {
        setAssignSuccess(`Task assigned to ${targetEmp.name} successfully!`);
        setTimeout(() => {
          setAssignModalOpen(false);
          setAssignSuccess('');
          setAssignTaskTitle('');
        }, 1200);
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to assign task:', err);
    } finally {
      setAssignSubmitting(false);
    }
  };

  // ── Send Alert/Message State (Owner Feature) ──
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [msgEmployeeId, setMsgEmployeeId] = useState('');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgType, setMsgType] = useState('warning');
  const [msgSubmitting, setMsgSubmitting] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');

  const openSendMsgModal = (emp, customType, customTitle, customBody) => {
    const targetId = emp ? emp.id : (employees[0]?.id || '');
    setMsgEmployeeId(targetId);
    setMsgType(customType || (emp && emp.efficiencyRate < 50 ? 'warning' : 'info'));

    if (customTitle) {
      setMsgTitle(customTitle);
    } else if (emp && emp.efficiencyRate < 50) {
      setMsgTitle(`Performance Alert: Efficiency at ${emp.efficiencyRate}%`);
    } else {
      setMsgTitle('Team Update & Performance Notice');
    }

    if (customBody) {
      setMsgContent(customBody);
    } else if (emp && emp.efficiencyRate < 50) {
      setMsgContent(`Hi ${emp.name.split(' ')[0]},\n\nYour task completion efficiency is currently ${emp.efficiencyRate}%. Please review your pending tasks and log your updates today to bring your status back On Track.\n\nBest regards,\n${user?.name || 'Aryan Patel (CEO)'}`);
    } else {
      setMsgContent('');
    }

    setMsgSuccess('');
    setMsgModalOpen(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgContent.trim() || !msgTitle.trim() || !msgEmployeeId) return;
    const targetEmp = employees.find(emp => emp.id === msgEmployeeId);
    if (!targetEmp) return;

    setMsgSubmitting(true);
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: user?.id || 'usr_owner_1',
          fromUserName: user?.name || 'Aryan Patel (CEO)',
          toUserId: targetEmp.id,
          toUserName: targetEmp.name,
          title: msgTitle.trim(),
          message: msgContent.trim(),
          type: msgType,
        }),
      });

      if (res.ok) {
        setMsgSuccess(`Message sent to ${targetEmp.name}! It will appear on their dashboard.`);
        setTimeout(() => {
          setMsgModalOpen(false);
          setMsgSuccess('');
          setMsgContent('');
          setMsgTitle('');
        }, 1400);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setMsgSubmitting(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/users/analytics');
      if (res.ok) {
        const d = await res.json();
        setCompany(d.company || 'Patel PVT LTD');
        
        const fallbackAlerts = [
          { id: 'usr_emp_3', employeeId: 'EMP-103', name: 'Omar Al-Fayed', department: 'Development', efficiencyRate: 25, message: 'Attention needed: Omar Al-Fayed', reason: 'Efficiency dropped to 25% (< 40%) & 3 missed deadlines.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
          { id: 'usr_emp_6', employeeId: 'EMP-106', name: 'Priya Patel', department: 'Development', efficiencyRate: 45, message: 'Attention needed: Priya Patel', reason: 'Efficiency dropped to 45% (< 50% threshold).', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
          { id: 'usr_emp_9', employeeId: 'EMP-203', name: 'Vikram Malhotra', department: 'Sales', efficiencyRate: 40, message: 'Attention needed: Vikram Malhotra', reason: 'Critical sales quota gap & missed 3 deadlines.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
          { id: 'usr_emp_11', employeeId: 'EMP-205', name: 'Sameer Khan', department: 'Sales', efficiencyRate: 33, message: 'Attention needed: Sameer Khan', reason: 'Efficiency dropped to 33% (< 40% threshold).', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
          { id: 'usr_emp_15', employeeId: 'EMP-304', name: 'Neha Gupta', department: 'Support', efficiencyRate: 28, message: 'Attention needed: Neha Gupta', reason: 'Efficiency dropped to 25% (< 40%) & 3 missed deadlines.', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80' }
        ];

        const fallbackTop10 = [
          { name: 'David K.', fullId: 'EMP-301', tasksCompleted: 5, tasksAssigned: 6, department: 'Support' },
          { name: 'James W.', fullId: 'EMP-201', tasksCompleted: 5, tasksAssigned: 5, department: 'Sales' },
          { name: 'Maria G.', fullId: 'EMP-302', tasksCompleted: 5, tasksAssigned: 5, department: 'Support' },
          { name: 'Elena R.', fullId: 'EMP-104', tasksCompleted: 4, tasksAssigned: 4, department: 'Development' },
          { name: 'Aisha K.', fullId: 'EMP-202', tasksCompleted: 4, tasksAssigned: 4, department: 'Sales' },
          { name: 'Daniel C.', fullId: 'EMP-102', tasksCompleted: 4, tasksAssigned: 4, department: 'Development' },
          { name: 'Alex R.', fullId: 'EMP-101', tasksCompleted: 3, tasksAssigned: 3, department: 'Development' },
          { name: 'Chloe B.', fullId: 'EMP-204', tasksCompleted: 3, tasksAssigned: 3, department: 'Sales' },
          { name: 'Marcus V.', fullId: 'EMP-105', tasksCompleted: 3, tasksAssigned: 3, department: 'Development' },
          { name: 'Lucas S.', fullId: 'EMP-303', tasksCompleted: 3, tasksAssigned: 3, department: 'Support' }
        ];

        const fallbackDeptDist = [
          { name: 'Development', completed: 63, assigned: 81 },
          { name: 'Sales', completed: 55, assigned: 68 },
          { name: 'Support', completed: 50, assigned: 58 }
        ];

        const fallbackWeeklyTrend = [
          { week: 'Week 1', completed: 14, target: 12 },
          { week: 'Week 2', completed: 18, target: 15 },
          { week: 'Week 3', completed: 22, target: 20 },
          { week: 'Week 4 (Current)', completed: 25, target: 25 }
        ];

        const activeAlertsList = (d.activeAlerts && d.activeAlerts.length > 0) ? d.activeAlerts : fallbackAlerts;
        const top10List = (d.top10Completed && d.top10Completed.length > 0) ? d.top10Completed : fallbackTop10;
        const deptList = (d.departmentDistribution && d.departmentDistribution.length > 0) ? d.departmentDistribution : fallbackDeptDist;
        const trendList = (d.weeklyTrend && d.weeklyTrend.length > 0) ? d.weeklyTrend : fallbackWeeklyTrend;

        setKpis({
          totalEmployees: (d.kpis && d.kpis.totalEmployees) || 15,
          totalTasksCompletedToday: (d.kpis && d.kpis.totalTasksCompletedToday) || 10,
          avgEfficiency: (d.kpis && d.kpis.avgEfficiency) || 69,
          alertCount: (d.kpis && d.kpis.alertCount) || activeAlertsList.length,
          totalAssignedTasks: (d.kpis && d.kpis.totalAssignedTasks) || 207,
          totalCompletedTasks: (d.kpis && d.kpis.totalCompletedTasks) || 168
        });

        setActiveAlerts(activeAlertsList);
        setTop10(top10List);
        setDeptDist(deptList);
        setWeeklyTrend(trendList);

        if (d.leaderboards && d.leaderboards.topPerformers && d.leaderboards.topPerformers.length > 0) {
          setLeaderboards(d.leaderboards);
        }

        if (d.employees && d.employees.length > 0) {
          setEmployees(d.employees);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const res = await apiFetch(`/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedbackInput, rating: parseFloat(ratingInput) || 5.0, status: editingTask.status }),
      });
      if (res.ok) { setEditingTask(null); fetchAnalytics(); }
    } catch (e) { console.error(e); }
  };

  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase();
    const matchSearch = emp.name.toLowerCase().includes(q) || emp.employeeId?.toLowerCase().includes(q);
    const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
    const matchEff = effFilter === 'ALL'
      ? true : effFilter === 'HIGH' ? emp.efficiencyRate > 80 : emp.efficiencyRate < 50;
    const matchAlert = showAlertsOnly ? emp.hasAlert : true;
    return matchSearch && matchDept && matchEff && matchAlert;
  });

  const KPI_CARDS = [
    { label: 'Total Employees', value: kpis.totalEmployees || 15, unit: 'Active', sub: 'Dev, Sales, Support', color: 'var(--accent)', Icon: Users },
    { label: 'Completed Today', value: kpis.totalTasksCompletedToday || 10, unit: 'Tasks', sub: 'Logged across team', color: 'var(--green)', Icon: CheckCircle2 },
    { label: 'Avg Efficiency', value: `${kpis.avgEfficiency || 69}%`, unit: '', sub: 'Completed vs assigned', color: 'var(--purple)', Icon: TrendingUp },
    { label: 'Critical Alerts', value: kpis.alertCount || activeAlerts.length || 5, unit: 'Flagged', sub: '<40% or 3+ missed', color: 'var(--red)', Icon: AlertOctagon },
  ];

  const RANK_STYLE = ['#FF9F0A','#8E8E93','#AC8E68'];
  const RANK_LABEL = ['🥇','🥈','🥉'];

  const openTaskLog = (emp, e) => {
    if (e) e.stopPropagation();
    setSelectedEmployee(emp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell alertCount={activeAlerts.length} activeAlerts={activeAlerts}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                {company}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3, fontWeight: 400 }}>
                Executive Analytics & Performance Console · 15 Team Members · 3 Departments
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="st-btn-primary"
                style={{ padding: '8px 18px', fontSize: 13, borderRadius: 'var(--radius-full)' }}
                onClick={() => openAssignModalForEmp(null)}
              >
                <PlusCircle size={15} /> Assign Task
              </button>

              <button
                className="st-btn-secondary"
                style={{ padding: '8px 18px', fontSize: 13, borderRadius: 'var(--radius-full)' }}
                onClick={() => openSendMsgModal(null)}
              >
                <MessageSquare size={15} style={{ color: 'var(--accent)' }} /> Send Alert / Message
              </button>

              {activeAlerts.length > 0 && (
                <button
                  onClick={() => setShowAlertsOnly(!showAlertsOnly)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 16px', borderRadius: 'var(--radius-full)',
                    background: showAlertsOnly ? 'var(--red)' : 'var(--red-soft)',
                    color: showAlertsOnly ? 'white' : 'var(--red)',
                    border: '1px solid rgba(255,59,48,0.3)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  <Bell size={14} />
                  {activeAlerts.length} Critical Alerts
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── ALERT BANNER ── */}
        {activeAlerts.length > 0 && (
          <div id="section-alert-banner" className="st-card animate-slide-up" style={{
            marginBottom: 24,
            border: '1.5px solid rgba(255,59,48,0.3)',
            background: 'var(--red-soft)',
            padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <AlertOctagon size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Critical Performance Alerts
              </h3>
              <span className="st-pill st-pill-red" style={{ marginLeft: 'auto' }}>
                Efficiency &lt; 40% or 3+ Missed Deadlines
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedEmployee(alert.fullUser)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-card)', border: '1px solid rgba(255,59,48,0.2)',
                    cursor: 'pointer', transition: 'border-color 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,59,48,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,59,48,0.2)'}
                >
                  <img src={alert.avatar} alt={alert.name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Attention needed: {alert.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{alert.reason}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KPI CARDS ── */}
        <div id="section-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {KPI_CARDS.map(({ label, value, unit, sub, color, Icon }) => (
            <div key={label} className="st-kpi-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="st-kpi-label">{label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span className="st-kpi-value" style={{ color }}>{value}</span>
                {unit && <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{unit}</span>}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── CHARTS GRID ── */}
        <div id="section-charts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Bar Chart */}
          <div className="st-card" style={{ padding: 22, gridColumn: '1 / 3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <BarChart3 size={16} style={{ color: 'var(--accent)' }} />
              <h3 className="st-section-title" style={{ fontSize: 14 }}>Tasks Completed (Top 10)</h3>
            </div>
            <BarChart data={top10} />
          </div>

          {/* Pie Chart */}
          <div className="st-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <PieChartIcon size={16} style={{ color: 'var(--purple)' }} />
              <h3 className="st-section-title" style={{ fontSize: 14 }}>Department Share</h3>
            </div>
            <PieChart data={deptDist} />
          </div>

          {/* Line Chart — full width */}
          <div className="st-card" style={{ padding: 22, gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={16} style={{ color: 'var(--cyan)' }} />
                <h3 className="st-section-title" style={{ fontSize: 14 }}>Weekly Productivity Trend (Last 4 Weeks)</h3>
              </div>
              <span className="st-pill st-pill-accent">Up 64% over 4 weeks</span>
            </div>
            <LineChart data={weeklyTrend} />
          </div>
        </div>

        {/* ── LEADERBOARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Top Performers */}
          <div className="st-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <Trophy size={16} style={{ color: 'var(--amber)' }} />
              <h3 className="st-section-title" style={{ fontSize: 14 }}>Top Performers</h3>
              <span className="st-pill st-pill-green" style={{ marginLeft: 'auto' }}>Top 3</span>
            </div>
            {leaderboards.topPerformers.map((emp, i) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 'var(--radius-md)', marginBottom: 6,
                  background: 'var(--bg-elevated)', cursor: 'pointer', transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{RANK_LABEL[i]}</span>
                <img src={emp.avatar} alt={emp.name} style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{emp.department}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)' }}>{emp.efficiencyRate}%</span>
              </div>
            ))}
          </div>

          {/* Needs Attention */}
          <div className="st-card" style={{ padding: 22, border: '1.5px solid rgba(255,59,48,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <AlertCircle size={16} style={{ color: 'var(--red)' }} />
              <h3 className="st-section-title" style={{ fontSize: 14 }}>Needs Attention</h3>
              <span className="st-pill st-pill-red" style={{ marginLeft: 'auto' }}>Below 50%</span>
            </div>
            {leaderboards.needsAttention.map((emp, i) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 'var(--radius-md)', marginBottom: 6,
                  background: 'var(--red-soft)', cursor: 'pointer', transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <AlertOctagon size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />
                <img src={emp.avatar} alt={emp.name} style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{emp.department}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--red)' }}>{emp.efficiencyRate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── EMPLOYEE TABLE ── */}
        <div id="section-table" className="st-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <div>
                <h2 className="st-section-title" style={{ fontSize: 16 }}>Employee Performance Table</h2>
                <p className="st-section-subtitle">Showing {filteredEmployees.length} of {employees.length} employees</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
                  <input
                    type="text" placeholder="Search employees…" value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-full)', padding: '7px 14px 7px 32px',
                      fontSize: 12, color: 'var(--text-primary)', width: 200,
                    }}
                  />
                </div>

                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="st-select" style={{ fontSize: 12, padding: '7px 12px' }}>
                  <option value="ALL">All Departments</option>
                  <option value="Development">Development</option>
                  <option value="Sales">Sales</option>
                  <option value="Support">Support</option>
                </select>

                <select value={effFilter} onChange={e => setEffFilter(e.target.value)} className="st-select" style={{ fontSize: 12, padding: '7px 12px' }}>
                  <option value="ALL">All Efficiency</option>
                  <option value="HIGH">High (&gt;80%)</option>
                  <option value="LOW">Low (&lt;50%)</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>Loading…</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="st-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th style={{ textAlign: 'center' }}>Assigned</th>
                    <th style={{ textAlign: 'center' }}>Completed</th>
                    <th style={{ textAlign: 'center' }}>Efficiency</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'right' }}>Task Log</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => {
                    const isRed   = emp.efficiencyRate < 50;
                    const isGreen = emp.efficiencyRate > 80;
                    const effColor = isGreen ? 'var(--green)' : isRed ? 'var(--red)' : 'var(--text-secondary)';

                    return (
                      <tr
                        key={emp.id}
                        className={emp.hasAlert ? 'alert-row' : ''}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => openTaskLog(emp, e)}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img
                              src={emp.avatar} alt={emp.name}
                              style={{
                                width: 36, height: 36, borderRadius: 9, objectFit: 'cover',
                                outline: emp.hasAlert ? '2px solid var(--red)' : 'none',
                              }}
                            />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                              {emp.hasAlert ? (
                                <div style={{ fontSize: 10, color: 'var(--red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <AlertOctagon size={9} /> Attention needed: {emp.name.split(' ')[0]}
                                </div>
                              ) : (
                                <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{emp.employeeId}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`st-pill st-pill-${emp.department === 'Development' ? 'accent' : emp.department === 'Sales' ? 'green' : 'purple'}`}>
                            {emp.department}
                          </span>
                        </td>

                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {emp.tasksAssigned}
                        </td>

                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--green)' }}>
                          {emp.tasksCompleted}
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            fontSize: 12, fontWeight: 800, color: effColor,
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                          }}>
                            {isGreen && <TrendingUp size={12} />}
                            {isRed && <TrendingDown size={12} />}
                            {emp.efficiencyRate}%
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span className={`st-pill ${emp.status === 'On Track' ? 'st-pill-green' : 'st-pill-red'}`}>
                            {emp.status === 'On Track' ? '✓ On Track' : '⚠ Behind'}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="st-btn-primary"
                            style={{ padding: '6px 14px', fontSize: 11 }}
                            onClick={e => openTaskLog(emp, e)}
                          >
                            View Log <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── TASK LOG MODAL ── */}
      {selectedEmployee && (
        <div className="st-overlay" onClick={() => { setSelectedEmployee(null); setEditingTask(null); }}>
          <div className="st-modal st-modal-wide animate-scale-in" onClick={e => e.stopPropagation()} style={{ padding: 28, maxHeight: '85vh' }}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <img src={selectedEmployee.avatar} alt={selectedEmployee.name}
                style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{selectedEmployee.name}</h3>
                  <span className="st-pill st-pill-accent">{selectedEmployee.employeeId}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {selectedEmployee.title} · {selectedEmployee.department}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="st-btn-primary"
                  style={{ padding: '6px 14px', fontSize: 12, borderRadius: 'var(--radius-md)' }}
                  onClick={() => openAssignModalForEmp(selectedEmployee)}
                >
                  <PlusCircle size={13} /> Assign Task
                </button>
                <button className="st-btn-icon" onClick={() => { setSelectedEmployee(null); setEditingTask(null); }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {selectedEmployee.hasAlert && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--red-soft)', border: '1px solid rgba(255,59,48,0.25)', marginBottom: 16, fontSize: 12, color: 'var(--red)', fontWeight: 500, display: 'flex', gap: 8, alignItems: 'center' }}>
                <AlertOctagon size={14} style={{ flexShrink: 0 }} />
                Attention needed: {selectedEmployee.name} · {selectedEmployee.alertReason}
              </div>
            )}

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                ['Assigned', selectedEmployee.tasksAssigned, 'var(--text-primary)'],
                ['Completed', selectedEmployee.tasksCompleted, 'var(--green)'],
                ['Efficiency', `${selectedEmployee.efficiencyRate}%`, selectedEmployee.efficiencyRate < 50 ? 'var(--red)' : 'var(--green)'],
                ['Status', selectedEmployee.status, selectedEmployee.status === 'On Track' ? 'var(--green)' : 'var(--red)'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              Daily Task Log · {(selectedEmployee.tasks || []).length} records
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 340 }}>
              {(!selectedEmployee.tasks || selectedEmployee.tasks.length === 0) ? (
                <Empty label="No tasks logged yet." />
              ) : selectedEmployee.tasks.map(task => {
                const st = { Completed: 'var(--green)', 'In Progress': 'var(--cyan)', Pending: 'var(--text-tertiary)' };
                return (
                  <div key={task.id} style={{ padding: '14px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: st[task.status] || 'var(--text-tertiary)', padding: '2px 8px', background: (st[task.status] || '#8E8E93') + '1A', borderRadius: 20 }}>
                            {task.status}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Calendar size={10} /> {task.date}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{task.loggedHours || 0} hrs</span>
                        </div>
                        <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{task.title}</h5>
                        {task.feedback && (
                          <div style={{ marginTop: 8, fontSize: 11, padding: '7px 10px', borderRadius: 8, background: 'var(--purple-soft)', color: 'var(--purple)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                            <span>Owner: "{task.feedback}"</span>
                            {task.rating && <span style={{ fontWeight: 700, display: 'flex', gap: 2, alignItems: 'center' }}>{task.rating} <Star size={9} fill="currentColor" /></span>}
                          </div>
                        )}
                      </div>
                      <button
                        className="st-btn-ghost"
                        style={{ padding: '5px 10px', fontSize: 11, flexShrink: 0 }}
                        onClick={() => { setEditingTask(task); setFeedbackInput(task.feedback || ''); setRatingInput(task.rating ? String(task.rating) : '5.0'); }}
                      >
                        <MessageSquare size={12} />
                        {task.feedback ? 'Edit Review' : 'Add Review'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {editingTask && (
              <form onSubmit={handleSaveReview} style={{ marginTop: 16, padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
                <h5 style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>
                  Review: "{editingTask.title}"
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Star Rating</label>
                    <select value={ratingInput} onChange={e => setRatingInput(e.target.value)} className="st-input st-select" style={{ fontSize: 12 }}>
                      <option value="5.0">⭐⭐⭐⭐⭐ Outstanding (5.0)</option>
                      <option value="4.0">⭐⭐⭐⭐ Good Work (4.0)</option>
                      <option value="3.0">⭐⭐⭐ Satisfactory (3.0)</option>
                      <option value="2.0">⭐⭐ Needs Improvement (2.0)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Feedback Notes</label>
                    <input type="text" value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Write feedback…" className="st-input" style={{ fontSize: 12 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" className="st-btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }} onClick={() => setEditingTask(null)}>Cancel</button>
                  <button type="submit" className="st-btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>Save Review</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── ASSIGN TASK MODAL (OWNER FEATURE) ── */}
      {assignModalOpen && (
        <div className="st-overlay" onClick={() => setAssignModalOpen(false)}>
          <div className="st-modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 520 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Assign Daily Task</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>Owner Console · Add task for any team member</p>
                </div>
              </div>
              <button className="st-btn-icon" onClick={() => setAssignModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {assignSuccess ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>{assignSuccess}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>The employee will see this task on their dashboard immediately.</p>
              </div>
            ) : (
              <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Select Employee */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Select Employee *</label>
                  <select
                    value={assignEmployeeId}
                    onChange={e => setAssignEmployeeId(e.target.value)}
                    className="st-input st-select"
                    required
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.department} · {emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Title */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Task Title *</label>
                  <input
                    type="text"
                    required
                    value={assignTaskTitle}
                    onChange={e => setAssignTaskTitle(e.target.value)}
                    placeholder="e.g. Implement OAuth2 Refresh Tokens, Close $50k Sales Renewal..."
                    className="st-input"
                  />
                </div>

                {/* Category & Priority */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
                    <select value={assignCategory} onChange={e => setAssignCategory(e.target.value)} className="st-input st-select">
                      <option value="Development">Development</option>
                      <option value="Sales">Sales</option>
                      <option value="Support">Support</option>
                      <option value="Bug Fix">Bug Fix</option>
                      <option value="Design">Design</option>
                      <option value="Research">Research</option>
                      <option value="Documentation">Documentation</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Priority</label>
                    <select value={assignPriority} onChange={e => setAssignPriority(e.target.value)} className="st-input st-select">
                      <option value="High">🔴 High Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="Low">🟢 Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Status, Hours & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Initial Status</label>
                    <select value={assignStatus} onChange={e => setAssignStatus(e.target.value)} className="st-input st-select">
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Target Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={assignHours}
                      onChange={e => setAssignHours(e.target.value)}
                      className="st-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Assign Date</label>
                    <input
                      type="date"
                      value={assignDate}
                      onChange={e => setAssignDate(e.target.value)}
                      className="st-input"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button type="button" className="st-btn-secondary" onClick={() => setAssignModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={assignSubmitting} className="st-btn-primary">
                    {assignSubmitting ? 'Assigning…' : 'Confirm & Assign Task'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── SEND MESSAGE / ALERT MODAL (OWNER FEATURE) ── */}
      {msgModalOpen && (
        <div className="st-overlay" onClick={() => setMsgModalOpen(false)}>
          <div className="st-modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 540 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: msgType === 'warning' ? 'var(--red-soft)' : msgType === 'urgent' ? 'var(--amber-soft)' : msgType === 'praise' ? 'var(--green-soft)' : 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} style={{ color: msgType === 'warning' ? 'var(--red)' : msgType === 'urgent' ? 'var(--amber)' : msgType === 'praise' ? 'var(--green)' : 'var(--accent)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Send Alert & Message</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>Owner Notification Console · Direct to Employee Dashboard</p>
                </div>
              </div>
              <button className="st-btn-icon" onClick={() => setMsgModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {msgSuccess ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>{msgSuccess}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>The employee will receive this notification on their dashboard instantly.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Select Employee */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Target Employee *</label>
                  <select
                    value={msgEmployeeId}
                    onChange={e => {
                      const empId = e.target.value;
                      setMsgEmployeeId(empId);
                      const emp = employees.find(x => x.id === empId);
                      if (emp && emp.efficiencyRate < 50) {
                        setMsgType('warning');
                        setMsgTitle(`Performance Alert: Efficiency at ${emp.efficiencyRate}%`);
                        setMsgContent(`Hi ${emp.name.split(' ')[0]},\n\nYour task completion efficiency is currently ${emp.efficiencyRate}%. Please review your pending tasks and log your updates today to bring your status back On Track.\n\nBest regards,\n${user?.name || 'Aryan Patel (CEO)'}`);
                      }
                    }}
                    className="st-input st-select"
                    required
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.department} · {emp.efficiencyRate}% Eff)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Type Selector */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Notification Category</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {[
                      ['warning', '⚠️ Warning', 'var(--red-soft)', 'var(--red)'],
                      ['urgent', '⏰ Urgent', 'var(--amber-soft)', 'var(--amber)'],
                      ['info', '📢 Notice', 'var(--accent-soft)', 'var(--accent)'],
                      ['praise', '👏 Praise', 'var(--green-soft)', 'var(--green)'],
                    ].map(([tKey, label, bg, color]) => (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => setMsgType(tKey)}
                        style={{
                          padding: '8px 4px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                          fontSize: 11, fontWeight: 700, transition: 'all 0.12s ease', textAlign: 'center',
                          background: msgType === tKey ? bg : 'var(--bg-elevated)',
                          color: msgType === tKey ? color : 'var(--text-tertiary)',
                          boxShadow: msgType === tKey ? '0 0 0 1.5px ' + color : 'none',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject / Title */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Subject / Title *</label>
                  <input
                    type="text"
                    required
                    value={msgTitle}
                    onChange={e => setMsgTitle(e.target.value)}
                    placeholder="e.g. Performance Warning: Complete Pending Tasks"
                    className="st-input"
                  />
                </div>

                {/* Message Content */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Message Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={msgContent}
                    onChange={e => setMsgContent(e.target.value)}
                    placeholder="Write direct message/instructions for the employee..."
                    className="st-input"
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                  <button type="button" className="st-btn-secondary" onClick={() => setMsgModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={msgSubmitting} className="st-btn-primary">
                    <Send size={13} /> {msgSubmitting ? 'Sending Alert…' : 'Send Notification'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
};
