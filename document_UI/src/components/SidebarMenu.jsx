
import React from 'react';

export default function SidebarMenu({ role }) {
  const menuItems = role === 'Admin'
    ? ['Dashboard', 'Analytics', 'User Control']
    : ['Dashboard', 'Mailbox', 'Uploads'];

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>{role} Panel</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '12px', cursor: 'pointer' }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}