/* global require, module */
const { parseResumeText } = require("./resume-parser.cjs");

/**
 * AI-based resume parser utility
 * This is separated so it can be used conditionally based on environment
 */

/**
 * Parses a resume using OpenAI
 * @param {string} text - The text content of the resume
 * @param {object} openai - Initialized OpenAI client
 * @returns {object} Structured resume data
 */
async function parseResumeWithAI(text, openai) {
  if (!openai) {
    console.log("OpenAI client not provided, using fallback parser");
    return parseResumeText(text);
  }

  try {
    console.log("Processing resume with OpenAI...");

    // Create a prompt that will instruct GPT to structure the resume
    const prompt = `Parse the following resume text into structured JSON format with clear categories for contact information, summary, skills, experiences, education, certifications, honors, and publications:\n\n${text}`;

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

module.exports = {
  parseResumeWithAI,
};
