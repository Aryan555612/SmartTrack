import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Activity, ChevronRight, Sun, Moon, ShieldCheck, UserCheck,
  Eye, EyeOff, UserPlus, LogIn, CheckCircle2
} from 'lucide-react';
import { apiFetch } from '../utils/api';

const DEMO_EMPLOYEES = [
  { id: 'usr_emp_2',  employeeId: 'EMP-102', name: 'David Chen',    email: 'david@smarttrack.com',  department: 'Development' },
  { id: 'usr_emp_7',  employeeId: 'EMP-107', name: 'James Wilson',  email: 'james@smarttrack.com',  department: 'Sales' },
  { id: 'usr_emp_12', employeeId: 'EMP-112', name: 'Maria Garcia',  email: 'maria@smarttrack.com',  department: 'Support' },
  { id: 'usr_emp_15', employeeId: 'EMP-115', name: 'Daniel Martinez', email: 'daniel@smarttrack.com', department: 'Support' },
  { id: 'usr_emp_1',  employeeId: 'EMP-101', name: 'Alex Rivera',   email: 'alex@smarttrack.com',   department: 'Development' },
];

const DEPT_COLOR = { Development: '#0A84FF', Sales: '#30D158', Support: '#FF9500' };

const DEPARTMENTS = ['Development', 'Sales', 'Support', 'Marketing', 'Design', 'HR', 'Finance', 'Operations'];

export const Login = () => {
  const [mode, setMode]       = useState('signin'); // 'signin' | 'signup'
  const [role, setRole]       = useState('employee');

  // Sign-in fields
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Sign-up fields
  const [regName, setRegName]       = useState('');
  const [regEmail, setRegEmail]     = useState('');
  const [regPwd, setRegPwd]         = useState('');
  const [regPwd2, setRegPwd2]       = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [regDept, setRegDept]       = useState('Development');
  const [regTitle, setRegTitle]     = useState('');
  const [regCompany, setRegCompany] = useState('');

  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  /* ── Sign In ── */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await apiFetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.user, data.token);
        navigate(data.user.role === 'owner' ? '/owner-dashboard' : '/employee-dashboard');
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError(err.message || 'Connection error. Is the server running?');
    } finally { setLoading(false); }
  };

  /* ── Sign Up ── */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (regPwd !== regPwd2) { setError('Passwords do not match.'); return; }
    if (regPwd.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res  = await apiFetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName, email: regEmail, password: regPwd, role,
          department: role === 'employee' ? regDept : undefined,
          title: regTitle || undefined,
          company: role === 'owner' ? regCompany : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.user, data.token);
        navigate(data.user.role === 'owner' ? '/owner-dashboard' : '/employee-dashboard');
      } else if (res.status === 409) {
        // Email already exists — offer sign-in instead
        setError(`__duplicate__${regEmail}`);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Sign-up error:', err);
      setError(err.message || 'Connection error. Is the server running?');
    } finally { setLoading(false); }
  };

  const handleQuickLogin = (emp) => { setEmail(emp.email); setPassword('password123'); };
  const handleOwnerQuick = () => { setEmail('owner@smarttrack.com'); setPassword('password123'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 28px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="white" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            SmartTrack <span style={{ color: 'var(--accent)' }}>CRM</span>
          </span>
        </div>
        <button className="st-btn-icon" onClick={toggleTheme} title="Toggle theme">
          {isDark ? <Sun size={16} style={{ color: 'var(--amber)' }} /> : <Moon size={16} />}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: 48 }}>
        {/* Auth Card */}
        <div className="st-card animate-scale-in" style={{ width: '100%', maxWidth: 420, padding: 28 }}>

          {/* Mode Tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 22,
          }}>
            {[
              { key: 'signin', label: 'Sign In', Icon: LogIn },
              { key: 'signup', label: 'Create Account', Icon: UserPlus },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                style={{
                  padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s ease',
                  background: mode === key ? 'var(--bg-card)' : 'transparent',
                  color: mode === key ? 'var(--accent)' : 'var(--text-tertiary)',
                  boxShadow: mode === key ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { value: 'employee', label: 'Employee', Icon: UserCheck },
              { value: 'owner',    label: 'Owner / Admin', Icon: ShieldCheck },
            ].map(({ value, label, Icon }) => (
              <button
                key={value}
                onClick={() => { setRole(value); setError(''); if (value === 'owner' && mode === 'signin') handleOwnerQuick(); }}
                style={{
                  padding: '9px 10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s ease',
                  background: role === value ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                  color: role === value ? 'var(--accent)' : 'var(--text-tertiary)',
                  border: role === value ? '1.5px solid var(--accent-border)' : '1.5px solid transparent',
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Header */}
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 3 }}>
              {mode === 'signin' ? 'Welcome back' : `Create ${role === 'owner' ? 'Owner' : 'Employee'} Account`}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {mode === 'signin'
                ? 'Sign in to your SmartTrack workspace'
                : `Register a new ${role === 'owner' ? 'admin/owner' : 'employee'} account for SmartTrack CRM`}
            </p>
          </div>

          {/* ── SIGN IN FORM ── */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="st-input" />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="st-input" style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPwd(s => !s)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}>
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && <div style={{ padding: '9px 12px', borderRadius: 'var(--radius-md)', background: 'var(--red-soft)', color: 'var(--red)', fontSize: 12, fontWeight: 500 }}>{error}</div>}

              <button type="submit" disabled={loading} className="st-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', borderRadius: 'var(--radius-lg)', marginTop: 2 }}>
                {loading ? 'Signing in…' : 'Sign In'} {!loading && <ChevronRight size={14} />}
              </button>

              {/* Quick Demo */}
              {role === 'employee' && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Quick Demo</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {DEMO_EMPLOYEES.map(emp => (
                      <button
                        key={emp.id} type="button"
                        onClick={() => handleQuickLogin(emp)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '7px 10px', borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                          cursor: 'pointer', width: '100%', textAlign: 'left',
                          transition: 'border-color 0.12s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: DEPT_COLOR[emp.department] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: DEPT_COLOR[emp.department] }}>{emp.name[0]}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{emp.employeeId} · {emp.department}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: DEPT_COLOR[emp.department] + '1A', color: DEPT_COLOR[emp.department] }}>
                          {emp.department}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {role === 'owner' && (
                <div style={{ marginTop: 6, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>Owner Demo Account</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Aryan Patel · CEO of company</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>Credentials auto-filled ↑</div>
                </div>
              )}

              <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-tertiary)', marginTop: 4 }}>
                Don't have an account?{' '}
                <span onClick={() => switchMode('signup')} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
                  Create one →
                </span>
              </p>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Full Name *</label>
                  <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} placeholder="e.g. John Smith" className="st-input" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Work Email *</label>
                  <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="john@company.com" className="st-input" />
                </div>

                {role === 'employee' ? (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Department *</label>
                    <select value={regDept} onChange={e => setRegDept(e.target.value)} className="st-input st-select">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Company Name</label>
                    <input type="text" value={regCompany} onChange={e => setRegCompany(e.target.value)} placeholder="Patel PVT LTD" className="st-input" />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Job Title</label>
                  <input type="text" value={regTitle} onChange={e => setRegTitle(e.target.value)} placeholder={role === 'owner' ? 'CEO / Director' : 'Engineer'} className="st-input" />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showRegPwd ? 'text' : 'password'} required value={regPwd} onChange={e => setRegPwd(e.target.value)} placeholder="Min 6 chars" className="st-input" style={{ paddingRight: 38 }} />
                    <button type="button" onClick={() => setShowRegPwd(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}>
                      {showRegPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Confirm Password *</label>
                  <input type="password" required value={regPwd2} onChange={e => setRegPwd2(e.target.value)} placeholder="Repeat password" className="st-input"
                    style={{ borderColor: regPwd2 && regPwd !== regPwd2 ? 'var(--red)' : undefined }} />
                </div>
              </div>

              {/* Password match indicator */}
              {regPwd && regPwd2 && (
                <div style={{ fontSize: 11, fontWeight: 600, color: regPwd === regPwd2 ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle2 size={12} /> {regPwd === regPwd2 ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}

              {/* Password strength */}
              {regPwd && (
                <div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[6, 8, 12].map((len, i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: regPwd.length >= len ? ['var(--red)', 'var(--amber)', 'var(--green)'][i] : 'var(--border)' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 3 }}>
                    {regPwd.length < 6 ? 'Too short' : regPwd.length < 8 ? 'Weak' : regPwd.length < 12 ? 'Fair' : 'Strong'}
                  </div>
                </div>
              )}

              {error && (
                error.startsWith('__duplicate__') ? (
                  <div style={{ padding: '11px 14px', borderRadius: 'var(--radius-md)', background: 'var(--amber-soft)', border: '1px solid rgba(255,149,0,0.28)', fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: 'var(--amber)', marginBottom: 4 }}>⚠️ Email already registered</div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <strong>{error.replace('__duplicate__', '')}</strong> already has a <strong>{role}</strong> account.
                    </div>
                    <button
                      type="button"
                      onClick={() => { setEmail(error.replace('__duplicate__', '')); setPassword(''); switchMode('signin'); }}
                      style={{ fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--accent)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}
                    >
                      Sign In with this email instead →
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '9px 12px', borderRadius: 'var(--radius-md)', background: 'var(--red-soft)', color: 'var(--red)', fontSize: 12, fontWeight: 500 }}>{error}</div>
                )
              )}
              {success && <div style={{ padding: '9px 12px', borderRadius: 'var(--radius-md)', background: 'var(--green-soft)', color: 'var(--green)', fontSize: 12, fontWeight: 500 }}>{success}</div>}

              <button type="submit" disabled={loading} className="st-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', borderRadius: 'var(--radius-lg)' }}>
                {loading ? 'Creating account…' : `Create ${role === 'owner' ? 'Owner' : 'Employee'} Account`}
                {!loading && <ChevronRight size={14} />}
              </button>

              <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-tertiary)', marginTop: 2 }}>
                Already have an account?{' '}
                <span onClick={() => switchMode('signin')} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
                  Sign In →
                </span>
              </p>
            </form>
          )}
        </div>

        {/* Right illustration (desktop) */}
        <div className="login-illustration" style={{ display: 'none', maxWidth: 360, flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.15 }}>
            Track, Analyze &<br /><span style={{ color: 'var(--accent)' }}>Elevate</span> your<br />team's performance.
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
            SmartTrack CRM gives owners real-time visibility and employees a streamlined daily workspace.
          </p>
          {[
            { color: '#0A84FF', label: '15+ active employees tracked' },
            { color: '#30D158', label: 'Automated efficiency alerts' },
            { color: '#5E5CE6', label: 'Executive analytics suite' },
            { color: '#FF9500', label: 'Instant account registration' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .login-illustration { display: flex !important; } }
      `}</style>
    </div>
  );
};

