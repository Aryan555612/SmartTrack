import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CheckSquare, BarChart3, Tag, LogOut,
  ShieldCheck, Activity, ChevronLeft, ChevronRight, Users
} from 'lucide-react';

export const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOwner = user?.role === 'owner';

  const ownerNav = [
    { icon: LayoutDashboard, label: 'Overview',  path: '/owner-dashboard', scrollTo: 'section-kpis' },
    { icon: Users,           label: 'Team',      path: '/owner-dashboard', scrollTo: 'section-table' },
    { icon: BarChart3,       label: 'Analytics', path: '/owner-dashboard', scrollTo: 'section-charts' },
    { icon: Tag,             label: 'Pricing',   path: '/pricing' },
  ];

  const employeeNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employee-dashboard', scrollTo: 'section-emp-top' },
    { icon: CheckSquare,     label: 'My Tasks',  path: '/employee-dashboard', scrollTo: 'section-tasks' },
    { icon: Tag,             label: 'Pricing',   path: '/pricing' },
  ];

  const navItems = isOwner ? ownerNav : employeeNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`st-sidebar ${collapsed ? 'collapsed' : ''}`}
      style={{ userSelect: 'none' }}
    >
      {/* Brand */}
      <div
        style={{
          padding: collapsed ? '20px 0' : '20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '8px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          cursor: 'pointer',
        }}
        onClick={() => navigate(isOwner ? '/owner-dashboard' : '/employee-dashboard')}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 4px 12px rgba(10,132,255,0.35)'
        }}>
          <Activity size={18} color="white" />
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              SmartTrack
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>
              CRM v1.0
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '4px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && (
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '8px 24px 4px',
          }}>
            {isOwner ? 'Admin' : 'Workspace'}
          </div>
        )}

        {navItems.map(({ icon: Icon, label, path, scrollTo }) => {
          const isActive = location.pathname === path && label !== 'Pricing';
          const isPricingActive = path === '/pricing' && location.pathname === '/pricing';

          const handleClick = () => {
            if (path !== location.pathname) {
              // Navigate first, then scroll after a short delay for render
              navigate(path);
              if (scrollTo) {
                setTimeout(() => {
                  const el = document.getElementById(scrollTo);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
              }
            } else if (scrollTo) {
              // Already on the same page — just scroll
              const el = document.getElementById(scrollTo);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };

          return (
            <div
              key={label}
              className={`st-nav-item ${(isActive || isPricingActive) ? 'active' : ''}`}
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '9px 14px',
                margin: collapsed ? '2px 8px' : '2px 10px',
              }}
              onClick={handleClick}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="st-nav-icon" />
              {!collapsed && <span>{label}</span>}
            </div>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: collapsed ? '12px 0' : '12px 10px',
      }}>
        {!collapsed && user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', marginBottom: 4,
            borderRadius: 'var(--radius-md)',
          }}>
            <img
              src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
              alt={user.name}
              style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                {isOwner ? 'Owner / Admin' : user.department}
              </div>
            </div>
          </div>
        )}

        <div
          className="st-nav-item"
          style={{
            color: 'var(--red)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '9px 14px',
            margin: collapsed ? '0 8px' : '0 0',
          }}
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: 24,
          right: -14,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)',
          transition: 'color 0.15s ease',
          zIndex: 10,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};
