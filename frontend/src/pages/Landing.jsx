import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Activity, Check, X, ArrowRight, Sun, Moon, ChevronLeft,
  Building2, CheckCircle2, ShieldCheck, Tag, Zap
} from 'lucide-react';

const tiers = [
  {
    name: 'Basic',
    price: { monthly: 19, annual: 15 },
    badge: 'Starter', badgeStyle: 'st-pill-neutral',
    target: 'Up to 15 employees',
    description: 'Essential task logging & daily performance tracking for small teams.',
    btnText: 'Start Free Trial',
    highlight: false,
    features: [
      'Employee Workspace & Task Logger',
      'Personal Performance Scorecard',
      'Task Status & Hours Tracking',
      'Single Department',
      'Standard Email Support',
    ],
    missing: [
      'Executive Owner Dashboard',
      'Automated Alert System',
      'Analytics Suite & Charts',
      'Top Performer Leaderboards',
      'Custom SSO / SAML',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 49, annual: 39 },
    badge: 'Most Popular', badgeStyle: 'st-pill-accent',
    target: '15–100 employees',
    description: 'Full executive oversight, automated alerts, and analytics suite.',
    btnText: 'Request Pro Demo',
    highlight: true,
    features: [
      'Everything in Basic',
      'Executive Owner Control Center',
      'Automated Critical Alert System (<40% / 3 missed)',
      'Interactive Analytics Suite (Bar, Line, Pie Charts)',
      'Top Performers & Needs Attention Leaderboards',
      'Multi-Department Filtering',
      'Task Rating & Owner Review Modal',
      '24/7 Priority Chat & Email Support',
    ],
    missing: ['Custom SSO / SAML', 'Dedicated Enterprise Account Manager'],
  },
  {
    name: 'Enterprise',
    price: { monthly: 99, annual: 79 },
    badge: 'Enterprise Grade', badgeStyle: 'st-pill-purple',
    target: '100+ employees',
    description: 'Custom SLA, SSO, dedicated infrastructure & unlimited scale.',
    btnText: 'Contact Sales',
    highlight: false,
    features: [
      'Everything in Pro',
      'Unlimited Employee Profiles',
      'Custom DB Connectors (PostgreSQL / Snowflake)',
      'Single Sign-On (SSO / SAML / OAuth2)',
      'Custom SLA (99.99% Uptime)',
      'On-Premises or Private Cloud Deployment',
      'Dedicated Account Manager',
      'Custom API Integrations & Webhooks',
    ],
    missing: [],
  },
];

const matrixRows = [
  { label: 'Employee Task Logger & Workspace', basic: true, pro: true, ent: true },
  { label: 'Personal Performance Summary', basic: true, pro: true, ent: true },
  { label: 'Executive Owner Control Center', basic: false, pro: true, ent: true },
  { label: 'Automated Alert System (<40% / 3 Missed)', basic: false, pro: true, ent: true },
  { label: 'Analytics Suite (Bar, Line & Pie Charts)', basic: false, pro: true, ent: true },
  { label: 'Leaderboard Sections', basic: false, pro: true, ent: true },
  { label: 'Multi-Department Hierarchy & Filtering', basic: false, pro: true, ent: true },
  { label: 'Owner Task Rating & Review Modal', basic: false, pro: true, ent: true },
  { label: 'Custom SSO / SAML / OAuth2', basic: false, pro: false, ent: true },
  { label: 'Dedicated Account Manager', basic: false, pro: false, ent: true },
  { label: 'Custom SLA (99.99% Uptime)', basic: false, pro: false, ent: true },
];

export const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [demoModal, setDemoModal] = useState(null);
  const [demoName, setDemoName] = useState('');
  const [demoCompany, setDemoCompany] = useState('Patel PVT LTD');
  const [demoEmail, setDemoEmail] = useState('');
  const [teamSize, setTeamSize] = useState('15-50 Employees');
  const [submitted, setSubmitted] = useState(false);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setDemoModal(null); setSubmitted(false); }, 2800);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Top Navigation */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px', background: 'var(--bg-topbar)',
        backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div
          onClick={() => navigate(user ? (user.role === 'owner' ? '/owner-dashboard' : '/employee-dashboard') : '/login')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={16} color="white" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            SmartTrack <span style={{ color: 'var(--accent)' }}>CRM</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(user ? (user.role === 'owner' ? '/owner-dashboard' : '/employee-dashboard') : '/login')}
            className="st-btn-ghost" style={{ fontSize: 12, padding: '7px 16px' }}
          >
            {user ? '← Back to Dashboard' : 'Log In'}
          </button>
          <button className="st-btn-icon" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <Sun size={15} style={{ color: 'var(--amber)' }} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '72px 24px 56px', maxWidth: 680, margin: '0 auto' }}>
          <span className="st-pill st-pill-accent" style={{ marginBottom: 20, display: 'inline-flex', gap: 6, padding: '5px 14px' }}>
            <Zap size={13} /> Business Model & Pricing Showcase
          </span>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.08, color: 'var(--text-primary)', margin: '16px 0' }}>
            Boost Team Efficiency by{' '}
            <span style={{ color: 'var(--accent)' }}>40%</span> with<br />SmartTrack CRM
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-tertiary)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 32px', fontWeight: 400 }}>
            Real-time task tracking, automated performance alerts, and executive analytics — designed for modern teams.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="st-btn-primary" style={{ padding: '12px 24px', fontSize: 14, borderRadius: 'var(--radius-lg)' }} onClick={() => setDemoModal('Pro')}>
              Request Product Demo <ArrowRight size={16} />
            </button>
            <button
              className="st-btn-secondary" style={{ padding: '12px 24px', fontSize: 14 }}
              onClick={() => navigate(user ? (user.role === 'owner' ? '/owner-dashboard' : '/employee-dashboard') : '/login')}
            >
              <ShieldCheck size={15} style={{ color: 'var(--accent)' }} /> {user ? 'Open Dashboard' : 'View Live Demo'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
            {['14-Day Free Trial', 'No Credit Card Required', 'Cancel Anytime'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                <CheckCircle2 size={13} style={{ color: 'var(--green)' }} /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Billing Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 40 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: billing === 'monthly' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Monthly</span>
          <button
            className={`st-toggle ${billing === 'annual' ? 'on' : ''}`}
            onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: billing === 'annual' ? 'var(--text-primary)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 7 }}>
            Annual
            <span className="st-pill st-pill-green" style={{ padding: '2px 8px' }}>Save 20%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 80, alignItems: 'start' }}>
          {tiers.map(tier => {
            const price = billing === 'annual' ? tier.price.annual : tier.price.monthly;
            return (
              <div
                key={tier.name}
                className={`st-card${tier.highlight ? '-accent' : ''}`}
                style={{
                  padding: 28, position: 'relative', overflow: 'hidden',
                  transform: tier.highlight ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <span className={`st-pill ${tier.badgeStyle}`} style={{ padding: '3px 10px' }}>{tier.badge}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>{tier.target}</span>
                </div>

                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>{tier.name} Tier</h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.55, marginBottom: 20, minHeight: 36 }}>{tier.description}</p>

                <div style={{ padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>${price}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>/ user / month</span>
                  </div>
                  {billing === 'annual' && (
                    <p style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600, marginTop: 2 }}>
                      Billed annually · ${price * 12}/year
                    </p>
                  )}
                </div>

                <button
                  className={tier.highlight ? 'st-btn-primary' : 'st-btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', padding: '11px', marginBottom: 22, borderRadius: 'var(--radius-lg)', fontSize: 13 }}
                  onClick={() => setDemoModal(tier.name)}
                >
                  {tier.btnText} <ArrowRight size={14} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      <Check size={13} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }} /> {f}
                    </div>
                  ))}
                  {tier.missing.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4, opacity: 0.6 }}>
                      <X size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 1 }} />
                      <s>{f}</s>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Matrix */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 8 }}>Full Feature Comparison</h2>
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Compare Basic, Pro, and Enterprise plans side by side.</p>
          </div>

          <div className="st-card" style={{ overflow: 'hidden' }}>
            <table className="st-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ width: '52%' }}>Capabilities & Features</th>
                  <th style={{ textAlign: 'center' }}>Basic</th>
                  <th style={{ textAlign: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>Pro ⭐</th>
                  <th style={{ textAlign: 'center' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {matrixRows.map(row => (
                  <tr key={row.label}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.label}</td>
                    <td style={{ textAlign: 'center' }}>{row.basic ? <Check size={16} style={{ color: 'var(--green)', margin: 'auto' }} /> : <X size={14} style={{ color: 'var(--border-strong)', margin: 'auto' }} />}</td>
                    <td style={{ textAlign: 'center', background: 'var(--accent-soft)' }}>{row.pro ? <Check size={16} style={{ color: 'var(--accent)', margin: 'auto' }} /> : <X size={14} style={{ color: 'var(--border-strong)', margin: 'auto' }} />}</td>
                    <td style={{ textAlign: 'center' }}>{row.ent ? <Check size={16} style={{ color: 'var(--purple)', margin: 'auto' }} /> : <X size={14} style={{ color: 'var(--border-strong)', margin: 'auto' }} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="st-card" style={{ textAlign: 'center', padding: '56px 32px', marginBottom: 80, background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--purple-soft) 100%)', border: '1.5px solid var(--accent-border)' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 12 }}>
            Ready to Elevate Your Team's Productivity?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Schedule a personalized demo with our team to see SmartTrack CRM configured for your organization.
          </p>
          <button className="st-btn-primary" style={{ padding: '13px 28px', fontSize: 14, margin: 'auto' }} onClick={() => setDemoModal('Pro')}>
            <Building2 size={16} /> Schedule Live Demo <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Demo Modal */}
      {demoModal && (
        <div className="st-overlay" onClick={() => { setDemoModal(null); setSubmitted(false); }}>
          <div className="st-modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Request Demo</h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{demoModal} Plan</p>
              </div>
              <button className="st-btn-icon" onClick={() => { setDemoModal(null); setSubmitted(false); }}><X size={16} /></button>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🎉</div>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Demo Request Submitted!</h4>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 300, margin: '0 auto' }}>
                  An enterprise specialist will reach out to {demoEmail || 'you'} within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Full Name', value: demoName, setter: setDemoName, placeholder: 'Sarah Jenkins', type: 'text', required: true },
                  { label: 'Company Name', value: demoCompany, setter: setDemoCompany, placeholder: 'XYZ Pvt Ltd', type: 'text', required: true },
                  { label: 'Work Email', value: demoEmail, setter: setDemoEmail, placeholder: 'sarah@xyzcorp.com', type: 'email', required: true },
                ].map(({ label, value, setter, placeholder, type, required }) => (
                  <div key={label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} required={required} className="st-input" />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Team Size</label>
                  <select value={teamSize} onChange={e => setTeamSize(e.target.value)} className="st-input st-select">
                    <option>1–15 Employees (Basic)</option>
                    <option>15–50 Employees (Pro)</option>
                    <option>50–100 Employees (Pro)</option>
                    <option>100+ Employees (Enterprise)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                  <button type="button" className="st-btn-secondary" onClick={() => setDemoModal(null)}>Cancel</button>
                  <button type="submit" className="st-btn-primary">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
