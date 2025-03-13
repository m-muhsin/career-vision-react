import React, { useState } from 'react';
import ImportResume from './ImportResume';
import ResumeTemplate from './ResumeTemplate';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '700',
    margin: '30px 0',
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-family-heading)',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '400',
    marginBottom: '30px',
    color: '#666',
  },
  actionButton: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'block',
    margin: '30px auto',
    fontFamily: 'var(--font-family-heading)',
  },
};

/**
 * ResumeBuilder component manages the resume creation workflow
 */
const ResumeBuilder = ({ onImportComplete }) => {
  // State to track current step in the workflow
  const [step, setStep] = useState('import');
  
  // State to store the imported resume data
  const [resumeData, setResumeData] = useState(null);
  
  // Handle when resume import is complete
  const handleImportComplete = (data) => {
    console.log('ResumeBuilder received data:', data);
    setResumeData(data);
    setStep('display');
    
    // If we have a parent callback, pass the data up
    if (onImportComplete && typeof onImportComplete === 'function') {
      onImportComplete(data);
    }
  };
  
  // Switch back to edit/import mode
  const handleEdit = () => {
    setStep('import');
  };
  
  // Switch to template selection
  const handleContinue = () => {
    // Send the data to the parent component to edit in the block editor
    if (onImportComplete && typeof onImportComplete === 'function') {
      onImportComplete(resumeData);
    }
  };
  
  // Render the appropriate component based on the current step
  const renderStep = () => {
    switch (step) {
      case 'import':
        return <ImportResume onImportComplete={handleImportComplete} />;
        
      case 'display':
        return <ResumeTemplate resumeData={resumeData} onEdit={handleEdit} />;
        
      default:
        return <ImportResume onImportComplete={handleImportComplete} />;
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Career Vision Resume Builder</h1>
      <p style={styles.subtitle}>
        {step === 'import' 
          ? 'Import your existing resume to get started quickly'
          : 'Your resume has been created! You can continue editing as needed.'}
      </p>
      
      {renderStep()}
      
      {resumeData && step === 'import' && (
        <button 
          style={styles.actionButton}
          onClick={handleContinue}
        >
          Continue with Imported Resume
        </button>
      )}
      
      {resumeData && step === 'display' && (
        <button 
          style={styles.actionButton}
          onClick={handleContinue}
        >
          Edit Resume in Block Editor
        </button>
      )}
    </div>
  );
};

export default ResumeBuilder; 