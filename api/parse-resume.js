/* global require, module */
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
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase limit to 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Function to generate Gutenberg blocks from structured data
function generateGutenbergBlocks(structured) {
  if (!structured) return [];
  
  const blocks = [];
  
  // Header section with name and contact info
  blocks.push({
    clientId: "header-section",
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "div",
      layout: {
        type: "constrained"
      }
    },
    innerBlocks: [
      {
        clientId: "name-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: structured.name || "Resume",
          level: 1,
          textAlign: "center",
          fontSize: "large"
        },
        innerBlocks: []
      },
      {
        clientId: "contact-info",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: (structured.contactInfo || []).join(' | '),
          align: "center",
          fontSize: "small"
        },
        innerBlocks: []
      }
    ]
  });
  
  // Professional Summary section
  if (structured.sections && structured.sections.summary && structured.sections.summary.length > 0) {
    blocks.push({
      clientId: "professional-summary-section",
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "section"
      },
      innerBlocks: [
        {
          clientId: "professional-summary-heading",
          name: "core/heading",
          isValid: true,
          attributes: {
            content: "Professional Summary",
            level: 2
          },
          innerBlocks: []
        },
        {
          clientId: "professional-summary-content",
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: structured.sections.summary.join('\n\n')
          },
          innerBlocks: []
        }
      ]
    });
  }
  
  // Experience section
  if (structured.sections && structured.sections.experience && structured.sections.experience.length > 0) {
    blocks.push({
      clientId: "experience-section",
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "section"
      },
      innerBlocks: [
        {
          clientId: "experience-heading",
          name: "core/heading",
          isValid: true,
          attributes: {
            content: "Experience",
            level: 2
          },
          innerBlocks: []
        },
        {
          clientId: "experience-content",
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: structured.sections.experience.join('\n\n\n')
          },
          innerBlocks: []
        }
      ]
    });
  }
  
  // Education section
  if (structured.sections && structured.sections.education && structured.sections.education.length > 0) {
    blocks.push({
      clientId: "education-section",
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "section"
      },
      innerBlocks: [
        {
          clientId: "education-heading",
          name: "core/heading",
          isValid: true,
          attributes: {
            content: "Education",
            level: 2
          },
          innerBlocks: []
        },
        {
          clientId: "education-content",
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: structured.sections.education.join('\n\n')
          },
          innerBlocks: []
        }
      ]
    });
  }
  
  // Skills section
  if (structured.sections && structured.sections.skills && structured.sections.skills.length > 0) {
    blocks.push({
      clientId: "skills-&-expertise-section",
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "section"
      },
      innerBlocks: [
        {
          clientId: "skills-&-expertise-heading",
          name: "core/heading",
          isValid: true,
          attributes: {
            content: "Skills & Expertise",
            level: 2
          },
          innerBlocks: []
        },
        {
          clientId: "skills-&-expertise-content",
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: structured.sections.skills.join(', ')
          },
          innerBlocks: []
        }
      ]
    });
  }
  
  return blocks;
}

// Improved resume parsing function
function parseResumeText(text) {
  // Split text into lines and remove empty lines
  const lines = text.split(/\n|\r\n|\r/).filter(line => line.trim());
  
  if (lines.length === 0) {
    return { 
      name: "Could not parse name",
      contactInfo: ["N/A", "N/A", "N/A", "N/A"],
      sections: {
        summary: [],
        experience: [],
        education: [],
        skills: []
      }
    };
  }
  
  // Attempt to structure the resume data
  try {
    // Extract basic sections
    let name = '';
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
    const locationRegex = /([A-Za-z\s]+),\s*([A-Za-z\s]+)/;
    
    // Keywords that typically indicate sections
    const sectionKeywords = {
      summary: ['summary', 'profile', 'objective', 'about', 'professional summary'],
      experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
      education: ['education', 'academic', 'degree', 'university', 'college', 'school'],
      skills: ['skills', 'expertise', 'technologies', 'technical skills', 'proficiencies', 'competencies', 'languages', 'top skills']
    };
    
    // Try to find the name (usually one of the first few lines with 2+ words)
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const words = lines[i].trim().split(/\s+/);
      if (words.length >= 2 && words.length <= 5 && !/page|contact|summary|experience|education|skills/i.test(lines[i])) {
        name = lines[i].trim();
        break;
      }
    }
    
    // If we couldn't find a name, use the first line
    if (!name && lines.length > 0) {
      name = lines[0].trim();
    }
    
    // Simple classification of text into sections
    let currentSection = null;
    let experienceEntries = [];
    let currentExperience = null;
    let educationEntries = [];
    let currentEducation = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const originalLine = lines[i];
      
      // Check for contact information
      if (emailRegex.test(originalLine)) {
        contactInfo.push(originalLine.match(emailRegex)[0]);
        continue;
      }
      
      if (phoneRegex.test(originalLine)) {
        contactInfo.push(originalLine.match(phoneRegex)[0]);
        continue;
      }
      
      if (urlRegex.test(originalLine)) {
        contactInfo.push(originalLine.match(urlRegex)[0]);
        continue;
      }
      
      if (locationRegex.test(originalLine) && contactInfo.length < 4) {
        contactInfo.push(originalLine.match(locationRegex)[0]);
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
      
      // Process experience section more intelligently
      if (currentSection === 'experience') {
        // Check if this line might be a job title or company
        if (/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\s*-\s*/i.test(originalLine)) {
          // This looks like the start of a new job entry
          if (currentExperience) {
            experienceEntries.push(currentExperience);
          }
          
          // Extract company, title, date range
          const parts = originalLine.split(/\s*-\s*/);
          const dateRange = parts.pop();
          const titleAndCompany = parts.join(' - ').trim();
          
          currentExperience = {
            titleAndCompany,
            dateRange,
            location: '',
            description: []
          };
          
          continue;
        }
        
        // Check if this is a location line
        if (/\b(united states|usa|canada|uk|australia|remote|hybrid)\b/i.test(originalLine) && currentExperience && !currentExperience.location) {
          currentExperience.location = originalLine.trim();
          continue;
        }
        
        // Otherwise, add to the current experience description
        if (currentExperience) {
          currentExperience.description.push(originalLine.trim());
        } else {
          sections.experience.push(originalLine.trim());
        }
      }
      // Process education section more intelligently
      else if (currentSection === 'education') {
        // Check if this line might be a degree or institution
        if (/\b(university|college|school|academy|institute)\b/i.test(originalLine) || /\b(bachelor|master|phd|degree|diploma)\b/i.test(originalLine)) {
          // This looks like the start of a new education entry
          if (currentEducation) {
            educationEntries.push(currentEducation);
          }
          
          currentEducation = {
            institution: originalLine.trim(),
            details: []
          };
          
          continue;
        }
        
        // Otherwise, add to the current education details
        if (currentEducation) {
          currentEducation.details.push(originalLine.trim());
        } else {
          sections.education.push(originalLine.trim());
        }
      }
      // Add line to current section if we've identified one
      else if (currentSection && sections[currentSection] !== undefined) {
        sections[currentSection].push(originalLine.trim());
      }
      // If we're near the top and haven't identified a section yet, it might be part of the summary
      else if (i < 15) {
        sections.summary.push(originalLine.trim());
      }
    }
    
    // Add the last experience entry if there is one
    if (currentExperience) {
      experienceEntries.push(currentExperience);
    }
    
    // Add the last education entry if there is one
    if (currentEducation) {
      educationEntries.push(currentEducation);
    }
    
    // Format experience entries
    if (experienceEntries.length > 0) {
      sections.experience = experienceEntries.map(entry => {
        let location = entry.location ? `, ${entry.location}` : '';
        return `${entry.titleAndCompany} (${entry.dateRange}${location}): ${entry.description.join(' ')}`;
      });
    }
    
    // Format education entries
    if (educationEntries.length > 0) {
      sections.education = educationEntries.map(entry => {
        return `${entry.institution} - ${entry.details.join(' ')}`;
      });
    }
    
    // Ensure we have at least one contact method
    if (contactInfo.length === 0) {
      contactInfo.push('N/A');
    }
    
    // If we have less than 4 contact items, add placeholders
    while (contactInfo.length < 4) {
      contactInfo.push('N/A');
    }
    
    return {
      name,
      contactInfo,
      sections
    };
  } catch (error) {
    console.error('Error structuring resume data:', error);
    // Fall back to returning just the text
    return {
      name: "Could not parse name",
      contactInfo: ["N/A", "N/A", "N/A", "N/A"],
      sections: {
        summary: [],
        experience: [],
        education: [],
        skills: []
      }
    };
  }
}

// Function to normalize text for better formatting
function normalizeText(text) {
  // First, clean up the text by removing excessive whitespace
  let cleanedText = text
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    // Fix common PDF formatting issues
    .replace(/(\w) - (\w)/g, '$1-$2');
  
  // Identify and format section headers
  cleanedText = cleanedText
    .replace(/\b(Summary|Experience|Education|Skills|Expertise|Contact|Languages|Certifications|Publications|Honors-Awards)\b/gi, '\n\n$1\n');
  
  // Format bullet points
  cleanedText = cleanedText
    .replace(/([•\-*])\s+([A-Za-z])/g, '\n• $2');
  
  // Format job titles and dates
  cleanedText = cleanedText
    .replace(/([A-Za-z]+)\s+([A-Za-z]+)\s+\|\s+\(/g, '$1\n\n$2 | (')
    .replace(/([A-Za-z]+)\s+([A-Za-z]+)\s+\(([A-Za-z]+\s+\d{4})/g, '$1\n\n$2 ($3');
  
  // Add paragraph breaks after periods followed by capital letters
  cleanedText = cleanedText
    .replace(/\.([A-Z])/g, '.\n\n$1');
  
  // Add line breaks after company names and positions
  cleanedText = cleanedText
    .replace(/([A-Za-z]+)\s+(Partner|Engineer|Developer|Founder|Intern)/g, '$1\n$2');
  
  // Format dates and locations
  cleanedText = cleanedText
    .replace(/(\d{4})\s*-\s*([A-Za-z]+\s+\d{4})/g, '$1 - $2')
    .replace(/(\d{4})\s*-\s*(Present)/g, '$1 - $2');
  
  // Clean up excessive newlines
  cleanedText = cleanedText
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return cleanedText;
}

// Try to extract text from PDF using PDF.js
async function extractTextWithPdfJs(pdfBuffer) {
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
      } catch (_importError2) {
        console.log('Could not load PDF.js from standard path, trying es5 path');
        
        try {
          // Try the ES5 path as last resort
          pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');
          pdfjsWorker = require('pdfjs-dist/es5/build/pdf.worker.js');
          console.log('Successfully loaded PDF.js from ES5 path');
        } catch (_importError3) {
          console.error('All PDF.js import attempts failed');
          return null;
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
    const uint8Array = new Uint8Array(pdfBuffer);
    
    // Load and parse the PDF
    const pdfDoc = await pdfjsLib.getDocument({
      data: uint8Array,
      disableRange: true,
      disableStream: true,
      disableAutoFetch: true,
      isEvalSupported: false
    }).promise;
    
    const numPages = pdfDoc.numPages;
    console.log(`PDF loaded successfully. Pages: ${numPages}`);
    
    // Extract text from all pages
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
      
      console.log(`Processed page ${pageNum}/${pdfDoc.numPages}`);
    }
    
    return {
      text: normalizeText(fullText),
      pages: numPages
    };
  } catch (error) {
    console.error('Error using PDF.js:', error);
    return null;
  }
}

// Direct text extraction method as fallback
function extractTextDirect(pdfBuffer) {
  try {
    // Try to extract text directly from the PDF buffer
    const pdfString = pdfBuffer.toString('binary');
    
    // Basic regex to find text objects in the PDF
    const textMarkers = /\/(T[a-zA-Z]*|W|Tf|Tj|TJ|Td|TD|Tm)\s*(\(|\[)/g;
    const textChunks = [];
    let match;
    
    while ((match = textMarkers.exec(pdfString)) !== null) {
      // Find the start of the text object
      const startIdx = match.index + match[0].length - 1;
      let endIdx = startIdx;
      let depth = 1;
      const opener = pdfString[startIdx];
      const closer = opener === '(' ? ')' : ']';
      
      // Find the end of the text object by matching parentheses/brackets
      for (let i = startIdx + 1; i < pdfString.length && depth > 0; i++) {
        if (pdfString[i] === opener) depth++;
        else if (pdfString[i] === closer) depth--;
        if (depth === 0) endIdx = i;
      }
      
      if (endIdx > startIdx) {
        let text = pdfString.substring(startIdx + 1, endIdx);
        
        // Basic PDF text decoding
        text = text.replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\(/g, '(')
                .replace(/\\\)/g, ')')
                .replace(/\\\\/g, '\\');
        
        // Remove non-printable ASCII chars
        text = text.replace(/[^\x20-\x7E\r\n\t]/g, ' ');
        
        textChunks.push(text);
      }
    }
    
    // Process and clean the extracted text
    const fullText = textChunks.join(' ').trim();
    
    // If we got a significant amount of text, consider it successful
    if (fullText.length > 100) {
      console.log(`Extracted ${fullText.length} characters using direct method`);
      return {
        text: normalizeText(fullText),
        pages: 0 // We don't know the page count with this method
      };
    }
    
    return null;
  } catch (error) {
    console.error('Direct text extraction failed:', error);
    return null;
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
      const filename = req.file.originalname || 'resume.pdf';
      
      // Try to extract text using PDF.js first
      let extractionResult = await extractTextWithPdfJs(req.file.buffer);
      
      // If PDF.js failed, fall back to direct extraction
      if (!extractionResult) {
        console.log('Falling back to direct text extraction method');
        extractionResult = extractTextDirect(req.file.buffer);
        
        if (!extractionResult) {
          return res.status(400).json({
            success: false,
            error: 'Failed to extract text from PDF. The PDF may be image-based, secured, or in a format we cannot parse.'
          });
        }
      }
      
      const { text, pages } = extractionResult;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No text extracted from the PDF.'
        });
      }
      
      // Parse resume structure
      const parsedData = parseResumeText(text);
      
      // Generate Gutenberg blocks
      const blocks = generateGutenbergBlocks(parsedData);
      
      // Return the parsed content
      return res.json({
        success: true,
        text: text,
        structured: parsedData,
        blocks: blocks,
        aiProcessed: true,
        filename: filename,
        pages: pages || 1
      });
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
