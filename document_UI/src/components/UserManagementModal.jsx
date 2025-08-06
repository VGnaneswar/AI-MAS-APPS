import React, { useState } from 'react';

const UserManagementModal = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Operator');
  const [users, setUsers] = useState([
    { email: 'operator@example.com', role: 'Operator' },
    { email: 'admin@example.com', role: 'Admin' },
  ]);

  const handleAddUser = () => {
    if (email.trim() === '') return;
    setUsers([...users, { email, role }]);
    setEmail('');
    setRole('Operator');
  };

  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '30px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
      }}
    >
      <h2 style={{ color: '#fff', marginBottom: '15px' }}>
        User Access Management
      </h2>

      {/* Input Row */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '10px',
            width: '250px', // Reduced width
            borderRadius: '10px',
            border: 'none',
            marginRight: '10px',
            outline: 'none'
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            marginRight: '10px',
            outline: 'none'
          }}
        >
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          onClick={handleAddUser}
          style={{
            padding: '10px 20px',
            backgroundColor: '#409eff',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Add User
        </button>
      </div>

      {/* User List */}
      <ul style={{ listStyleType: 'disc', color: '#fff', paddingLeft: '20px' }}>
        {users.map((user, index) => (
          <li key={index} style={{ marginBottom: '6px' }}>
            {user.email} — <strong>{user.role}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagementModal;
