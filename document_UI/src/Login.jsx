import React, { useState } from 'react';

const mockUsers = {
  Admin: { email: 'admin@doc.com', password: 'admin123' },
  Operator: { email: 'operator@doc.com', password: 'operator123' },
};

export default function Login({ onLogin }) {
  const [role, setRole] = useState('Operator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const creds = mockUsers[role];
      if (email === creds.email && password === creds.password) {
        onLogin({ role, email });
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      style={{
        background: '#021146', // Dark Blue
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '20px',
          width: '320px',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Hexaware Logo */}
        <img
          src="/hexaware-logo.jpeg"
          alt="Hexaware Logo"
          style={{
            width: '140px',
            marginBottom: '20px',
          }}
        />

        <h2 style={{ marginBottom: '20px', color: '#000' }}>Login</h2>

        <label style={{ float: 'left', color: '#000' }}>Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
          }}
          disabled={loading}
        >
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
        </select>

        <label style={{ float: 'left', color: '#000' }}>Email:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
          }}
          disabled={loading}
        />

        <label style={{ float: 'left', color: '#000' }}>Password:</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
          }}
          disabled={loading}
        />

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: '#489af0',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
