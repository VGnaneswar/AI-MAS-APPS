import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function DocumentTable({ documents, onManualRoute }) {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      color: 'white',
      padding: '4px 10px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '0.85rem',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    };

    if (status === 'Processed') {
      return { ...baseStyle, backgroundColor: '#00c471' };
    } else if (status === 'Classified') {
      return { ...baseStyle, backgroundColor: '#5c6bc0' };
    } else if (status === 'Manual Routing Required') {
      return { ...baseStyle, backgroundColor: '#ff9800' };
    } else if (status?.startsWith('Routed to')) {
      return { ...baseStyle, backgroundColor: '#29b6f6' };
    } else {
      return { ...baseStyle, backgroundColor: '#7a7a7a' };
    }
  };

  return (
    <div style={{ background: '#2c2c36', padding: '20px', borderRadius: '8px', color: 'white' }}>
      <h3 style={{ marginBottom: '15px' }}>Documents</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', fontSize: '0.9rem', color: '#cccccc' }}>
            <th style={{ paddingBottom: '10px' }}>Name</th>
            <th style={{ paddingBottom: '10px' }}>Type</th>
            <th style={{ minWidth: '160px', paddingBottom: '10px' }}>Status</th>
            <th style={{ paddingBottom: '10px' }}>Confidence</th>
            <th style={{ paddingBottom: '10px' }}>Last Updated</th>
            <th style={{ paddingBottom: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, idx) => (
            <React.Fragment key={idx}>
              <tr
                onClick={() => toggleRow(idx)}
                style={{
                  borderTop: '1px solid #444',
                  cursor: 'pointer',
                  height: '60px',
                }}
              >
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td style={{ minWidth: '160px' }}>
                  <span style={getStatusStyle(doc.status)}>{doc.status}</span>
                </td>
                <td>{doc.confidence ? `${(doc.confidence * 100).toFixed(2)}%` : '—'}</td>
                <td>{doc.lastUpdated}</td>
                <td>
                  {/* ✅ FIX: Always show tick when status starts with 'Routed to' */}
                  {doc.status?.startsWith('Routed to') ? (
                    <CheckCircle color="#00c471" size={20} />
                  ) : doc.needsManualRouting ? (
                    <button
                      style={{
                        backgroundColor: '#f4a949',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onManualRoute(doc);
                      }}
                    >
                      Route
                    </button>
                  ) : (
                    <span style={{ color: '#888' }}>—</span>
                  )}
                </td>
              </tr>

              {expandedRows.includes(idx) && (
                <tr>
                  <td colSpan="6" style={{ backgroundColor: '#1e1e24', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <strong>Metadata:</strong>
                      <div><strong>Name:</strong> {doc.name}</div>
                      <div><strong>Type:</strong> {doc.type}</div>
                      <div><strong>Confidence:</strong> {doc.confidence ? `${(doc.confidence * 100).toFixed(2)}%` : '—'}</div>
                      <div><strong>Last Updated:</strong> {doc.lastUpdated}</div>

                      <div style={{ marginTop: '10px' }}>
                        <strong>Progress:</strong>
                        <div style={{
                          background: '#444',
                          height: '10px',
                          width: '100%',
                          borderRadius: '8px',
                          marginTop: '6px',
                          overflow: 'hidden',
                        }}>
                          <div
                            style={{
                              background: '#00c471',
                              width: `${Math.min(Math.max(doc.confidence * 100, 0), 100)}%`,
                              height: '100%',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
