/* global module */
/* 
 * Shared resume parsing utilities for both server and API implementations
 */

// Helper function to parse resume text without AI
function parseResumeText(text) {
  // Split text into lines and remove empty lines
  const lines = text.split(/\n|\r\n|\r/).filter(line => line.trim());
  
  if (lines.length === 0) {
    return { error: 'No text content found in the PDF.' };
  }
  
  // Attempt to structure the resume data
  try {
    // Extract basic sections
    let name = lines[0].trim();
    let contactInfo = [];
    let sections = {
      summary: [],
      experience: [],
      education: [],
      skills: []
    };
    
    // Look for patterns that resemble contact info - enhanced with more formats
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    // More comprehensive phone regex that covers international formats, extensions, etc.
    const phoneRegex = /(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?(?:\d{3}[-.\s]?\d{4}|\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}))|(?:Phone:?\s*[-+().\s\d]+)/i;
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-z0-9][-a-z0-9]+\.[a-z0-9-.]+)/i;
    const linkedinRegex = /(?:linkedin\.com\/in\/[\w-]+)|(?:linkedin:\s*[\w-]+)/i;
    
    // Keywords that typically indicate sections
    const sectionKeywords = {
      summary: ['summary', 'profile', 'objective', 'about', 'professional summary'],
      experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
      education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
      skills: ['skills', 'expertise', 'technologies', 'technical skills', 'proficiencies', 'competencies']
    };

    // Special patterns to look for and preserve
    const durationRegex = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\s*[-–]\s*(present|\d{4}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\b/gi;
    
    // Simple classification of text into sections
    let currentSection = null;

    // First pass: scan entire resume for contact information
    let foundEmail = false;
    let foundPhone = false;
    let foundLinkedIn = false;
    
    // Debug information
    console.log("Analyzing resume for contact information...");
    
    for (let i = 0; i < lines.length; i++) {
      const originalLine = lines[i];
      
      // Check for phone numbers and extract them
      if (phoneRegex.test(originalLine)) {
        const phoneMatch = originalLine.match(phoneRegex)[0];
        console.log(`Found phone number: "${phoneMatch}" in line: "${originalLine}"`);
        contactInfo.push(phoneMatch);
        foundPhone = true;
      }
      
      // Check for email addresses
      if (emailRegex.test(originalLine)) {
        contactInfo.push(originalLine.match(emailRegex)[0]);
        foundEmail = true;
      }
      
      // Check for LinkedIn profiles
      if (linkedinRegex.test(originalLine)) {
        contactInfo.push(originalLine.match(linkedinRegex)[0]);
        foundLinkedIn = true;
      }
      // Otherwise check for general URLs
      else if (urlRegex.test(originalLine)) {
        contactInfo.push(originalLine.match(urlRegex)[0]);
      }
    }
    
    // Add placeholders for missing contact info
    if (!foundEmail) {
      contactInfo.push("Email: N/A");
    }
    
    if (!foundPhone) {
      console.log("No phone number found, adding placeholder");
      contactInfo.push("Phone: N/A");
    }
    
    if (!foundLinkedIn) {
      contactInfo.push("LinkedIn: N/A");
    }
    
    // Second pass: organize content into sections
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const originalLine = lines[i];
      
      // Skip lines we've already identified as contact info
      if (phoneRegex.test(originalLine) || emailRegex.test(originalLine) || 
          urlRegex.test(originalLine) || linkedinRegex.test(originalLine)) {
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
        // Preserve duration formatting
        if (durationRegex.test(originalLine)) {
          // Reset regex lastIndex
          durationRegex.lastIndex = 0;
          // Keep the original formatting for lines with dates
          sections[currentSection].push(originalLine);
        } else {
          sections[currentSection].push(originalLine);
        }
      }
      // If we're near the top and haven't identified a section yet, it might be part of the summary
      else if (i < 7) {
        sections.summary.push(originalLine);
      }
    }
    
    // Final check to ensure we have contact info
    if (contactInfo.length === 0) {
      contactInfo = ["Email: N/A", "Phone: N/A", "LinkedIn: N/A"];
    }
    
    // Debug the final contact info
    console.log("Final contact info:", contactInfo);
    
    return {
      name,
      contactInfo,
      sections
    };
  } catch (error) {
    console.error('Error structuring resume data:', error);
    // Fall back to returning just minimal structure
    return { 
      name: "Could not parse name", 
      contactInfo: ["Email: N/A", "Phone: N/A", "LinkedIn: N/A"],
      sections: {
        summary: [],
        experience: [],
        education: [],
        skills: []
      } 
    };
  }
}

module.exports = {
  parseResumeText,
}; 