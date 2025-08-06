import React, { useState, useEffect } from 'react';

const UserManagementModal = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: 'Operator' });

  // 🔁 Simulate API call to fetch users
  useEffect(() => {
    // Mock data fetch
    const fetchUsers = async () => {
      // In future: const response = await fetch('/api/users');
      const dummyUsers = [
        { email: 'operator@example.com', role: 'Operator' },
        { email: 'admin@example.com', role: 'Admin' },
      ];
      setUsers(dummyUsers);
    };
    fetchUsers();
  }, []);

  // ➕ Add user (simulated)
  const handleAddUser = () => {
    if (!newUser.email.trim()) return;
    setUsers([...users, newUser]);
    setNewUser({ email: '', role: 'Operator' });
    // In future: await fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) })
  };

  return (
    <div style={{ background: '#333', color: 'white', padding: '1.5rem', marginTop: '2rem', borderRadius: '8px' }}>
      <h2>User Access Management</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={{ padding: '0.5rem', marginRight: '1rem' }}
        >
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
        </select>
        <button onClick={handleAddUser} style={{ padding: '0.5rem 1.2rem' }}>Add User</button>
      </div>

      <ul>
        {users.map((user, idx) => (
          <li key={idx} style={{ margin: '0.5rem 0' }}>
            {user.email} — <strong>{user.role}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagementModal;
