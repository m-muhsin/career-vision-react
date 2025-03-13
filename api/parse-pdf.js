import { Buffer } from 'buffer';

export const config = {
  api: {
    bodyParser: false,  // needed for file uploads
  },
};

export default async function handler(req, res) {
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

    // Dynamically import PDF.js to avoid initialization issues
    let pdfjsLib;
    try {
      pdfjsLib = await import('pdfjs-dist');
      // Configure PDF.js for serverless environment
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    } catch (importError) {
      console.error('Error importing pdfjs-dist:', importError);
      res.status(500).json({ error: 'PDF parsing library failed to load: ' + importError.message });
      return;
    }

    // Parse the PDF data
    const pdf = await pdfjsLib.getDocument({ data: pdfPart.data }).promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    res.status(200).json({ text: fullText });
  } catch (error) {
    console.error(error);
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