import React, { useState } from 'react';

export default function ManualRoutingModal({ doc, onClose, onRoute }) {
  const [selectedDept, setSelectedDept] = useState('');

  const handleRoute = () => {
    if (selectedDept) {
      onRoute(doc, selectedDept);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2 style={{ marginBottom: '16px', color: '#fff' }}>Manual Routing</h2>
        <label htmlFor="department" style={{ color: '#ccc', fontSize: '0.95rem' }}>
          Select Department
        </label>
        <select
          id="department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={dropdownStyle}
        >
          <option value="">-- Select --</option>
          <option value="Finance">Finance</option>
          <option value="Legal">Legal</option>
          <option value="HR">HR</option>
          <option value="Operations">Operations</option>
        </select>

        <div style={btnGroupStyle}>
          <button onClick={onClose} style={cancelTextBtn}>Cancel</button>
          <button
            onClick={handleRoute}
            disabled={!selectedDept}
            style={{
              ...confirmBtn,
              opacity: selectedDept ? 1 : 0.6,
              cursor: selectedDept ? 'pointer' : 'not-allowed',
            }}
          >
            Confirm Routing
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const popupStyle = {
  backgroundColor: '#1e1e28',
  padding: '24px 28px',
  borderRadius: '16px',
  width: '320px',
  textAlign: 'center',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
};

const dropdownStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '8px',
  marginBottom: '20px',
  borderRadius: '12px',
  border: '1px solid #555',
  fontSize: '1rem',
  backgroundColor: '#2d2d3a',
  color: 'white',
};

const btnGroupStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '12px',
};

const confirmBtn = {
  backgroundColor: '#2196f3',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
};

const cancelTextBtn = {
  background: 'none',
  border: 'none',
  color: '#ccc',
  fontSize: '0.95rem',
  cursor: 'pointer',
  padding: 0,
};
