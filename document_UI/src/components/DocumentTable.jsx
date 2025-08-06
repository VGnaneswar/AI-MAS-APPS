import React from 'react';

export default function DocumentTable({ documents }) {
  const getStatusStyle = (status) => {
    const baseStyle = {
      color: 'white',
      padding: '4px 10px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      textTransform: 'capitalize',
    };

    return {
      ...baseStyle,
      backgroundColor: status.toLowerCase() === 'processed' ? '#00c471' : '#7a7a7a',
    };
  };

  return (
    <div style={{ background: '#2c2c36', padding: '20px', borderRadius: '8px', color: 'white' }}>
      <h3 style={{ marginBottom: '15px' }}>Documents</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', fontSize: '0.9rem', color: '#cccccc' }}>
            <th style={{ paddingBottom: '10px' }}>Name</th>
            <th style={{ paddingBottom: '10px' }}>Type</th>
            <th style={{ paddingBottom: '10px' }}>Status</th>
            <th style={{ paddingBottom: '10px' }}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, idx) => (
            <tr key={idx} style={{ borderTop: '1px solid #444' }}>
              <td style={{ padding: '12px 0' }}>{doc.name}</td>
              <td>{doc.type}</td>
              <td>
                <span style={getStatusStyle(doc.status)}>{doc.status}</span>
              </td>
              <td>{doc.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
