/**
 * AI-based resume parser utility
 * This is separated so it can be used conditionally based on environment
 */

/* global require, module */
const { parseResumeText } = require("./resume-parser.cjs");

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
  const resumeData = {
    Summary: {
      Name: "Alex Chen",
      Location: "San Francisco, CA",
      Description:
        "Full-stack developer with 5+ years of experience specializing in cloud-native applications and microservices architecture. Passionate about creating performant, accessible web experiences.",
    },
    Contact: {
      Location: "San Francisco, CA",
      Email: "alex.chen@gmail.com",
      LinkedIn: "https://www.linkedin.com/in/alexchen-dev",
      PersonalWebsite: "https://alexchen.dev",
      Phone: "(415) 555-7890",
    },
    Skills: {
      TopSkills: [
        "TypeScript",
        "React",
        "Node.js",
        "AWS",
        "GraphQL",
        "Docker",
        "MongoDB",
        "CI/CD",
      ],
    },
    Education: [
      {
        Institution: "Stanford University",
        Degree: "Master of Science in Computer Science",
        Duration: "2016 - 2018",
        GPA: "3.85/4.0",
        Coursework: [
          "Distributed Systems",
          "Machine Learning",
          "Advanced Algorithms",
        ],
      },
    ],
    Experiences: [
      {
        Company: "Stripe",
        Position: "Senior Software Engineer",
        Location: "San Francisco, CA",
        Duration: "January 2021 - Present",
        Responsibilities: [
          "Lead a team of 5 engineers building the next generation payment processing API handling $2M+ daily transactions",
          "Reduced API response time by 40% through implementation of Redis caching and query optimization",
          "Architected and deployed a fault-tolerant microservices system using Kubernetes and AWS EKS",
          "Implemented comprehensive monitoring with Datadog, reducing MTTR by 60%",
        ],
      },
    ],
  };

  try {
    console.log("Processing resume with OpenAI...");

    // Create a prompt that will instruct GPT to structure the resume
    const systemPrompt = `
    You are a professional resume parser. Your task is to accurately extract structured information from resume text.
    Parse the following resume text into a structured JSON format that follows this structure:
    ${JSON.stringify(resumeData)}
  
    `;

    const userPrompt = `Parse the following resume text:\n\n${text}`;
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
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
