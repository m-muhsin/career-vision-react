/* global require, module, process, __dirname */
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Import shared utilities
const { parseResumeText } = require('../utils/resume-parser.cjs');
const { parseResumeWithAI } = require('../utils/ai-parser.cjs');

// Load environment variables
dotenv.config();

// Initialize OpenAI API
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log("OpenAI initialized successfully");
  }
} catch (error) {
  console.error("Failed to initialize OpenAI:", error.message);
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes with specific configuration for development
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// For checking if the server is running
app.get("/", (req, res) => {
  res.json({ message: "PDF Parser API is running" });
});

// For checking the health of the AI integration
app.get("/api/health", (req, res) => {
  const aiConfigured = !!process.env.OPENAI_API_KEY;
  res.json({
    status: "ok",
    aiIntegration: aiConfigured ? "configured" : "not configured",
  });
});

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
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase limit to 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

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
    
    // Parse the resume text
    let parsedResume;
    let usedAI = false;
    
    try {
      // First try the AI parsing if available
      if (openai) {
        parsedResume = await parseResumeWithAI(text, openai);
        usedAI = true;
      } else {
        parsedResume = parseResumeText(text);
      }
    } catch (aiError) {
      console.error('AI parsing failed, using fallback:', aiError);
      parsedResume = parseResumeText(text);
    }
    
    // If AI parsing returned nothing, use fallback
    if (!parsedResume) {
      console.log('AI parsing returned no results, using fallback');
      parsedResume = parseResumeText(text);
      usedAI = false;
    }
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    // Return the parsed content and block structure
    return res.json({
      success: true,
      text: text,
      structured: parsedResume,
      aiProcessed: usedAI,
      filename: req.file.originalname || 'resume.pdf',
      pages: pdfData.numpages || 1
    });
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
    } else if (error.code === 'ENOENT') {
      errorMessage = 'Error accessing the uploaded file. Please try again.';
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
  console.log(`AI integration: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Not configured (set OPENAI_API_KEY in .env file)'}`);
});

module.exports = app;
