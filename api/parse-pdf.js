const { Buffer } = require('buffer');

// Configuration for API
const config = {
  api: {
    bodyParser: false,  // needed for file uploads
  },
};

// Main handler function
async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST requests are allowed.' });
    return;
  }

  try {
    // Get the raw request body as buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Find the PDF file content in the multipart form data
    const boundary = getBoundary(req.headers['content-type']);
    if (!boundary) {
      res.status(400).json({ error: 'Missing boundary in content-type' });
      return;
    }

    // Extract PDF data from the multipart form data
    const parts = extractParts(buffer, boundary);
    const pdfPart = parts.find(part => part.filename && part.filename.endsWith('.pdf'));
    
    if (!pdfPart) {
      res.status(400).json({ error: 'No PDF file found in request' });
      return;
    }
    
    // Log some info about the PDF for debugging
    console.log(`Processing PDF: ${pdfPart.filename}, size: ${pdfPart.data.length} bytes`);

    // Use PDF.js for all PDF parsing
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
      const uint8Array = new Uint8Array(pdfPart.data);
      
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        disableRange: true,
        disableStream: true,
        disableAutoFetch: true,
        isEvalSupported: false
      });
      
      const pdf = await loadingTask.promise;
      console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);

      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += pageText + '\n\n';
        
        console.log(`Processed page ${pageNum}/${pdf.numPages}`);
      }

      if (!fullText || fullText.trim().length === 0) {
        return res.status(400).json({ 
          error: 'No text could be extracted from this PDF. It may be image-based or secured.' 
        });
      }

      res.status(200).json({ 
        text: fullText,
        method: 'pdfjs'
      });
    } catch (pdfError) {
      console.error('PDF processing error:', pdfError);
      res.status(400).json({ 
        error: `PDF processing failed: ${pdfError.message || 'Unknown error'}. Please try a different PDF file.` 
      });
    }
  } catch (error) {
    console.error('General error:', error);
    res.status(500).json({ error: 'PDF parsing failed: ' + error.message });
  }
}

// Helper function to get the boundary from the content-type header
function getBoundary(contentType) {
  if (!contentType) return null;
  const parts = contentType.split(';').map(part => part.trim());
  const boundaryPart = parts.find(part => part.startsWith('boundary='));
  if (!boundaryPart) return null;
  return boundaryPart.substring('boundary='.length);
}

// Helper function to extract parts from a multipart form data buffer
function extractParts(buffer, boundary) {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundaryBuffer = Buffer.from(`--${boundary}--`);
  
  const parts = [];
  let start = 0;
  
  while (start < buffer.length) {
    // Find the next boundary
    const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
    if (boundaryIndex === -1) break;
    
    // Check if it's the end boundary
    if (buffer.indexOf(endBoundaryBuffer, boundaryIndex) === boundaryIndex) break;
    
    // Find the end of the headers
    const headersEnd = buffer.indexOf('\r\n\r\n', boundaryIndex);
    if (headersEnd === -1) break;
    
    // Parse headers
    const headersString = buffer.slice(boundaryIndex + boundaryBuffer.length + 2, headersEnd).toString();
    const headers = parseHeaders(headersString);
    
    // Get content disposition
    const contentDisposition = headers['content-disposition'] || '';
    const nameMatch = contentDisposition.match(/name="([^"]+)"/);
    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
    
    const name = nameMatch ? nameMatch[1] : '';
    const filename = filenameMatch ? filenameMatch[1] : '';
    
    // Find the next boundary to determine where the data ends
    const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, headersEnd);
    const dataEnd = nextBoundaryIndex !== -1 ? nextBoundaryIndex - 2 : buffer.length; // -2 for the \r\n
    
    // Extract the data
    const data = buffer.slice(headersEnd + 4, dataEnd);
    
    parts.push({
      name,
      filename,
      contentType: headers['content-type'],
      data
    });
    
    start = nextBoundaryIndex !== -1 ? nextBoundaryIndex : buffer.length;
  }
  
  return parts;
}

// Helper function to parse headers
function parseHeaders(headersString) {
  const headers = {};
  const lines = headersString.split('\r\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const name = line.slice(0, colonIndex).toLowerCase();
    const value = line.slice(colonIndex + 1).trim();
    headers[name] = value;
  }
  
  return headers;
}

// Export configuration and handler
module.exports = handler;
module.exports.config = config;