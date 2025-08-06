import React, { useEffect, useState } from 'react';
import { initGmailClient, signInWithGmail, listGmailMessages } from '../utils/GmailAuth';

const MailboxIntegration = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    initGmailClient();
  }, []);

  const fetchEmails = async () => {
    try {
      await signInWithGmail();
      const messages = await listGmailMessages();
      setEmails(messages);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  return (
    <div className="mailbox-section">
      <h2>Mailbox Integration</h2>
      <p>Automatically fetch documents from the designated email inbox.</p>
      <button onClick={fetchEmails}>Sync Mailbox</button>

      {emails.length > 0 && (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>Email ID: {email.id}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MailboxIntegration;
