import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import OperatorDashboard from './pages/OperatorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <BrowserRouter>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : user.role === 'Admin' ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <OperatorDashboard user={user} onLogout={handleLogout} />
      )}
    </BrowserRouter>
  );
}

export default App;

