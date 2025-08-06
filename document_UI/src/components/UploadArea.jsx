import { useState } from 'react';

export default function UploadArea() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Upload Document</h2>
      <input type="file" onChange={handleUpload} />
      {file && <p className="mt-2">Selected File: {file.name}</p>}
    </div>
  );
}
