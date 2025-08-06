// Login.jsx
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
  const [loading, setLoading] = useState(false); // NEW

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show spinner

    // Simulate API delay
    setTimeout(() => {
      const creds = mockUsers[role];
      if (email === creds.email && password === creds.password) {
        onLogin({ role, email });
      } else {
        setError('Invalid credentials');
      }
      setLoading(false); // Hide spinner
    }, 1500); // simulate network delay
  };

  return (
    <div
      style={{
        background: '#1a1a1a',
        color: '#fff',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: '#2c2c36',
          padding: '30px',
          borderRadius: '10px',
          width: '300px',
          textAlign: 'center',
        }}
      >
        <img
          src="/login-anime.gif"
          alt="Login Logo"
          style={{
            width: '80px',
            height: '80px',
            marginBottom: '20px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />

        <h2 style={{ marginBottom: '20px' }}>Login</h2>

        <label style={{ float: 'left' }}>Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
          disabled={loading}
        >
          <option value="Operator">Operator</option>
          <option value="Admin">Admin</option>
        </select>

        <label style={{ float: 'left' }}>Email:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
          disabled={loading}
        />

        <label style={{ float: 'left' }}>Password:</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
          disabled={loading}
        />

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: '#489af0',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            position: 'relative',
          }}
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Spinner style */}
      <style>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #ffffff;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}