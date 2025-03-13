import React, { useState } from 'react';

const PdfUploader = ({ onParsed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    setError(null);
    const file = event.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse PDF.');
      }

      onParsed(data.text);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>Parsing PDF on server...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PdfUploader;