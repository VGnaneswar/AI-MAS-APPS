import React, { useEffect } from 'react';
import { initGmailClient, signInWithGmail, listGmailMessages } from '../utils/GmailAuth';

export default function MailboxIntegration({ setDocuments }) {
  useEffect(() => {
    initGmailClient(); // Initialize Gmail API
  }, []);

  const handleSyncMailbox = async () => {
    try {
      await signInWithGmail(); // Opens Google Sign-In popup
      const messages = await listGmailMessages(); // Fetch messages

      // Simulated mapping to documents
      const fetchedDocs = messages.map((msg, index) => ({
        name: `Email Document ${index + 1}`,
        type: 'Unknown',
        confidence: Math.random(),
        status: 'Extracted',
        lastUpdated: new Date().toLocaleTimeString(),
      }));

      setDocuments((prev) => [...prev, ...fetchedDocs]);
    } catch (error) {
      console.error('Gmail sync failed:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>📬 Mailbox Sync</h3>
      <p style={descriptionStyle}>
        Fetch documents directly from your connected email inbox.
      </p>
      <button onClick={handleSyncMailbox} style={buttonStyle}>
        Sync Now
      </button>
    </div>
  );
}

// Styles
const containerStyle = {
  backgroundColor: '#2c2c36',
  padding: '24px',
  borderRadius: '16px',
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
};

const headingStyle = {
  color: '#fff',
  fontSize: '1.3rem',
  marginBottom: '10px',
  fontWeight: '600',
};

const descriptionStyle = {
  color: '#bbb',
  fontSize: '0.95rem',
  marginBottom: '20px',
};

const buttonStyle = {
  backgroundColor: '#4caf50',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};
