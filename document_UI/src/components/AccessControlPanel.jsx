import React from 'react';

export default function AccessControlPanel() {
  const users = [
    { name: 'Operator1', role: 'Upload Only' },
    { name: 'Viewer', role: 'Read Only' },
  ];

  return (
    <div style={{ background: '#2c2c36', padding: '20px', borderRadius: '8px' }}>
      <h3>User Access Control</h3>
      {users.map((user, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>{user.name}</div>
          <div>{user.role}</div>
          <button style={{ background: '#ff4d4d', border: 'none', padding: '5px 10px', borderRadius: '4px', color: '#fff' }}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
