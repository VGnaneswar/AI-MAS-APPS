import React, { useRef } from 'react';

export default function FileUpload({ onUpload }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    onUpload(files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        padding: '30px',
        border: '2px dashed #555',
        marginBottom: '20px',
        textAlign: 'center',
        borderRadius: '8px',
        backgroundColor: '#2c2c36',
      }}
    >
      <p>Drag & drop your files here</p>
      <p>or</p>
      <input type="file" multiple ref={inputRef} onChange={(e) => onUpload(e.target.files)} />
    </div>
  );
}
