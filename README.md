# Career Vision React

A modern resume builder application with PDF import capabilities and AI-powered resume parsing.

## Features

- Import resumes from PDF files
- AI-powered resume parsing using OpenAI
- Edit and customize your resume
- Professional templates
- Print-ready output

## Development Setup

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- OpenAI API key (for AI-powered resume parsing)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Install server dependencies:
   ```
   cd server
   npm install
   cd ..
   ```
4. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

### Running the Development Environment

To run both the React app and the PDF processing server:

```
npm run dev:all
```

This will start:
- React app at http://localhost:5173
- PDF processing server at http://localhost:3001

### Running Components Separately

To run just the React app:
```
npm run dev
```

To run just the PDF processing server:
```
npm run server
```

## PDF Import Functionality

The application uses a Node.js server to process PDF files. When running in development mode, the server needs to be running at http://localhost:3001. In production (Vercel deployment), the PDF processing is handled by serverless functions.

### AI-Powered Resume Parsing

The application uses OpenAI's GPT models to intelligently parse and structure resume content. This provides more accurate section detection and content organization compared to traditional parsing methods.

To enable AI parsing:
1. Obtain an API key from [OpenAI](https://platform.openai.com/)
2. Add the key to your `.env` file as shown in the installation section
3. Restart the server

If no API key is provided, the application will fall back to basic parsing methods.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your OpenAI API key as an environment variable in the Vercel project settings
4. Vercel will automatically detect the configuration and deploy both the React app and the serverless API

## Troubleshooting

### PDF Import Issues

If you encounter "404 Not Found" errors when trying to import PDFs:

1. Make sure the server is running (`npm run server`)
2. Check that the server is accessible at http://localhost:3001
3. Verify that CORS is properly configured for your development environment

### API Connection Issues

The application automatically detects whether it's running in development or production mode and uses the appropriate API URL. If you're having connection issues:

1. Check the browser console for the API URL being used
2. Verify that the server is running on that URL
3. Check for any CORS errors in the browser console

### OpenAI Integration Issues

If the AI parsing is not working:

1. Check that your OpenAI API key is valid and has sufficient credits
2. Verify that the key is correctly set in your `.env` file
3. Check the server logs for any API-related errors
4. The application will fall back to basic parsing if AI parsing fails
