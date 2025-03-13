import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

// No need to import PDF.js as we'll process on the server

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '80px auto 0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    fontFamily: 'var(--font-family-heading)',
    color: 'var(--primary-color)',
  },
  dropzone: {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'border 0.3s ease',
  },
  dropzoneActive: {
    border: '2px dashed var(--secondary-color)',
    backgroundColor: 'rgba(6, 156, 175, 0.05)',
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: 'var(--secondary-color)',
  },
  dropzoneText: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  button: {
    backgroundColor: 'var(--secondary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
    marginTop: '12px',
    fontFamily: 'var(--font-family-heading)',
  },
  statusContainer: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '4px',
  },
  loadingStatus: {
    backgroundColor: 'rgba(6, 156, 175, 0.1)',
    color: 'var(--secondary-color)',
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    marginRight: '8px',
    border: '3px solid rgba(6, 156, 175, 0.2)',
    borderRadius: '50%',
    borderTop: '3px solid var(--secondary-color)',
    animation: 'spin 1s linear infinite',
  },
  errorStatus: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  successStatus: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  fileDetails: {
    marginTop: '12px',
    fontSize: '14px',
  },
};

const ImportResume = ({ onImportComplete }) => {
  const [status, setStatus] = useState({ type: null, message: '' });
  const [pdfText, setPdfText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Process the PDF file by sending it to the server
  const processPdf = async (file) => {
    try {
      setStatus({ type: 'loading', message: 'Uploading and processing PDF...' });
      setSelectedFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      // Create form data to send file to server
      const formData = new FormData();
      formData.append('pdfFile', file);

      // Progress tracking for upload
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Promise wrapper for XHR to make it easier to work with
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Server returned ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };
        
        // Handle network errors
        xhr.onerror = () => {
          reject(new Error('Network error occurred while uploading PDF'));
        };
      });

      // Configure the request 
      // URL adapts to Vercel deployment automatically
      const apiUrl = '/api/parse-resume';
        
      xhr.open('POST', apiUrl, true);
      xhr.send(formData);

      // Wait for response
      const response = await uploadPromise;
      
      if (response.success && response.text) {
        setPdfText(response.text);
        
        // Store the structured data for later use
        if (typeof window !== 'undefined') {
          window.lastParsedResume = response;
        }
        
        setStatus({ 
          type: 'success', 
          message: 'PDF processed successfully! Click "Import Resume" to continue.' 
        });
      } else {
        throw new Error(response.error || 'Unknown error processing PDF');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setUploadProgress(0);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Error processing PDF. Please try a different file.';
      
      if (error.message.includes('password')) {
        errorMessage = 'This PDF is password protected. Please provide an unprotected PDF.';
      } else if (error.message.includes('invalid') || error.message.includes('corrupt')) {
        errorMessage = 'The file is not a valid PDF or is corrupted.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error while uploading PDF. Please check your connection and try again.';
      } else if (error.message.includes('server')) {
        errorMessage = 'Server error processing your PDF. Please try again later.';
      } else {
        // Detailed error for debugging
        errorMessage = `Error: ${error.message || 'Unknown error'}. Please try a different PDF file.`;
      }
      
      setStatus({ 
        type: 'error', 
        message: errorMessage
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      processPdf(file);
    } else {
      setStatus({ type: 'error', message: 'Please upload a valid PDF file.' });
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  // Import the resume after processing
  const handleImport = () => {
    if (!pdfText) {
      setStatus({ type: 'error', message: 'No PDF content to import.' });
      return;
    }

    // Create a structured resume from the parsed data
    const resumeData = parseResumeText(pdfText);
    
    // Call the parent handler with the parsed data
    onImportComplete(resumeData);
  };

  // Enhanced parser for resume text - uses the data already parsed by the server if available
  const parseResumeText = (text) => {
    // If we received structured data from the server, use it directly
    if (typeof window !== 'undefined' && window.lastParsedResume && window.lastParsedResume.structured) {
      const structured = window.lastParsedResume.structured;
      
      // Format it as our block structure
      return [
        {
          clientId: "header-section",
          name: "core/group",
          isValid: true,
          attributes: {
            tagName: "div",
            layout: { type: "constrained" },
          },
          innerBlocks: [
            {
              clientId: "name-heading",
              name: "core/heading",
              isValid: true,
              attributes: {
                content: structured.name || "Your Full Name",
                level: 1,
                textAlign: "center",
                fontSize: "large",
              },
              innerBlocks: [],
            },
            {
              clientId: "contact-info",
              name: "core/paragraph",
              isValid: true,
              attributes: {
                content: structured.contactInfo.join(' | ') || "Contact information extracted from resume",
                align: "center",
                fontSize: "small",
              },
              innerBlocks: [],
            },
          ],
        },
        createSectionBlock("Professional Summary", structured.sections.summary || []),
        createSectionBlock("Experience", structured.sections.experience || []),
        createSectionBlock("Education", structured.sections.education || []),
        createSectionBlock("Skills & Expertise", structured.sections.skills || []),
      ];
    }
    
    // Fall back to existing client-side parsing if needed
    const lines = text.split(/\n|\r\n|\r/).filter(line => line.trim());
    
    if (lines.length === 0) {
      return createDefaultResumeStructure();
    }
    
    // Try to extract the name - typically the first line or a line with fewer words and possibly larger font
    let name = lines[0].trim();
    
    // Look for potential section headers
    const sections = {
      summary: [],
      experience: [],
      education: [],
      skills: [],
      contact: []
    };
    
    // Keywords that typically indicate sections
    const sectionKeywords = {
      summary: ['summary', 'profile', 'objective', 'about', 'professional summary'],
      experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
      education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
      skills: ['skills', 'expertise', 'technologies', 'technical skills', 'proficiencies', 'competencies'],
      contact: ['contact', 'email', 'phone', 'address', '@']
    };
    
    // Attempt to match sections
    let currentSection = null;
    let contactInfo = [];
    
    // Look for patterns that resemble contact info
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/;
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-z0-9][-a-z0-9]+\.[a-z0-9-.]+)/i;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const originalLine = lines[i];
      
      // Check for contact information
      if (emailRegex.test(originalLine) || phoneRegex.test(originalLine) || urlRegex.test(originalLine)) {
        contactInfo.push(originalLine);
        
        // If this is at the top of the resume, it might be part of the header
        if (i < 5) {
          sections.contact.push(originalLine);
        }
        continue;
      }
      
      // Check if line is a section header
      let foundSection = false;
      for (const [section, keywords] of Object.entries(sectionKeywords)) {
        if (keywords.some(keyword => line.includes(keyword))) {
          currentSection = section;
          foundSection = true;
          break;
        }
      }
      
      if (foundSection) continue;
      
      // Add line to current section if we've identified one
      if (currentSection && sections[currentSection] !== undefined) {
        sections[currentSection].push(originalLine);
      }
      // If we're near the top and haven't identified a section yet, it might be part of the summary
      else if (i < 7) {
        sections.summary.push(originalLine);
      }
    }
    
    // Create a more sophisticated block structure from extracted sections
    return [
      {
        clientId: "header-section",
        name: "core/group",
        isValid: true,
        attributes: {
          tagName: "div",
          layout: { type: "constrained" },
        },
        innerBlocks: [
          {
            clientId: "name-heading",
            name: "core/heading",
            isValid: true,
            attributes: {
              content: name || "Your Full Name",
              level: 1,
              textAlign: "center",
              fontSize: "large",
            },
            innerBlocks: [],
          },
          {
            clientId: "contact-info",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: contactInfo.join(' | ') || "Contact information extracted from resume",
              align: "center",
              fontSize: "small",
            },
            innerBlocks: [],
          },
        ],
      },
      createSectionBlock("Professional Summary", sections.summary),
      createSectionBlock("Experience", sections.experience),
      createSectionBlock("Education", sections.education),
      createSectionBlock("Skills & Expertise", sections.skills),
    ];
  };
  
  // Helper function to create section blocks
  const createSectionBlock = (title, content) => {
    const contentText = content && content.length > 0 
      ? content.join('\n\n')
      : `Your ${title.toLowerCase()} information will appear here`;
      
    return {
      clientId: `${title.toLowerCase().replace(/\s+/g, '-')}-section`,
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "section",
      },
      innerBlocks: [
        {
          clientId: `${title.toLowerCase().replace(/\s+/g, '-')}-heading`,
          name: "core/heading",
          isValid: true,
          attributes: {
            content: title,
            level: 2,
          },
          innerBlocks: [],
        },
        {
          clientId: `${title.toLowerCase().replace(/\s+/g, '-')}-content`,
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: contentText,
          },
          innerBlocks: [],
        },
      ],
    };
  };
  
  // Create default resume structure when parsing fails
  const createDefaultResumeStructure = () => {
    return [
      {
        clientId: "header-section",
        name: "core/group",
        isValid: true,
        attributes: {
          tagName: "div",
          layout: { type: "constrained" },
        },
        innerBlocks: [
          {
            clientId: "name-heading",
            name: "core/heading",
            isValid: true,
            attributes: {
              content: "Your Full Name",
              level: 1,
              textAlign: "center",
              fontSize: "large",
            },
            innerBlocks: [],
          },
          {
            clientId: "contact-info",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: "Email | Phone | LinkedIn",
              align: "center",
              fontSize: "small",
            },
            innerBlocks: [],
          },
        ],
      },
      createSectionBlock("Professional Summary", []),
      createSectionBlock("Experience", []),
      createSectionBlock("Education", []),
      createSectionBlock("Skills & Expertise", []),
    ];
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Import Your Resume</h2>
      
      <div 
        {...getRootProps()} 
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.dropzoneActive : {})
        }}
      >
        <input {...getInputProps()} />
        <div style={styles.uploadIcon}>📄</div>
        <p style={styles.dropzoneText}>
          {isDragActive
            ? "Drop your PDF resume here..."
            : "Drag & drop your PDF resume here, or click to select file"}
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Supports PDF format only
        </p>
      </div>
      
      {selectedFile && (
        <div style={styles.fileDetails}>
          <strong>Selected file:</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
        </div>
      )}
      
      {isUploading && uploadProgress > 0 && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ 
            height: '8px', 
            width: '100%', 
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${uploadProgress}%`,
              backgroundColor: 'var(--secondary-color)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginTop: '5px' }}>
            {uploadProgress}% - Uploading and processing PDF...
          </p>
        </div>
      )}
      
      {status.type && !(isUploading && uploadProgress > 0) && (
        <div 
          style={{
            ...styles.statusContainer,
            ...(status.type === 'loading' ? styles.loadingStatus : {}),
            ...(status.type === 'error' ? styles.errorStatus : {}),
            ...(status.type === 'success' ? styles.successStatus : {})
          }}
        >
          {status.type === 'loading' && (
            <div style={{display: 'flex', alignItems: 'center'}}>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <div style={styles.spinner}></div>
              <span>{status.message}</span>
            </div>
          )}
          {status.type !== 'loading' && status.message}
        </div>
      )}
      
      {status.type === 'success' && (
        <button 
          style={styles.button}
          onClick={handleImport}
        >
          Import Resume
        </button>
      )}
    </div>
  );
};

export default ImportResume; 