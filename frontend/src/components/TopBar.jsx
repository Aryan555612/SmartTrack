import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search, Bell, Sun, Moon, Tag, LogOut, Mail,
  Briefcase, Hash, Shield, Building2, X, AlertOctagon,
  CheckCircle2, Clock
} from 'lucide-react';

export const TopBar = ({ alertCount = 0, activeAlerts = [], onOpenEmployee }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());

  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  const markRead = (id) => setReadIds(s => new Set([...s, id]));
  const markAllRead = () => setReadIds(new Set(activeAlerts.map(a => a.id)));
  const unreadCount = activeAlerts.filter(a => !readIds.has(a.id)).length;

  const isOwner = user?.role === 'owner';
  const MALE_OWNER_AVATAR = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80';
  const userAvatar = (isOwner || user?.avatar?.includes('1573496359142')) 
    ? MALE_OWNER_AVATAR 
    : (user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0A84FF&color=fff`);

  const profileFields = [
    { icon: Hash,      label: 'Employee ID', value: user?.employeeId || (isOwner ? 'OWN-001' : 'EMP-101') },
    { icon: Mail,      label: 'Email',        value: user?.email },
    { icon: Briefcase, label: 'Title',        value: user?.title || (isOwner ? 'Managing Director' : 'Team Member') },
    { icon: Building2, label: 'Department',   value: user?.department || (isOwner ? 'Executive' : '—') },
    { icon: Shield,    label: 'Role',         value: isOwner ? 'Owner / Admin' : 'Employee' },
  ];

  return (
    <header className="st-topbar" style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px', gap: 16,
    }}>
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
        <input type="text" placeholder="Search tasks, employees…" className="st-search" style={{ paddingLeft: 34 }} />
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="st-btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => navigate('/pricing')}>
          <Tag size={14} /> <span>Pricing</span>
        </button>

        <button className="st-btn-icon" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}>
          {isDark ? <Sun size={16} style={{ color: 'var(--amber)' }} /> : <Moon size={16} />}
        </button>

        {/* ── NOTIFICATION BELL ── */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="st-btn-icon"
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            title="Notifications"
            style={{ background: notifOpen ? 'var(--accent-soft)' : undefined, borderColor: notifOpen ? 'var(--accent-border)' : undefined }}
          >
            <Bell size={16} style={{ color: notifOpen ? 'var(--accent)' : undefined }} />
          </button>

          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              minWidth: 18, height: 18, borderRadius: 9, padding: '0 4px',
              background: 'var(--red)', color: 'white',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg-topbar)',
              animation: 'st-fade-in 0.2s ease',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}

          {/* Notification Dropdown */}
          {notifOpen && (
            <div
              className="animate-scale-in"
              style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 340, zIndex: 100,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-modal)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                    {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button className="st-btn-icon" style={{ width: 26, height: 26 }} onClick={() => setNotifOpen(false)}>
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {activeAlerts.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <CheckCircle2 size={32} style={{ color: 'var(--green)', margin: '0 auto 10px' }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No critical alerts</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>All employees are performing well.</div>
                  </div>
                ) : (
                  <>
                    {/* Critical Alerts Section */}
                    <div style={{ padding: '8px 18px 4px', fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Critical Performance Alerts
                    </div>
                    {activeAlerts.map((alert) => {
                      const isRead = readIds.has(alert.id);
                      return (
                        <div
                          key={alert.id}
                          onClick={() => {
                            markRead(alert.id);
                            setNotifOpen(false);
                            // Scroll to the alerts section
                            setTimeout(() => {
                              const el = document.getElementById('section-alert-banner');
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '11px 18px', cursor: 'pointer',
                            background: isRead ? 'transparent' : 'var(--red-soft)',
                            borderLeft: isRead ? '3px solid transparent' : '3px solid var(--red)',
                            transition: 'background 0.12s ease',
                            borderBottom: '1px solid var(--border)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = isRead ? 'var(--bg-elevated)' : 'rgba(255,59,48,0.13)'}
                          onMouseLeave={e => e.currentTarget.style.background = isRead ? 'transparent' : 'var(--red-soft)'}
                        >
                          <img
                            src={alert.avatar}
                            alt={alert.name}
                            style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'cover', flexShrink: 0, marginTop: 1 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: isRead ? 'var(--text-secondary)' : 'var(--red)', marginBottom: 2 }}>
                              {alert.message}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.45 }}>
                              {alert.reason}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.8 }}>
                              <Clock size={9} /> {alert.department} · Just now
                            </div>
                          </div>
                          {!isRead && (
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', flexShrink: 0, marginTop: 5 }} />
                          )}
                        </div>
                      );
                    })}

                    {/* System notification */}
                    <div style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AlertOctagon size={16} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                          Analytics report ready
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                          Weekly productivity trend data updated.
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.8 }}>
                          <Clock size={9} /> System · Today
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById('section-alert-banner');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  View all alerts on dashboard →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        {/* Profile Avatar */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 10px 4px 4px', borderRadius: 'var(--radius-full)',
              background: profileOpen ? 'var(--accent-soft)' : 'var(--bg-elevated)',
              border: `1px solid ${profileOpen ? 'var(--accent-border)' : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.15s ease', userSelect: 'none',
            }}
          >
            <img
              src={userAvatar}
              alt={user?.name}
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {user?.name?.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.2, fontWeight: 500 }}>
                {isOwner ? 'Admin' : user?.department}
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div
              className="animate-scale-in"
              style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 300, zIndex: 100,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-modal)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 20px 16px',
                background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--purple-soft) 100%)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={userAvatar} alt={user?.name}
                    style={{ width: 54, height: 54, borderRadius: 14, objectFit: 'cover', boxShadow: 'var(--shadow-card)' }} />
                  <span style={{ position: 'absolute', bottom: -3, right: -3, width: 14, height: 14, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--bg-card)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{user?.title || (isOwner ? 'Managing Director' : 'Team Member')}</div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5,
                    fontSize: 10, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isOwner ? 'var(--purple-soft)' : 'var(--accent-soft)',
                    color: isOwner ? 'var(--purple)' : 'var(--accent)',
                  }}>
                    {isOwner ? '🛡️ Owner / Admin' : '👤 Employee'}
                  </span>
                </div>
                <button onClick={() => setProfileOpen(false)} className="st-btn-icon" style={{ width: 28, height: 28, alignSelf: 'flex-start', flexShrink: 0 }}>
                  <X size={13} />
                </button>
              </div>

              {/* Fields */}
              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 20px 8px' }}>
                  Account Details
                </div>
                {profileFields.map(({ icon: Icon, label, value }) => value && (
                  <div
                    key={label}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 20px', transition: 'background 0.12s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                    </div>
                  </div>
                ))}
                {user?.joinedDate && (
                  <div style={{ padding: '4px 20px 8px', fontSize: 11, color: 'var(--text-tertiary)' }}>
                    📅 Joined: {new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', padding: '10px 12px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: 'var(--radius-md)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--red)', fontSize: 13, fontWeight: 600,
                    transition: 'background 0.12s ease', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
