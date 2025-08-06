import React from 'react';

export default function FileUpload({ onUpload }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    const validFiles = files.filter(file => allowedTypes.includes(file.type));

    if (validFiles.length < files.length) {
      alert('Unsupported files skipped. Only PDF, DOC, JPG, and PNG allowed.');
    }

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }

    e.target.value = null;
  };

  return (
    <div style={wrapperStyle}>
      <label htmlFor="file-upload" style={uploadButton}>
        Choose File
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
        style={{ display: 'none' }}
      />

      <p style={instruction}>
        Drag and drop files or click "Choose File" to upload.<br />
        (Only PDF, DOC, JPG, PNG files are allowed)
      </p>
    </div>
  );
}

// Styles
const wrapperStyle = {
  backgroundColor: '#2c2c36',
  padding: '24px',
  borderRadius: '16px',
  textAlign: 'center',
  height: '100%',
  border: '2px dashed #555',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
};

const uploadButton = {
  backgroundColor: '#2196f3',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'inline-block',
};

const instruction = {
  color: '#aaa',
  marginTop: '12px',
  fontSize: '0.9rem',
};
