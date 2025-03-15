const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { createRouter } = require("next-connect");

// Configure middleware for serverless environment
const router = createRouter();

// Use in-memory storage for serverless environment
const storage = multer.memoryStorage();

// Configure upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase limit to 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Helper function to parse resume with OpenAI
async function parseResumeWithAI(text) {
  try {
    console.log("Processing resume with OpenAI...");

    // Create a prompt that will instruct GPT to structure the resume
    const prompt = `
    Parse the following resume and format it into a structured JSON object with the following format:
    {
      "name": "Full Name",
      "contactInfo": ["email", "phone", "linkedin", "location"],
      "sections": {
        "summary": ["paragraph1", "paragraph2"],
        "experience": ["job1 description as a single string", "job2 description as a single string"],
        "education": ["education1 description as a single string", "education2 description as a single string"],
        "skills": ["skill1", "skill2"]
      }
    }
    
    Each entry in the arrays should be a STRING, not an object. For example, a job entry should be formatted as a single text string like: "Company Name - Job Title (2018-2020): Description of responsibilities and achievements."
    
    The resume text is:
    ${text}
    
    Make sure to maintain correct paragraph breaks and formatting. Extract as much detail as possible from the text, but ensure ALL array items are strings, not nested objects.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume parser. Your task is to accurately extract structured information from resume text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    });

    // Extract and parse the response
    const aiResponse = response.choices[0].message.content.trim();

    // Try to extract a JSON object from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      try {
        const parsedData = JSON.parse(jsonString);

        // Validate and sanitize the response to ensure all section items are strings
        if (parsedData.sections) {
          Object.keys(parsedData.sections).forEach((sectionKey) => {
            if (Array.isArray(parsedData.sections[sectionKey])) {
              parsedData.sections[sectionKey] = parsedData.sections[
                sectionKey
              ].map((item) => {
                if (typeof item === "string") return item;
                if (item === null || item === undefined) return "";
                if (typeof item === "object") {
                  try {
                    return JSON.stringify(item).replace(/[{}"]/g, "").trim();
                  } catch {
                    return String(item);
                  }
                }
                return String(item);
              });
            }
          });
        }

        return parsedData;
      } catch (parseError) {
        console.error("Error parsing JSON from AI response:", parseError);
        return parseResumeText(text); // Fall back to basic parser
      }
    } else {
      console.error("No JSON found in AI response");
      return parseResumeText(text); // Fall back to basic parser
    }
  } catch (error) {
    console.error("Error using OpenAI to parse resume:", error);
    // Fall back to basic parsing
    return parseResumeText(text);
  }
}

// Original resume parsing helper function as fallback
function parseResumeText(text) {
  // Split text into lines and remove empty lines
  const lines = text.split(/\n|\r\n|\r/).filter((line) => line.trim());

  if (lines.length === 0) {
    return { error: "No text content found in the PDF." };
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
      skills: [],
    };

    // Look for patterns that resemble contact info
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/;
    const urlRegex =
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-z0-9][-a-z0-9]+\.[a-z0-9-.]+)/i;

    // Keywords that typically indicate sections
    const sectionKeywords = {
      summary: [
        "summary",
        "profile",
        "objective",
        "about",
        "professional summary",
      ],
      experience: [
        "experience",
        "work experience",
        "employment",
        "work history",
        "professional experience",
      ],
      education: [
        "education",
        "academic",
        "degree",
        "university",
        "college",
        "school",
      ],
      skills: [
        "skills",
        "expertise",
        "technologies",
        "technical skills",
        "proficiencies",
        "competencies",
      ],
    };

    // Simple classification of text into sections
    let currentSection = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const originalLine = lines[i];

      // Check for contact information
      if (
        emailRegex.test(originalLine) ||
        phoneRegex.test(originalLine) ||
        urlRegex.test(originalLine)
      ) {
        contactInfo.push(originalLine);
        continue;
      }

      // Check if line is a section header
      let foundSection = false;
      for (const [section, keywords] of Object.entries(sectionKeywords)) {
        if (keywords.some((keyword) => line.includes(keyword))) {
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
      name,
      contactInfo,
      sections,
    };
  } catch (error) {
    console.error("Error structuring resume data:", error);
    // Fall back to returning just minimal structure
    return {
      name: "Could not parse name",
      contactInfo: [],
      sections: {
        summary: [],
        experience: [],
        education: [],
        skills: [],
      },
    };
  }
}

// Convert parsed resume to the block structure expected by the frontend
function convertToBlockStructure(parsedResume) {
  return [
    createHeaderBlock(parsedResume.name, parsedResume.contactInfo),
    createSectionBlock(
      "Professional Summary",
      parsedResume.sections.summary || [],
      "summary"
    ),
    createSectionBlock(
      "Experience",
      parsedResume.sections.experience || [],
      "experience"
    ),
    createSectionBlock(
      "Education",
      parsedResume.sections.education || [],
      "education"
    ),
    createSectionBlock(
      "Skills & Expertise",
      parsedResume.sections.skills || [],
      "skills"
    ),
  ];
}

// Helper function to create the header block with name and contact info
function createHeaderBlock(name, contactInfo) {
  return {
    clientId: "header-section",
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "div",
      layout: { type: "constrained" },
    },
    innerBlocks: [
      {
        clientId: "name-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: name || "Your Full Name",
          level: 1,
          textAlign: "center",
          fontSize: "large",
        },
        innerBlocks: [],
      },
      {
        clientId: "contact-info",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: Array.isArray(contactInfo)
            ? contactInfo.join(" | ")
            : "Contact information",
          align: "center",
          fontSize: "small",
        },
        innerBlocks: [],
      },
    ],
  };
}

// Helper function to create section blocks with different formatting per section type
function createSectionBlock(title, content, sectionType) {
  const safeContent = Array.isArray(content)
    ? content.map((item) => {
        if (item === null || item === undefined) return "";
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          try {
            return JSON.stringify(item).replace(/[{}"]/g, "").trim();
          } catch {
            return String(item);
          }
        }
        return String(item);
      })
    : [];

  let contentText = "";

  // Format content based on section type
  switch (sectionType) {
    case "summary":
      // Paragraphs with space between them
      contentText =
        safeContent.length > 0
          ? safeContent.join("\n\n")
          : `Your professional summary will appear here`;
      break;

    case "experience":
      // Each job gets its own paragraph with spacing
      contentText =
        safeContent.length > 0
          ? safeContent.join("\n\n\n")
          : `Your work experience will appear here`;
      break;

    case "education":
      // Each education entry gets its own paragraph
      contentText =
        safeContent.length > 0
          ? safeContent.join("\n\n")
          : `Your education information will appear here`;
      break;

    case "skills":
      // Skills can be formatted as a list or paragraphs
      if (safeContent.length > 0) {
        // If there are many short skills items, format as a list
        if (safeContent.length > 5 && safeContent.every((s) => s.length < 50)) {
          // Join with commas for a comma-separated list
          contentText = safeContent.join(", ");
        } else {
          // Otherwise, each skill gets its own paragraph
          contentText = safeContent.join("\n\n");
        }
      } else {
        contentText = `Your skills will appear here`;
      }
      break;

    default:
      // Default formatting
      contentText =
        safeContent.length > 0
          ? safeContent.join("\n\n")
          : `Your ${title.toLowerCase()} information will appear here`;
  }

  return {
    clientId: `${title.toLowerCase().replace(/\s+/g, "-")}-section`,
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "section",
    },
    innerBlocks: [
      {
        clientId: `${title.toLowerCase().replace(/\s+/g, "-")}-heading`,
        name: "core/heading",
        isValid: true,
        attributes: {
          content: title,
          level: 2,
        },
        innerBlocks: [],
      },
      {
        clientId: `${title.toLowerCase().replace(/\s+/g, "-")}-content`,
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: contentText,
        },
        innerBlocks: [],
      },
    ],
  };
}

// API endpoint to handle resume PDF upload and parsing
export default async function handler(req, res) {
  try {

    // use multipart-form-data to parse the pdf file
    const formData = await req.formData();
    const pdfFile = formData.get("pdfFile");

    const pdfData = await pdfParse(pdfFile);

    // Extract text content
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "No text could be extracted from this PDF. It may be image-based or secured against text extraction.",
      });
    }

    // Determine if we should use AI
    const useAI = !!process.env.OPENAI_API_KEY;
    let parsedResume;

    parsedResume = await parseResumeWithAI(text);

    // Convert to block structure
    const blockStructure = convertToBlockStructure(parsedResume);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Return the parsed content and block structure
    return res.json({
      success: true,
      text: text,
      structured: parsedResume,
      blocks: blockStructure,
      aiProcessed: useAI,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);

    // Provide more detailed error messages
    let errorMessage = "Error processing PDF";

    if (error.message.includes("password")) {
      errorMessage =
        "This PDF is password protected. Please provide an unprotected PDF.";
    } else if (error.message.includes("file format")) {
      errorMessage = "The file is not a valid PDF or is corrupted.";
    } else if (error.message.includes("too large")) {
      errorMessage = "The PDF file is too large. Maximum size is 50MB.";
    } else if (error.code === "ENOENT") {
      errorMessage = "Error accessing the uploaded file. Please try again.";
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
