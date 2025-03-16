import React from 'react';

/**
 * ResumeTemplate component displays the resume data in a nicely formatted layout
 * @param {Object} props 
 * @param {Array} props.resumeData - Array of block data from parsed resume
 * @param {Function} props.onEdit - Function to handle editing the resume
 */
const ResumeTemplate = ({ resumeData, onEdit }) => {
  // Extract sections from resume data
  const getBlockByClientId = (clientId) => {
    return resumeData.find(block => block.clientId === clientId);
  };

  const getBlockContentByType = (clientId, type) => {
    const block = getBlockByClientId(clientId);
    if (!block) return '';
    
    const innerBlock = block.innerBlocks.find(innerBlock => 
      innerBlock.name === type
    );
    
    return innerBlock?.attributes?.content || '';
  };
  
  // Find specific sections
  const headerSection = resumeData.find(block => block.clientId === "header-section");
  const summarySection = resumeData.find(block => block.clientId?.includes("professional-summary"));
  const experienceSection = resumeData.find(block => block.clientId?.includes("experience"));
  const educationSection = resumeData.find(block => block.clientId?.includes("education"));
  const skillsSection = resumeData.find(block => block.clientId?.includes("skills"));

  // Extract name and contact info from header section
  const name = headerSection ? 
    getBlockContentByType("header-section", "core/heading") : 
    "Your Name";
    
  const contactInfo = headerSection ? 
    getBlockContentByType("header-section", "core/paragraph") : 
    "Contact Information";

  // Helper function to render a section
  const renderSection = (section, title) => {
    if (!section) return null;
    
    const heading = section.innerBlocks.find(block => block.name === "core/heading");
    const content = section.innerBlocks.find(block => block.name === "core/paragraph");
    
    const headingText = heading?.attributes?.content || title;
    const contentText = content?.attributes?.content || "";
    
    return (
      <div>
        <h2 className="resume-template__section-heading">{headingText}</h2>
        <div className="resume-template__content">
          {contentText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="resume-template__paragraph">{paragraph}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="resume-template__container">
      <div className="resume-template__header">
        <h1 className="resume-template__name">{name}</h1>
        <div className="resume-template__contact-info">{contactInfo}</div>
      </div>
      
      {renderSection(summarySection, "Professional Summary")}
      {renderSection(experienceSection, "Experience")}
      {renderSection(educationSection, "Education")}
      {renderSection(skillsSection, "Skills & Expertise")}
      
      <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="resume-template__edit-button" onClick={onEdit}>
          Edit Template View
        </button>
      </div>
    </div>
  );
};

export default ResumeTemplate; 