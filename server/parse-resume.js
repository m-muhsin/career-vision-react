const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure middleware
app.use(cors());
app.use(express.json());

// Configure file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use a unique filename to avoid collisions
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

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

// API endpoint to handle resume PDF upload and parsing
app.post('/api/parse-resume', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file provided' 
      });
    }
    
    const filePath = req.file.path;
    console.log(`Processing PDF file: ${filePath}`);
    
    // Read the file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse PDF
    const pdfData = await pdfParse(dataBuffer);
    
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
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
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

// Start server
app.listen(PORT, () => {
  console.log(`Resume parsing server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/parse-resume`);
});

module.exports = app; 