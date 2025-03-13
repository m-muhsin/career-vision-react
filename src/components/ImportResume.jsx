import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "80px auto 0",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "16px",
    fontFamily: "var(--font-family-heading)",
    color: "var(--primary-color)",
  },
  dropzone: {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "border 0.3s ease",
  },
  dropzoneActive: {
    border: "2px dashed var(--secondary-color)",
    backgroundColor: "rgba(6, 156, 175, 0.05)",
  },
  uploadIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    color: "var(--secondary-color)",
  },
  dropzoneText: {
    fontSize: "16px",
    marginBottom: "8px",
  },
  button: {
    backgroundColor: "var(--secondary-color)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "inline-block",
    marginTop: "12px",
    fontFamily: "var(--font-family-heading)",
  },
  statusContainer: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "4px",
  },
  loadingStatus: {
    backgroundColor: "rgba(6, 156, 175, 0.1)",
    color: "var(--secondary-color)",
  },
  spinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    marginRight: "8px",
    border: "3px solid rgba(6, 156, 175, 0.2)",
    borderRadius: "50%",
    borderTop: "3px solid var(--secondary-color)",
    animation: "spin 1s linear infinite",
  },
  errorStatus: {
    backgroundColor: "#ffebee",
    color: "#d32f2f",
  },
  successStatus: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  fileDetails: {
    marginTop: "12px",
    fontSize: "14px",
  },
};

const ImportResume = ({ onImportComplete }) => {
  const [status, setStatus] = useState({ type: null, message: "" });
  const [pdfText, setPdfText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Process the PDF file by sending it to the server
  const processPdf = async (file) => {
    try {
      setStatus({
        type: "loading",
        message: "Uploading and processing PDF...",
      });
      setSelectedFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      // Create form data to send file to server
      const formData = new FormData();
      formData.append("pdfFile", file);

      // Progress tracking for upload
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Promise wrapper for XHR to make it easier to work with
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(
                new Error(`Server returned ${xhr.status}: ${xhr.statusText}`)
              );
            }
          }
        };

        // Handle network errors
        xhr.onerror = () => {
          reject(new Error("Network error occurred while uploading PDF"));
        };
      });

      // Configure the request
      // Determine the appropriate API URL based on environment
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const apiUrl = isDevelopment
        ? "http://localhost:3001/api/parse-resume" // Development server URL
        : "/api/parse-resume"; // Production Vercel serverless function URL

      console.log("Using API URL:", apiUrl);

      xhr.open("POST", apiUrl, true);
      xhr.send(formData);

      // Wait for response
      const response = await uploadPromise;

      if (response.success) {
        console.log("Server response:", response);
        setPdfText(response.text);

        // Store the structured data for later use
        if (typeof window !== "undefined") {
          window.lastParsedResume = response;
        }

        const aiMessage = response.aiProcessed ? " (AI-enhanced parsing)" : "";

        setStatus({
          type: "success",
          message: `PDF processed successfully${aiMessage}! Click "Import Resume" to continue.`,
        });
      } else {
        throw new Error(response.error || "Unknown error processing PDF");
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setUploadProgress(0);

      // Provide more specific error messages based on error type
      let errorMessage = "Error processing PDF. Please try a different file.";

      if (error.message.includes("password")) {
        errorMessage =
          "This PDF is password protected. Please provide an unprotected PDF.";
      } else if (
        error.message.includes("invalid") ||
        error.message.includes("corrupt")
      ) {
        errorMessage = "The file is not a valid PDF or is corrupted.";
      } else if (error.message.includes("network")) {
        errorMessage =
          "Network error while uploading PDF. Please check your connection and try again.";
      } else if (error.message.includes("server")) {
        errorMessage =
          "Server error processing your PDF. Please try again later.";
      } else {
        // Detailed error for debugging
        errorMessage = `Error: ${
          error.message || "Unknown error"
        }. Please try a different PDF file.`;
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      processPdf(file);
    } else {
      setStatus({ type: "error", message: "Please upload a valid PDF file." });
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  // Import the resume after processing
  const handleImport = () => {
    if (!pdfText) {
      setStatus({ type: "error", message: "No PDF content to import." });
      return;
    }

    // Use the structured data from the server if available
    if (typeof window !== "undefined" && window.lastParsedResume) {
      if (window.lastParsedResume.blocks) {
        console.log(
          "Using AI-generated blocks from server:",
          window.lastParsedResume.blocks
        );
        // Use the pre-structured blocks from the server (AI or basic parsing)
        onImportComplete(parseResumeText(window.lastParsedResume));
        return;
      } else if (window.lastParsedResume.structured) {
        console.log("Using structured data from server");
        // Create blocks from structured data
        const resumeData = parseResumeText(window.lastParsedResume);
        console.log("Created blocks from structured data:", resumeData);
        onImportComplete(resumeData);
        return;
      }
    }

    console.log("Falling back to client-side parsing");
    // Fallback to client-side parsing if server didn't provide structured data
    const resumeData = parseResumeText({ text: pdfText });
    console.log("Created blocks from client-side parsing:", resumeData);
    onImportComplete(resumeData);
  };

  const parseResumeText = (resumeData) => {
    // If we have pre-structured blocks, transform them to match ideal format
    if (resumeData.blocks) {
      return transformBlocksToIdealFormat(resumeData.blocks);
    }

    // If we have structured data from the server
    if (resumeData.structured) {
      return createBlocksFromStructuredData(resumeData.structured);
    }

    // Fallback to basic parsing from raw text
    return createBasicResumeStructure(resumeData.text);
  };

  // Transform existing blocks to match the ideal format
  const transformBlocksToIdealFormat = (blocks) => {
    const result = [];
    
    // Process each block and transform it
    blocks.forEach(block => {
      // Header section
      if (block.name === "core/group" && block.clientId === "header-section") {
        result.push({
          ...block,
          attributes: {
            ...block.attributes,
            layout: { type: "constrained" },
            style: {
              spacing: {
                padding: {
                  top: "1em"
                }
              }
            }
          },
          innerBlocks: block.innerBlocks.map(innerBlock => {
            // Name heading
            if (innerBlock.name === "core/heading") {
              return {
                ...innerBlock,
                attributes: {
                  ...innerBlock.attributes,
                  textAlign: "center",
                  fontSize: "large",
                  style: {
                    typography: {
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    },
                    spacing: {
                      margin: {
                        top: "0",
                        bottom: "0.5em"
                      }
                    }
                  }
                }
              };
            }
            // Contact info
            if (innerBlock.name === "core/paragraph") {
              // First, split the content by separators to get individual items
              let content = innerBlock.attributes.content;
              const contactItems = content.split(/\s*\|\s*/);
              const processedItems = [];
              
              // Process each contact item separately
              contactItems.forEach(item => {
                const trimmedItem = item.trim();
                
                // Skip empty items
                if (!trimmedItem) return;
                
                // Email address
                if (trimmedItem.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/)) {
                  processedItems.push(`<a href="mailto:${trimmedItem}">${trimmedItem}</a>`);
                }
                // LinkedIn profile
                else if (trimmedItem.match(/linkedin\.com\/in\/[a-zA-Z0-9._-]+/)) {
                  processedItems.push(`<a href="https://www.${trimmedItem}" target="_blank">${trimmedItem}</a>`);
                }
                // Website URL
                else if (trimmedItem.match(/([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/)) {
                  // Ignore if it's just a location with country code like "Colombo, Sri Lanka"
                  if (!trimmedItem.includes(",")) {
                    const url = trimmedItem.startsWith("http") ? trimmedItem : `https://${trimmedItem}`;
                    processedItems.push(`<a href="${url}" target="_blank">${trimmedItem}</a>`);
                  } else {
                    processedItems.push(trimmedItem);
                  }
                }
                // Other items (like location)
                else {
                  processedItems.push(trimmedItem);
                }
              });
              
              // Join back with separators
              const processedContent = processedItems.join(" | ");

              return {
                ...innerBlock,
                attributes: {
                  ...innerBlock.attributes,
                  content: processedContent,
                  align: "center",
                  fontSize: "small"
                }
              };
            }
            return innerBlock;
          })
        });
        
        // Add separator after header
        result.push({
          clientId: "separator-1",
          name: "core/separator",
          isValid: true,
          attributes: {
            opacity: "alpha-channel",
            tagName: "hr"
          },
          innerBlocks: []
        });
        return;
      }
      
      // Section headings and content
      if (block.name === "core/group" && block.attributes.tagName === "section") {
        // Extract section type from first innerBlock (heading)
        const sectionHeading = block.innerBlocks.find(b => b.name === "core/heading");
        const sectionType = sectionHeading?.attributes.content.toLowerCase() || "";
        
        // Add styled heading
        if (sectionHeading) {
          result.push({
            clientId: `${sectionHeading.attributes.content.toLowerCase().replace(/\s+/g, '-')}-heading`,
            name: "core/heading",
            isValid: true,
            attributes: {
              content: sectionHeading.attributes.content,
              level: 2,
              textAlign: "center",
              style: {
                typography: {
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: "18px"
                },
                spacing: {
                  margin: {
                    top: "1.5em",
                    bottom: "0.5em"
                  }
                },
                color: {
                  text: "#2c3e50"
                }
              }
            },
            innerBlocks: []
          });
        }
        
        // Handle content based on section type
        const contentBlock = block.innerBlocks.find(b => b.name === "core/paragraph");
        if (contentBlock) {
          // For general section content
          if (sectionType.includes("summary")) {
            result.push({
              clientId: "summary-content",
              name: "core/paragraph",
              isValid: true,
              attributes: {
                content: contentBlock.attributes.content
              },
              innerBlocks: []
            });
          }
          
          // For experience section
          else if (sectionType.includes("experience")) {
            // Parse experience entries from the paragraph content
            const experiences = parseExperienceEntries(contentBlock.attributes.content);
            experiences.forEach((job, index) => {
              result.push(createJobBlock(job, index));
            });
          }
          
          // For education section
          else if (sectionType.includes("education")) {
            const educationEntries = parseEducationEntries(contentBlock.attributes.content);
            educationEntries.forEach((edu, index) => {
              result.push(createEducationBlock(edu, index));
            });
          }
          
          // For skills section
          else if (sectionType.includes("skills")) {
            result.push({
              clientId: "skills-list",
              name: "core/paragraph",
              isValid: true,
              attributes: {
                content: formatSkillsList(contentBlock.attributes.content)
              },
              innerBlocks: []
            });
          }
          
          // For other sections, just add the content as is
          else {
            result.push({
              clientId: `${sectionType}-content`,
              name: "core/paragraph",
              isValid: true,
              attributes: {
                content: contentBlock.attributes.content
              },
              innerBlocks: []
            });
          }
        }
        return;
      }
      
      // Add any other blocks as-is
      result.push(block);
    });
    
    return result;
  };

  // Parse job entries from experience content
  const parseExperienceEntries = (content) => {
    // Split by multiple newlines to separate job entries
    const entries = content.split(/\n\n+/);
    return entries.map(entry => {
      // Try to extract job information from each entry
      const result = { 
        title: "",
        company: "",
        location: "",
        duration: "",
        description: []
      };
      
      // Pattern: Company - Title (Duration, Location): Description
      if (entry.includes(" - ") && entry.includes("(") && entry.includes("):")) {
        const [company, rest] = entry.split(" - ", 2);
        result.company = company.trim();
        
        // Extract title, duration and location
        const titleDurationPart = rest.split(":", 2)[0];
        const titleMatch = titleDurationPart.match(/(.*?)\s*\(/);
        if (titleMatch) {
          result.title = titleMatch[1].trim();
        }
        
        // Extract duration and location from parentheses
        const durationLocationMatch = titleDurationPart.match(/\((.*?)\)/);
        if (durationLocationMatch) {
          const durationLocation = durationLocationMatch[1];
          
          // Try to separate duration and location
          if (durationLocation.includes(",")) {
            // If there's a comma, it might separate duration and location
            const [durationPart, ...locationParts] = durationLocation.split(",");
            result.duration = durationPart.trim();
            result.location = locationParts.join(",").trim();
          } else {
            // No comma, assume it's just duration
            result.duration = durationLocation.trim();
          }
        }
        
        // Extract description
        const descriptionPart = rest.split(":", 2)[1];
        if (descriptionPart) {
          // Split description into bullet points by sentences
          const descriptions = descriptionPart.trim().split(/\.\s+/);
          result.description = descriptions
            .filter(d => d.trim().length > 0)
            .map(d => d.trim() + (d.endsWith('.') ? '' : '.'));
        }
      } 
      // Other formats could be handled here
      else {
        // Basic fallback: just use the whole entry as description
        result.description = [entry];
      }
      
      return result;
    }).filter(job => job.company || job.title || job.description.length > 0);
  };

  // Create a job block structure from parsed job data
  const createJobBlock = (job, index) => {
    return {
      clientId: `job${index + 1}-group`,
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "div",
        style: {
          spacing: {
            margin: {
              bottom: "1.5em"
            }
          }
        }
      },
      innerBlocks: [
        // Job title heading
        {
          clientId: `job${index + 1}-title`,
          name: "core/heading",
          isValid: true,
          attributes: {
            content: job.title || "Position/Role",
            level: 3,
            style: {
              typography: {
                fontWeight: "600",
                fontSize: "16px"
              },
              spacing: {
                margin: {
                  bottom: "0.2em"
                }
              }
            }
          },
          innerBlocks: []
        },
        // Company, location, and duration
        {
          clientId: `job${index + 1}-company`,
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: `<strong>${job.company || "Company Name"}</strong>${job.location ? " | " + job.location : ""}${job.duration ? " | <em>(" + job.duration + ")</em>" : ""}`,
            style: {
              spacing: {
                margin: {
                  top: "0",
                  bottom: "0.5em"
                }
              },
              typography: {
                fontSize: "14px"
              }
            }
          },
          innerBlocks: []
        },
        // Job description as list
        {
          clientId: `job${index + 1}-desc`,
          name: "core/list",
          isValid: true,
          attributes: {
            values: "",
            ordered: false
          },
          innerBlocks: job.description.map((desc, i) => ({
            clientId: `job${index + 1}-desc-item-${i}`,
            name: "core/list-item",
            isValid: true,
            attributes: {
              content: desc
            },
            innerBlocks: []
          }))
        }
      ]
    };
  };

  // Parse education entries from content
  const parseEducationEntries = (content) => {
    // Split by multiple newlines to separate education entries
    const entries = content.split(/\n\n+/);
    return entries.map(entry => {
      // Try to extract education information
      const result = {
        degree: "",
        institution: "",
        duration: ""
      };
      
      // Try to match pattern: Institution - Degree (Duration)
      if (entry.includes(" - ")) {
        const [institution, rest] = entry.split(" - ", 2);
        result.institution = institution.trim();
        
        // Extract degree and duration
        if (rest.includes("(") && rest.includes(")")) {
          const degreeMatch = rest.match(/(.*?)\s*\(/);
          if (degreeMatch) {
            result.degree = degreeMatch[1].trim();
          }
          
          const durationMatch = rest.match(/\((.*?)\)/);
          if (durationMatch) {
            result.duration = durationMatch[1].trim();
          }
        } else {
          result.degree = rest.trim();
        }
      }
      // Fallback: use whole entry
      else {
        result.degree = entry;
      }
      
      return result;
    }).filter(edu => edu.institution || edu.degree);
  };

  // Create an education block
  const createEducationBlock = (education, index) => {
    return {
      clientId: `education${index + 1}-group`,
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "div"
      },
      innerBlocks: [
        // Degree title
        {
          clientId: `education${index + 1}-degree-title`,
          name: "core/heading",
          isValid: true,
          attributes: {
            content: education.degree || "Degree",
            level: 3,
            style: {
              typography: {
                fontWeight: "600",
                fontSize: "16px"
              }
            }
          },
          innerBlocks: []
        },
        // Institution and duration
        {
          clientId: `education${index + 1}-institution`,
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: `<strong>${education.institution || "Institution"}</strong>${education.duration ? " | <em>(" + education.duration + ")</em>" : ""}`,
            typography: {
              fontSize: "14px"
            }
          },
          innerBlocks: []
        }
      ]
    };
  };

  // Format skills list with bullet separators
  const formatSkillsList = (content) => {
    // Split by commas or existing separators
    const skills = content.split(/,|\s*\|\s*|\s*•\s*/);
    // Join with bullet character
    return skills
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .join(" • ");
  };

  // Create a basic resume structure from raw text
  const createBasicResumeStructure = (text) => {
    // Create a simple structure with the text
    return [
      {
        clientId: "header-section",
        name: "core/group",
        isValid: true,
        attributes: {
          tagName: "div",
          layout: { type: "constrained" },
          style: {
            spacing: {
              padding: {
                top: "1em"
              }
            }
          }
        },
        innerBlocks: [
          {
            clientId: "name-heading",
            name: "core/heading",
            isValid: true,
            attributes: {
              content: "Your Name",
              level: 1,
              textAlign: "center",
              fontSize: "large",
              style: {
                typography: {
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                },
                spacing: {
                  margin: {
                    top: "0",
                    bottom: "0.5em"
                  }
                }
              }
            },
            innerBlocks: []
          },
          {
            clientId: "contact-info",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: "Contact Information",
              align: "center",
              fontSize: "small"
            },
            innerBlocks: []
          }
        ]
      },
      {
        clientId: "separator-1",
        name: "core/separator",
        isValid: true,
        attributes: {
          opacity: "alpha-channel",
          tagName: "hr"
        },
        innerBlocks: []
      },
      {
        clientId: "content",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: text
        },
        innerBlocks: []
      }
    ];
  };

  // Helper function to create blocks from structured data
  const createBlocksFromStructuredData = (structured) => {
    const blocks = [];
    
    // Header with name and contact info
    blocks.push({
      clientId: "header-section",
      name: "core/group",
      isValid: true,
      attributes: {
        tagName: "div",
        layout: { type: "constrained" },
        style: {
          spacing: {
            padding: {
              top: "1em"
            }
          }
        }
      },
      innerBlocks: [
        {
          clientId: "name-heading",
          name: "core/heading",
          isValid: true,
          attributes: {
            content: structured.name || "Your Name",
            level: 1,
            textAlign: "center",
            fontSize: "large",
            style: {
              typography: {
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px"
              },
              spacing: {
                margin: {
                  top: "0",
                  bottom: "0.5em"
                }
              }
            }
          },
          innerBlocks: []
        },
        {
          clientId: "contact-info",
          name: "core/paragraph",
          isValid: true,
          attributes: {
            content: structured.contactInfo 
              ? structured.contactInfo
                .filter(item => item && item.trim() !== '' && item.trim() !== 'N/A')
                .join(" | ") 
              : "Contact Information",
            align: "center",
            fontSize: "small"
          },
          innerBlocks: []
        }
      ]
    });
    
    // Separator
    blocks.push({
      clientId: "separator-1",
      name: "core/separator",
      isValid: true,
      attributes: {
        opacity: "alpha-channel",
        tagName: "hr"
      },
      innerBlocks: []
    });
    
    // Summary section
    if (structured.sections.summary && structured.sections.summary.length > 0) {
      blocks.push({
        clientId: "summary-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Professional Summary",
          textAlign: "center",
          level: 2,
          style: {
            typography: {
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "18px"
            },
            spacing: {
              margin: {
                top: "1.5em",
                bottom: "0.5em"
              }
            },
            color: {
              text: "#2c3e50"
            }
          }
        },
        innerBlocks: []
      });
      
      blocks.push({
        clientId: "summary-content",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: structured.sections.summary.join("\n\n")
        },
        innerBlocks: []
      });
    }
    
    // Experience section
    if (structured.sections.experience && structured.sections.experience.length > 0) {
      blocks.push({
        clientId: "experience-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Work Experience",
          textAlign: "center",
          level: 2,
          style: {
            typography: {
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "18px"
            },
            spacing: {
              margin: {
                top: "1.5em",
                bottom: "0.5em"
              }
            },
            color: {
              text: "#2c3e50"
            }
          }
        },
        innerBlocks: []
      });
      
      // Create job blocks from experience data
      const jobs = parseExperienceEntries(structured.sections.experience.join("\n\n\n"));
      jobs.forEach((job, index) => {
        blocks.push(createJobBlock(job, index));
      });
    }
    
    // Education section
    if (structured.sections.education && structured.sections.education.length > 0) {
      blocks.push({
        clientId: "education-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Education",
          level: 2,
          textAlign: "center",
          style: {
            typography: {
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "18px"
            },
            spacing: {
              margin: {
                top: "1.5em",
                bottom: "0.5em"
              }
            },
            color: {
              text: "#2c3e50"
            }
          }
        },
        innerBlocks: []
      });
      
      // Create education blocks
      const educationEntries = parseEducationEntries(structured.sections.education.join("\n\n"));
      educationEntries.forEach((edu, index) => {
        blocks.push(createEducationBlock(edu, index));
      });
    }
    
    // Skills section
    if (structured.sections.skills && structured.sections.skills.length > 0) {
      blocks.push({
        clientId: "skills-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Skills",
          level: 2,
          textAlign: "center",
          style: {
            typography: {
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "18px"
            },
            spacing: {
              margin: {
                top: "1.5em",
                bottom: "0.5em"
              }
            },
            color: {
              text: "#2c3e50"
            }
          }
        },
        innerBlocks: []
      });
      
      blocks.push({
        clientId: "skills-list",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: formatSkillsList(structured.sections.skills.join(", "))
        },
        innerBlocks: []
      });
    }
    
    return blocks;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Import Your Resume</h2>

      <div
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.dropzoneActive : {}),
        }}
      >
        <input {...getInputProps()} />
        <div style={styles.uploadIcon}>📄</div>
        <p style={styles.dropzoneText}>
          {isDragActive
            ? "Drop your PDF resume here..."
            : "Drag & drop your PDF resume here, or click to select file"}
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Supports PDF format only
        </p>
      </div>

      {selectedFile && (
        <div style={styles.fileDetails}>
          <strong>Selected file:</strong> {selectedFile.name} (
          {Math.round(selectedFile.size / 1024)} KB)
        </div>
      )}

      {isUploading && uploadProgress > 0 && (
        <div style={{ marginTop: "15px" }}>
          <div
            style={{
              height: "8px",
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${uploadProgress}%`,
                backgroundColor: "var(--secondary-color)",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            {uploadProgress}% - Uploading and processing PDF...
          </p>
        </div>
      )}

      {status.type && !(isUploading && uploadProgress > 0) && (
        <div
          style={{
            ...styles.statusContainer,
            ...(status.type === "loading" ? styles.loadingStatus : {}),
            ...(status.type === "error" ? styles.errorStatus : {}),
            ...(status.type === "success" ? styles.successStatus : {}),
          }}
        >
          {status.type === "loading" && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <div style={styles.spinner}></div>
              <span>{status.message}</span>
            </div>
          )}
          {status.type !== "loading" && status.message}
        </div>
      )}

      {status.type === "success" && (
        <button style={styles.button} onClick={handleImport}>
          Import Resume
        </button>
      )}
    </div>
  );
};

export default ImportResume;
