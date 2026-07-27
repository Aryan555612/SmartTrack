import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppShell = ({ children, alertCount = 0, activeAlerts = [] }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div
        className={`st-main ${collapsed ? 'sidebar-collapsed' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <TopBar alertCount={alertCount} activeAlerts={activeAlerts} onMenuToggle={() => setCollapsed(c => !c)} />

        <main
          style={{ flex: 1, padding: '28px 32px 48px', overflowY: 'auto' }}
          className="page-enter"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
