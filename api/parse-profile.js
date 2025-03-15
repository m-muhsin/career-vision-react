const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  // Ensure we're working with an array of strings
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

//export the functions using commonjs
module.exports = {
  parseResumeWithAI,
  parseResumeText,
  convertToBlockStructure,
};
