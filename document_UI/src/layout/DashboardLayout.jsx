import React from 'react';
import SidebarMenu from '../components/SidebarMenu';
import TopNavbar from '../components/TopNavbar';

const layoutStyle = {
  display: 'flex',
  height: '100vh',
  backgroundColor: '#1e1e26ff',
  color: '#fff',
};

const sidebarStyle = {
  width: '220px',
  backgroundColor: '#324451ff',
  padding: '20px',
};

const contentWrapperStyle = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  padding: '20px',
  overflowY: 'auto',
  flexGrow: 1,
};

export default function DashboardLayout({ children, role }) {
  return (
    <div style={layoutStyle}>
      <div style={sidebarStyle}>
        <SidebarMenu role={role} />
      </div>
      <div style={contentWrapperStyle}>
        <TopNavbar />
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}
