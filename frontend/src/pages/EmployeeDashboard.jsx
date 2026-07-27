import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/AppShell';
import {
  PlusCircle, CheckCircle2, Clock, Award, Calendar,
  Trash2, Star, Tag, TrendingUp, ChevronDown, X,
  Bell, AlertOctagon, MessageSquare, Send
} from 'lucide-react';

import { apiFetch } from '../utils/api';

const STATUS_STYLE = {
  Completed:   { bg: 'var(--green-soft)',  color: 'var(--green)',  dot: '#30D158' },
  'In Progress':{ bg: 'var(--cyan-soft)',  color: 'var(--cyan)',   dot: '#32ADE6' },
  Pending:     { bg: 'var(--bg-elevated)', color: 'var(--text-tertiary)', dot: '#8E8E93' },
};

const CATEGORY_COLORS = {
  Development: '#0A84FF', 'Bug Fix': '#FF453A', Design: '#5E5CE6',
  Marketing: '#FF9F0A', Research: '#30D158', Support: '#FF9500', Documentation: '#32ADE6',
};

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [taskName, setTaskName]   = useState('');
  const [taskDate, setTaskDate]   = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus]       = useState('In Progress');
  const [hoursSpent, setHoursSpent] = useState('2.0');
  const [category, setCategory]   = useState('Development');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [messages, setMessages]   = useState([]);

  useEffect(() => {
    fetchEmployeeTasks();
    fetchEmployeeMessages();
  }, [user]);

  const fetchEmployeeTasks = async () => {
    if (!user) return;
    try {
      const res = await apiFetch(`/api/tasks?role=employee&userId=${user.id}`);
      if (res.ok) setTasks(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchEmployeeMessages = async () => {
    if (!user) return;
    try {
      const res = await apiFetch(`/api/messages?role=employee&userId=${user.id}`);
      if (res.ok) setMessages(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleMarkMessageRead = async (msgId) => {
    try {
      await apiFetch(`/api/messages/${msgId}/read`, { method: 'PATCH' });
      fetchEmployeeMessages();
    } catch (e) { console.error(e); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    const newTask = {
      userId: user.id, userName: user.name, title: taskName,
      date: taskDate, status, loggedHours: parseFloat(hoursSpent) || 0,
      category, priority: 'Medium',
    };
    try {
      const res = await apiFetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        setTaskName('');
        setIsAddingTask(false);
        fetchEmployeeTasks();
      }
    } catch (e) { console.error(e); }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const res = await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchEmployeeTasks();
    } catch (e) { console.error(e); }
  };

  const handleHoursUpdate = async (taskId, hours) => {
    try {
      await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loggedHours: parseFloat(hours) || 0 }),
      });
      fetchEmployeeTasks();
    } catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiFetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      fetchEmployeeTasks();
    } catch (e) { console.error(e); }
  };

  const completedCount   = tasks.filter(t => t.status === 'Completed').length;
  const completionRate   = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 100;
  const totalHours       = tasks.reduce((a, t) => a + (t.loggedHours || 0), 0);
  const ratedTasks       = tasks.filter(t => t.rating != null);
  const avgRating        = ratedTasks.length > 0
    ? (ratedTasks.reduce((a, t) => a + t.rating, 0) / ratedTasks.length).toFixed(1)
    : '5.0';

  const kpis = [
    {
      label: 'Completed This Week', value: `${completedCount}`, unit: 'tasks',
      sub: `${tasks.length} total assigned`, color: 'var(--green)',
      bg: 'var(--green-soft)', Icon: CheckCircle2,
    },
    {
      label: 'Completion Rate', value: `${completionRate}`, unit: '%',
      sub: 'Weekly productivity', color: 'var(--accent)',
      bg: 'var(--accent-soft)', Icon: TrendingUp,
    },
    {
      label: 'Hours Logged', value: `${totalHours}`, unit: 'hrs',
      sub: 'On daily tasks', color: 'var(--cyan)',
      bg: 'var(--cyan-soft)', Icon: Clock,
    },
    {
      label: 'Performance Rating', value: avgRating, unit: '★',
      sub: 'Owner reviewed score', color: 'var(--amber)',
      bg: 'var(--amber-soft)', Icon: Award,
    },
  ];

  return (
    <AppShell alertCount={0}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Page Header */}
        <div id="section-emp-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img
              src={user?.avatar}
              alt={user?.name}
              style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', boxShadow: 'var(--shadow-card)' }}
            />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                {user?.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span className="st-pill st-pill-accent">{user?.employeeId || 'EMP-101'}</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  {user?.title} · {user?.department}
                </span>
              </div>
            </div>
          </div>

          <button
            className="st-btn-primary"
            onClick={() => setIsAddingTask(!isAddingTask)}
            style={{ padding: '10px 20px' }}
          >
            <PlusCircle size={15} />
            <span>{isAddingTask ? 'Cancel' : 'Add Daily Task'}</span>
          </button>
        </div>

        {/* Performance KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {kpis.map(({ label, value, unit, sub, color, bg, Icon }) => (
            <div key={label} className="st-kpi-card">
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="st-kpi-label" style={{ marginBottom: 4 }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="st-kpi-value" style={{ fontSize: 28, color }}>{value}</span>
                <span style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{unit}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── OWNER NOTIFICATIONS / DIRECT MESSAGES ── */}
        {messages.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={16} style={{ color: 'var(--amber)' }} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Owner Notifications & Alerts
                </h3>
                <span className="st-pill st-pill-amber" style={{ fontSize: 10 }}>
                  {messages.filter(m => !m.read).length} unread
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(msg => {
                const TYPE_CONFIG = {
                  warning: { bg: 'var(--red-soft)', border: 'rgba(255,59,48,0.25)', color: 'var(--red)', icon: AlertOctagon, tag: '⚠️ WARNING' },
                  urgent:  { bg: 'var(--amber-soft)', border: 'rgba(255,149,0,0.25)', color: 'var(--amber)', icon: Clock, tag: '⏰ URGENT' },
                  praise:  { bg: 'var(--green-soft)', border: 'rgba(52,199,89,0.25)', color: 'var(--green)', icon: Award, tag: '👏 PRAISE' },
                  info:    { bg: 'var(--accent-soft)', border: 'var(--accent-border)', color: 'var(--accent)', icon: MessageSquare, tag: '📢 NOTICE' },
                };
                const cfg = TYPE_CONFIG[msg.type] || TYPE_CONFIG.info;
                const IconComp = cfg.icon;

                return (
                  <div
                    key={msg.id}
                    className="st-card animate-slide-up"
                    style={{
                      padding: '16px 20px',
                      background: msg.read ? 'var(--bg-card)' : cfg.bg,
                      border: `1.5px solid ${msg.read ? 'var(--border)' : cfg.border}`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                      <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                          <IconComp size={18} style={{ color: cfg.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: cfg.color, padding: '2px 8px', borderRadius: 20, background: cfg.border }}>
                              {cfg.tag}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                              From: {msg.fromUserName || 'Aryan Patel (CEO)'}
                            </span>
                            <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                              · {msg.date}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                            {msg.title}
                          </h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {msg.message}
                          </p>
                        </div>
                      </div>

                      {!msg.read && (
                        <button
                          className="st-btn-secondary"
                          style={{ fontSize: 11, padding: '5px 12px', flexShrink: 0 }}
                          onClick={() => handleMarkMessageRead(msg.id)}
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="st-card animate-slide-up" style={{ padding: 24, marginBottom: 24, border: '1.5px solid var(--accent-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Log New Daily Task</h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {user?.name} · {user?.employeeId}
                </p>
              </div>
              <button className="st-btn-icon" onClick={() => setIsAddingTask(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Task Name *
                  </label>
                  <input
                    type="text" value={taskName} onChange={e => setTaskName(e.target.value)}
                    placeholder="Describe your task clearly…" required className="st-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</label>
                  <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)} className="st-input" />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="st-input st-select">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hours Spent</label>
                  <input type="number" step="0.5" min="0.5" max="12" value={hoursSpent} onChange={e => setHoursSpent(e.target.value)} className="st-input" />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="st-input st-select">
                    {['Development','Bug Fix','Design','Marketing','Research','Support','Documentation'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="st-btn-secondary" onClick={() => setIsAddingTask(false)}>Cancel</button>
                <button type="submit" className="st-btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div id="section-tasks" className="st-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="st-section-title" style={{ fontSize: 16 }}>My Daily Tasks</h2>
              <p className="st-section-subtitle">{tasks.length} assigned tasks total</p>
            </div>
            <span className="st-pill st-pill-neutral">{completedCount}/{tasks.length} done</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>Loading tasks…</div>
          ) : tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 24px', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>No tasks yet</h3>
              <p style={{ fontSize: 13, maxWidth: 300, margin: '0 auto' }}>
                Click "Add Daily Task" to start logging your work items and track hours.
              </p>
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {tasks.map((task, idx) => {
                const st = STATUS_STYLE[task.status] || STATUS_STYLE.Pending;
                const catColor = CATEGORY_COLORS[task.category] || '#8E8E93';
                return (
                  <div
                    key={task.id}
                    style={{
                      padding: '16px 22px',
                      borderBottom: idx < tasks.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.12s ease',
                      display: 'flex', alignItems: 'flex-start', gap: 16,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Status dot */}
                    <div style={{ paddingTop: 4, flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: st.dot }} />
                    </div>

                    {/* Main content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{task.title}</h3>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px',
                          borderRadius: 'var(--radius-full)', background: catColor + '18', color: catColor,
                        }}>
                          {task.category || 'General'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-tertiary)' }}>
                          <Calendar size={11} /> {task.date}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                          {task.loggedHours || 0} hrs logged
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px',
                          borderRadius: 'var(--radius-full)', background: st.bg, color: st.color,
                        }}>
                          {task.status}
                        </span>
                      </div>

                      {task.feedback && (
                        <div style={{
                          marginTop: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)',
                          background: 'var(--purple-soft)', border: '1px solid rgba(94,92,230,0.2)',
                          fontSize: 11, color: 'var(--purple)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        }}>
                          <span>Owner: "{task.feedback}"</span>
                          {task.rating && (
                            <span style={{ fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                              {task.rating} <Star size={10} fill="currentColor" />
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <input
                        type="number" step="0.5" min="0"
                        value={task.loggedHours || ''}
                        onChange={e => handleHoursChange(task.id, e.target.value)}
                        title="Hours spent"
                        style={{
                          width: 56, background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                          padding: '5px 8px', fontSize: 12, fontWeight: 600,
                          color: 'var(--text-primary)', textAlign: 'center',
                        }}
                      />

                      <div style={{ position: 'relative' }}>
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value)}
                          style={{
                            appearance: 'none', background: st.bg, color: st.color,
                            border: 'none', borderRadius: 'var(--radius-md)',
                            padding: '6px 26px 6px 10px', fontSize: 11, fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <ChevronDown size={10} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: st.color, pointerEvents: 'none' }} />
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="st-btn-icon"
                        style={{ width: 30, height: 30 }}
                        title="Delete task"
                      >
                        <Trash2 size={13} style={{ color: 'var(--red)' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
