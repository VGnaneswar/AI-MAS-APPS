import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import FileUpload from '../components/FileUpload';
import MailboxIntegration from '../components/MailboxIntegration';
import DocumentTable from '../components/DocumentTable';

export default function OperatorDashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);

  const handleUpload = (files) => {
    const newDocs = Array.from(files).map((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      let type = 'Other';
      if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(extension)) type = extension.toUpperCase();

      return {
        name: file.name,
        type,
        status: 'Ingested',
        lastUpdated: new Date().toLocaleTimeString(),
      };
    });

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    onLogout();
  };

  return (
    <div style={{ position: 'relative' }}>
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

      <DashboardLayout role="Operator">
        <h2>Welcome Operator: {user.email}</h2>
        <FileUpload onUpload={handleUpload} />
        <MailboxIntegration />
        <DocumentTable documents={documents} />
      </DashboardLayout>
    </div>
  );
}