import React, { useState } from 'react';

const PdfUploader = ({ onParsed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);

  const handleFileChange = async (event) => {
    setError(null);
    setDebug(null);
    const file = event.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    setLoading(true);
    setDebug(`File selected: ${file.name} (${Math.round(file.size / 1024)} KB)`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setDebug(prev => `${prev}\nSending request to server...`);
      
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      setDebug(prev => `${prev}\nServer responded with status: ${response.status}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse PDF.');
      }

      setDebug(prev => `${prev}\nParsed ${data.text.length} characters of text`);
      onParsed(data.text);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setDebug(prev => `${prev}\nError: ${err.toString()}`);
    }

    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>Parsing PDF on server...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {debug && (
        <details>
          <summary>Debug Info</summary>
          <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
            {debug}
          </pre>
        </details>
      )}
    </div>
  );
};

export default PdfUploader;