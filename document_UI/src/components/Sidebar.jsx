import React from 'react';
import './Sidebar.css';

const Sidebar = ({ items }) => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
