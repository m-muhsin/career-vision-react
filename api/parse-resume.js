/* global require, module */
const multer = require('multer');
const cors = require('cors');
const { createRouter } = require('next-connect');
const pdf = require('pdf-parse');

// Configure middleware for serverless environment
const router = createRouter();

// Configure CORS
const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
});

// Use in-memory storage for serverless environment
const storage = multer.memoryStorage();

// Configure upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase limit to 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Convert parsed resume to the block structure expected by the frontend
function convertToBlockStructure(parsedResume) {
  return [
    createHeaderBlock(parsedResume.name, parsedResume.contactInfo),
    createSectionBlock("Professional Summary", parsedResume.sections.summary || [], 'summary'),
    createSectionBlock("Experience", parsedResume.sections.experience || [], 'experience'),
    createSectionBlock("Education", parsedResume.sections.education || [], 'education'),
    createSectionBlock("Skills & Expertise", parsedResume.sections.skills || [], 'skills'),
  ];
}

// Helper function to create the header block with name and contact info
function createHeaderBlock(name, contactInfo) {
  return {
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
          content: Array.isArray(contactInfo) ? contactInfo.join(' | ') : "Contact information",
          align: "center",
          fontSize: "small",
        },
        innerBlocks: [],
      },
    ],
  };
}

// Helper function to create section blocks with different formatting per section type
function createSectionBlock(title, content, sectionType) {
  // Ensure we're working with an array of strings
  const safeContent = Array.isArray(content) 
    ? content.map(item => {
        if (item === null || item === undefined) return '';
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
          try {
            return JSON.stringify(item).replace(/[{}"]/g, '').trim();
          } catch {
            return String(item);
          }
        }
        return String(item);
      })
    : [];
  
  let contentText = '';
  
  // Format content based on section type
  switch(sectionType) {
    case 'summary':
      // Paragraphs with space between them
      contentText = safeContent.length > 0 
        ? safeContent.join('\n\n')
        : `Your professional summary will appear here`;
      break;
    
    case 'experience':
      // Each job gets its own paragraph with spacing
      contentText = safeContent.length > 0 
        ? safeContent.join('\n\n\n')
        : `Your work experience will appear here`;
      break;
    
    case 'education':
      // Each education entry gets its own paragraph
      contentText = safeContent.length > 0 
        ? safeContent.join('\n\n')
        : `Your education information will appear here`;
      break;
    
    case 'skills':
      // Skills can be formatted as a list or paragraphs
      if (safeContent.length > 0) {
        // If there are many short skills items, format as a list
        if (safeContent.length > 5 && safeContent.every(s => s.length < 50)) {
          // Join with commas for a comma-separated list
          contentText = safeContent.join(', ');
        } else {
          // Otherwise, each skill gets its own paragraph
          contentText = safeContent.join('\n\n');
        }
      } else {
        contentText = `Your skills will appear here`;
      }
      break;
    
    default:
      // Default formatting
      contentText = safeContent.length > 0 
        ? safeContent.join('\n\n')
        : `Your ${title.toLowerCase()} information will appear here`;
  }
  
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
}

// Original resume parsing helper function
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
    
    // Look for patterns that resemble contact info
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/;
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-z0-9][-a-z0-9]+\.[a-z0-9-.]+)/i;
    
    // Keywords that typically indicate sections
    const sectionKeywords = {
      summary: ['summary', 'profile', 'objective', 'about', 'professional summary'],
      experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
      education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
      skills: ['skills', 'expertise', 'technologies', 'technical skills', 'proficiencies', 'competencies']
    };
    
    // Simple classification of text into sections
    let currentSection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const originalLine = lines[i];
      
      // Check for contact information
      if (emailRegex.test(originalLine) || phoneRegex.test(originalLine) || urlRegex.test(originalLine)) {
        contactInfo.push(originalLine);
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
      contactInfo: [],
      sections: {
        summary: [],
        experience: [],
        education: [],
        skills: []
      } 
    };
  }
}

// Setup API routes
router.use(corsMiddleware);

// API endpoint to handle resume PDF upload and parsing
router.post(async (req, res) => {
  // Apply multer middleware manually for file upload
  upload.single('pdfFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No PDF file provided' 
        });
      }
      
      const filename = req.file.originalname || 'resume.pdf';
      console.log(`Processing PDF file: ${filename} (${req.file.size} bytes)`);
      
      // Use the PDF buffer directly from multer's memory storage
      const dataBuffer = req.file.buffer;
      
      // Parse PDF using pdf-parse
      try {
        const pdfData = await pdf(dataBuffer);
        
        // Extract text content
        const text = pdfData.text;
        
        if (!text || text.trim().length === 0) {
          return res.status(400).json({
            success: false,
            error: 'No text could be extracted from this PDF. It may be image-based or secured against text extraction.'
          });
        }
        
        // Parse the resume text
        const parsedResume = parseResumeText(text);
        
        // Convert to block structure
        const blockStructure = convertToBlockStructure(parsedResume);
        
        // Return the parsed content and block structure
        return res.json({
          success: true,
          text: text,
          structured: parsedResume,
          blocks: blockStructure,
          aiProcessed: false,
          filename: filename,
          pages: pdfData.numpages || 1
        });
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        
        return res.status(400).json({
          success: false,
          error: `PDF parsing failed: ${pdfError.message}. Please try a different PDF file.`
        });
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      // Provide more detailed error messages
      let errorMessage = 'Error processing PDF';
      
      if (error.message.includes('password')) {
        errorMessage = 'This PDF is password protected. Please provide an unprotected PDF.';
      } else if (error.message.includes('file format')) {
        errorMessage = 'The file is not a valid PDF or is corrupted.';
      } else if (error.message.includes('too large')) {
        errorMessage = 'The PDF file is too large. Maximum size is 50MB.';
      }
      
      return res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  });
});

// Export the handler for Vercel
module.exports = router.handler();
