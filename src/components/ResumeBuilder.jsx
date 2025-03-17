import React, { useState } from 'react';
import ImportResume from './ImportResume';
import ResumeTemplate from './ResumeTemplate';

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
    <div className="resume-builder__container">
      <div className="resume-builder__content">
        <h1 className="resume-builder__title">Transform Your LinkedIn Profile into a Professional Resume</h1>
        <p className="resume-builder__subtitle">
          {step === 'import' 
            ? 'Import your LinkedIn profile PDF and let us create a beautifully formatted resume in seconds'
            : 'Your resume has been created! You can continue customizing it to make it perfect.'}
        </p>
        
        {renderStep()}
        
        {resumeData && step === 'import' && (
          <button 
            className="resume-builder__action-button"
            onClick={handleContinue}
          >
            Continue with Imported Resume
          </button>
        )}
        
        {resumeData && step === 'display' && (
          <button 
            className="resume-builder__action-button"
            onClick={handleContinue}
          >
            Edit Resume in Block Editor
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder; 