import * as pdfjsLib from 'pdfjs-dist';
import formidable from 'formidable';
import fs from 'fs';

// Configure PDF.js for serverless environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  const form = new formidable.IncomingForm();

  try {
    const [_, files] = await form.parse(req);

    const file = files.file[0]; // Access uploaded PDF file

    if (!file || file.mimetype !== 'application/pdf') {
      res.status(400).json({ error: 'Please upload a valid PDF file.' });
      return;
    }

    const pdfBuffer = await fs.promises.readFile(file.filepath);

    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;

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
    res.status(500).json({ error: 'PDF parsing failed.' });
  }
}