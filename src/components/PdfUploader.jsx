import React, { useState } from 'react';

const PdfUploader = ({ onParsed }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = async (event) => {
    setError(null);
    setDebug(null);
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setDebug(`File selected: ${file.name} (${Math.round(file.size / 1024)} KB)`);

    const formData = new FormData();
    formData.append('pdfFile', file);

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

      setDebug(prev => `${prev}\nParsed ${data.text.length} characters of text using ${data.method || 'unknown'} method`);
      onParsed(data.text);
    } catch (err) {
      console.error('PDF parsing error:', err);
      
      let errorMessage = err.message;
      
      if (errorMessage.includes('no text') || errorMessage.includes('text extracted')) {
        errorMessage = 'No text could be extracted from this PDF. It may be image-based or secured.';
      } else if (errorMessage.includes('parse')) {
        errorMessage = 'Error parsing the PDF. Please try a different PDF file.';
      }
      
      setError(errorMessage);
      setDebug(prev => `${prev}\nError: ${err.toString()}`);
    }

    setLoading(false);
  };

  return (
    <div className="pdf-uploader">
      <div className={`upload-area ${loading ? 'loading' : ''}`}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
          id="pdf-file-input"
          disabled={loading}
        />
        <label htmlFor="pdf-file-input" className="upload-label">
          {fileName ? fileName : 'Choose a PDF file'} 
          {!loading && <span className="browse-text">Browse</span>}
        </label>
      </div>
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Parsing PDF on server...</p>
        </div>
      )}
      
      {error && <p className="error-message">{error}</p>}
      
      {debug && (
        <details className="debug-panel">
          <summary>Debug Info</summary>
          <pre className="debug-content">
            {debug}
          </pre>
        </details>
      )}
      
      <style jsx>{`
        .pdf-uploader {
          margin-bottom: 20px;
        }
        
        .upload-area {
          position: relative;
          border: 2px dashed #ccc;
          border-radius: 4px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .upload-area:hover {
          border-color: #2196F3;
          background-color: rgba(33, 150, 243, 0.05);
        }
        
        .upload-area.loading {
          opacity: 0.7;
          pointer-events: none;
        }
        
        input[type="file"] {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
        }
        
        .upload-label {
          display: block;
          font-size: 16px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
        }
        
        .browse-text {
          display: inline-block;
          margin-left: 8px;
          padding: 4px 10px;
          background-color: #2196F3;
          color: white;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .loading-indicator {
          display: flex;
          align-items: center;
          margin-top: 15px;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(33, 150, 243, 0.3);
          border-radius: 50%;
          border-top-color: #2196F3;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #d32f2f;
          margin-top: 15px;
          padding: 10px;
          background-color: #ffebee;
          border-radius: 4px;
        }
        
        .debug-panel {
          margin-top: 15px;
        }
        
        .debug-content {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 12px;
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default PdfUploader;