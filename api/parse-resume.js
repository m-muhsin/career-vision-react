/* global require, module */
const multer = require('multer');
const cors = require('cors');
const { createRouter } = require('next-connect');
const pdf = require('pdf-parse');

const { parseResumeWithAI, convertToBlockStructure } = require('./parse-profile');

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
      console.log("dataBuffer", dataBuffer);
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
        const parsedResume = parseResumeWithAI(text);
        
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
