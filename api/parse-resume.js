import multer from 'multer';
import cors from 'cors';
// Import pdfParse dynamically to avoid initialization errors
import { createRouter } from 'next-connect';

// Configure middleware for serverless environment
const router = createRouter();

// Use in-memory storage for serverless environment
const storage = multer.memoryStorage();

// Configure upload middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Resume parsing helper functions
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
      text,
      structured: {
        name,
        contactInfo,
        sections
      }
    };
  } catch (error) {
    console.error('Error structuring resume data:', error);
    // Fall back to returning just the text
    return { text };
  }
}

// Setup API routes
router.use(cors());

// API endpoint to handle resume PDF upload and parsing
router.post(async (req, res) => {
  // Apply multer middleware manually
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
      
      console.log(`Processing PDF file of size: ${req.file.size} bytes`);
      
      // Dynamically import pdfParse to avoid initialization errors
      let pdfParse;
      try {
        pdfParse = (await import('pdf-parse')).default;
      } catch (importError) {
        console.error('Error importing pdf-parse:', importError);
        return res.status(500).json({
          success: false,
          error: 'PDF parsing library failed to load'
        });
      }
      
      // Parse PDF directly from buffer
      let pdfData;
      try {
        pdfData = await pdfParse(req.file.buffer);
      } catch (parseError) {
        console.error('Error parsing PDF:', parseError);
        return res.status(400).json({
          success: false,
          error: 'Failed to parse the PDF file. It may be corrupted or in an unsupported format.'
        });
      }
      
      // Extract text content
      const text = pdfData.text;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No text could be extracted from this PDF. It may be image-based or secured against text extraction.'
        });
      }
      
      // Parse resume structure
      const parsedResume = parseResumeText(text);
      
      // Return the parsed content
      return res.json({
        success: true,
        text: text,
        structured: parsedResume.structured || null
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      // Provide more detailed error messages
      let errorMessage = 'Error processing PDF';
      
      if (error.message.includes('password')) {
        errorMessage = 'This PDF is password protected. Please provide an unprotected PDF.';
      } else if (error.message.includes('file format')) {
        errorMessage = 'The file is not a valid PDF or is corrupted.';
      }
      
      return res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  });
});

// Export the handler for Vercel
export default router.handler(); 