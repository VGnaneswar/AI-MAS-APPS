export default function TopNavbar({ expanded }) {
  return (
    <div
      style={{
        background: '#20202a',
        padding: '12px 20px',
        borderBottom: '1px solid #333',
        height: expanded ? '80px' : '56px', // Increased height if expanded
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        🧾 Document Dashboard
      </div>
    </div>
  );
}
