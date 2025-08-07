import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import FileUpload from '../components/FileUpload';
import MailboxIntegration from '../components/MailboxIntegration';
import DocumentTable from '../components/DocumentTable';
import ManualRoutingModal from '../components/ManualRoutingModal';

export default function OperatorDashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const dashboardRef = useRef(null);
  const uploadsRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        const target = link.getAttribute('data-target');
        scrollToSection(target);
      });
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);

  const scrollToSection = (target) => {
    const refMap = {
      dashboard: dashboardRef,
      uploads: uploadsRef,
      table: tableRef,
    };

    const sectionRef = refMap[target];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const processClassifiedDocument = (doc) => {
    const confidenceThreshold = 0.8;
    const confidence = Math.random();

    return {
      ...doc,
      type: 'Unknown',
      confidence,
      status: confidence < confidenceThreshold ? 'Manual Routing Required' : 'Classified',
      needsManualRouting: confidence < confidenceThreshold,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  };

  const handleUpload = (files) => {
    const newDocs = Array.from(files).map((file) =>
      processClassifiedDocument({ name: file.name })
    );
    setDocuments([...documents, ...newDocs]);
  };

  const handleManualRoute = (doc) => {
    setSelectedDoc(doc);
  };

  const handleRouteConfirm = (doc, department) => {
    setDocuments((prevDocs) =>
      prevDocs.map((d) =>
        d.name === doc.name
          ? {
              ...d,
              status: `Routed to ${department}`,
              needsManualRouting: false,
              lastUpdated: new Date().toLocaleTimeString(),
            }
          : d
      )
    );

    setSelectedDoc(null);
    setToastMessage(`✅ Document routed to ${department}!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    onLogout();
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Logout Button */}
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
          zIndex: 1000,
        }}
      >
        Logout
      </button>

      <DashboardLayout role="Operator">
        {/* Welcome */}
        <div ref={dashboardRef} id="dashboard" style={{ paddingTop: '0' }}>
          <h2 style={{ color: 'white' }}>Welcome Operator</h2>
        </div>

        {/* Upload + Mailbox */}
        <div
          ref={uploadsRef}
          id="uploads"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            marginTop: '24px',
            width: '100%',
          }}
        >
          <div style={{ flex: '1 1 48%' , marginTop: '20px' }}>
            <FileUpload onUpload={handleUpload} />
          </div>

          <div style={{ flex: '1 1 48%' }}>
            <MailboxIntegration />
          </div>
        </div>

        {/* Table pushed below */}
        <div
          ref={tableRef}
          id="document-table"
          style={{
            marginTop: '32px',
            clear: 'both', // ensures it doesn't get overlapped
          }}
        >
          <DocumentTable documents={documents} onManualRoute={handleManualRoute} />
        </div>
      </DashboardLayout>

      {/* Manual Routing Modal */}
      {selectedDoc && (
        <ManualRoutingModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onRoute={handleRouteConfirm}
        />
      )}

      {/* Toast */}
      {toastMessage && (
        <div style={toastStyle}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// Toast styling
const toastStyle = {
  position: 'fixed',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#333',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '10px',
  fontSize: '0.95rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  zIndex: 9999,
  transition: 'opacity 0.3s ease',
};
