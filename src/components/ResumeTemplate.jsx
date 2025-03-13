import React from 'react';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid var(--primary-color)',
    paddingBottom: '20px',
  },
  name: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-family-heading)',
  },
  contactInfo: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '5px',
  },
  sectionHeading: {
    fontSize: '22px',
    fontWeight: '600',
    marginTop: '30px',
    marginBottom: '15px',
    color: 'var(--secondary-color)',
    fontFamily: 'var(--font-family-heading)',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px',
  },
  content: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
  paragraph: {
    marginBottom: '15px',
  },
  editButton: {
    backgroundColor: 'var(--secondary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block',
    marginTop: '20px',
    fontFamily: 'var(--font-family-heading)',
  },
};

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
        <h2 style={styles.sectionHeading}>{headingText}</h2>
        <div style={styles.content}>
          {contentText.split('\n\n').map((paragraph, index) => (
            <p key={index} style={styles.paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.name}>{name}</h1>
        <div style={styles.contactInfo}>{contactInfo}</div>
      </div>
      
      {renderSection(summarySection, "Professional Summary")}
      {renderSection(experienceSection, "Experience")}
      {renderSection(educationSection, "Education")}
      {renderSection(skillsSection, "Skills & Expertise")}
      
      <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button style={styles.editButton} onClick={onEdit}>
          Edit Template View
        </button>
      </div>
    </div>
  );
};

export default ResumeTemplate; 