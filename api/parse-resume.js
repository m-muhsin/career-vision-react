const multer = require('multer');
const cors = require('cors');
const { createRouter } = require('next-connect');

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
      
      // Use the PDF.js approach for all PDF parsing
      try {
        // Try to load PDF.js with more robust error handling
        let pdfjsLib, pdfjsWorker;
        
        try {
          // First try the legacy path
          pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
          pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.js');
          console.log('Successfully loaded PDF.js from legacy path');
        } catch (importError) {
          console.log('Could not load PDF.js from legacy path, trying alternative paths:', importError.message);
          
          try {
            // Try without the legacy path
            pdfjsLib = require('pdfjs-dist/build/pdf.js');
            pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');
            console.log('Successfully loaded PDF.js from standard path');
          } catch (importError2) {
            console.log('Could not load PDF.js from standard path, trying es5 path');
            
            try {
              // Try the ES5 path as last resort
              pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');
              pdfjsWorker = require('pdfjs-dist/es5/build/pdf.worker.js');
              console.log('Successfully loaded PDF.js from ES5 path');
            } catch (importError3) {
              console.error('All PDF.js import attempts failed');
              throw new Error(`Could not load PDF.js: ${importError3.message}. Please make sure pdfjs-dist is installed.`);
            }
          }
        }
        
        // Set up the worker if we have one
        if (pdfjsWorker && pdfjsWorker.PDFWorker) {
          pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker.PDFWorker('pdf.js-worker');
        } else {
          console.log('PDF.js worker not found, using default worker');
        }
        
        // Convert Buffer to Uint8Array as required by PDF.js
        const uint8Array = new Uint8Array(req.file.buffer);
        
        // Load and parse the PDF
        const pdfDoc = await pdfjsLib.getDocument({
          data: uint8Array,
          disableRange: true,
          disableStream: true,
          disableAutoFetch: true,
          isEvalSupported: false
        }).promise;
        
        console.log(`PDF loaded successfully. Pages: ${pdfDoc.numPages}`);
        
        // Extract text from all pages
        let fullText = '';
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
          
          console.log(`Processed page ${pageNum}/${pdfDoc.numPages}`);
        }
        
        if (!fullText || fullText.trim().length === 0) {
          throw new Error('No text extracted');
        }
        
        // Parse resume structure
        const parsedResume = parseResumeText(fullText);
        
        // Return the parsed content
        return res.json({
          success: true,
          text: fullText,
          structured: parsedResume.structured || null,
          method: 'pdfjs'
        });
      } catch (pdfError) {
        console.error('PDF.js parsing failed:', pdfError);
        
        return res.status(400).json({
          success: false,
          error: `PDF parsing failed: ${pdfError.message}. Please try a different PDF file.`
        });
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error processing PDF: ' + (error.message || 'Unknown error')
      });
    }
  });
});

// Export the handler for Vercel
module.exports = router.handler(); 