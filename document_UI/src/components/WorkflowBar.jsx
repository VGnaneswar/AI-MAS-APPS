export default function WorkflowBar({ status }) {
  const steps = ['Ingested', 'Extracted', 'Classified', 'Routed'];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      {steps.map((step, idx) => (
        <div key={step} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: idx <= status ? '#489af0' : '#555',
              marginBottom: 5,
            }}
          />
          <div style={{ fontSize: 12 }}>{step}</div>
        </div>
      ))}
    </div>
  );
}
