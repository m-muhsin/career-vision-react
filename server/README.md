# Resume Parser Server

A Node.js server that handles PDF resume parsing for the Career Vision application. This server provides an API endpoint that accepts PDF resume uploads, processes them using the pdf-parse library, and returns structured data.

## Features

- PDF file upload and processing
- Text extraction from PDF files
- Simple resume structure parsing
- Error handling for various PDF issues
- File cleanup after processing

## Installation

1. Install Node.js (v14+ recommended)
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the Server

Development mode (with auto-restart):
```
npm run dev
```

Production mode:
```
npm start
```

The server will start on port 3001 by default (can be changed using the PORT environment variable).

## API Endpoints

### Parse Resume

**URL**: `/api/parse-resume`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`  

**Parameters**:
- `pdfFile`: The PDF file to parse (required)

**Success Response**:
```json
{
  "success": true,
  "text": "Raw text content from the PDF",
  "structured": {
    "name": "Extracted name",
    "contactInfo": ["email@example.com", "123-456-7890"],
    "sections": {
      "summary": ["Summary content lines"],
      "experience": ["Experience content lines"],
      "education": ["Education content lines"],
      "skills": ["Skills content lines"]
    }
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Integration with Frontend

To use this server with the Career Vision frontend:

1. Update the API endpoint URL in `src/components/ImportResume.jsx` to match your server URL
2. Make sure CORS is properly configured if running on different domains/ports

## Limitations

- Works best with text-based PDFs
- Cannot extract text from image-based PDFs
- Basic resume structure parsing (no AI/ML-based extraction)
- Cannot handle password-protected PDFs 