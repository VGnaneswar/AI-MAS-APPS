
import React from 'react';
import Sidebar from '../components/Sidebar';
import AdminAnalytics from '../components/AdminAnalytics';
import UserManagementModal from '../components/UserManagementModal';

const AdminDashboard = ({ user, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    onLogout();
  };

  // Extract just the username (before '@') if email exists
  const username = user?.email?.split('@')[0] || 'Admin';

  return (
    <div style={{ position: 'relative' }}>
      {/* Logout button - top right */}
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Logout
      </button>

      {/* Sidebar */}
      <Sidebar items={['Dashboard', 'Access Control']} />

      {/* Main content area */}
      <div
        style={{
          marginLeft: '250px',
          padding: '20px',
          background: '#2e2e2e',
          minHeight: '100vh',
          color: 'white',
        }}
      >
        <h1>Welcome, {username}</h1>

        {/* Admin Dashboard content */}
        <AdminAnalytics />
        <UserManagementModal />
      </div>
    </div>
  );
};

export default AdminDashboard;

