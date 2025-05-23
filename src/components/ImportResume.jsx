import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Helper function to create blocks from structured data
const createBlocksFromStructuredData = (structured = {}) => {

  // The blocks array
  const blocks = [];

  // The header section
  const headerSection = {
    clientId: "header-section",
    name: "core/group",
    isValid: true,
    attributes: {},
    innerBlocks: [
      {
        clientId: "name-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: structured?.Summary?.Name || "Your Name",
          level: 1,
          textAlign: "center",
          fontSize: "large",
        },
        innerBlocks: [],
        spacing: {
          margin: {
            top: "0",
            bottom: "0.5em",
          },
        },
        color: {
          text: "#2c3e50",
        },
        style: {
          typography: {
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "1px",
          },
        },
      },
      {
        clientId: "contact-info-row",
        name: "core/group",
        isValid: true,
        attributes: {
          orientation: "horizontal",
          className: "contact-info-row flex-row is-layout-flow wp-block-group-is-layout-flow",
        },
        innerBlocks: [
          {
            clientId: "location-column",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: structured?.Contact?.Location || "Your Location",
              align: "center",
              fontSize: "small",
            },
            innerBlocks: [],
            color: {
              text: "#2c3e50",
            },
            style: {
              typography: {
                fontWeight: "400",
                fontSize: "small",
              },
            },
          },
          {
            clientId: "separator-1",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: "|",
              align: "center",
              fontSize: "small",
              className: "contact-info-separator",
            },
            innerBlocks: [],
            color: {
              text: "#cbd5e1",
            },
          },
          {
            clientId: "email-column",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: `<a href="mailto:${structured?.Contact?.Email || "your-email@example.com" }">${structured?.Contact?.Email || "your-email@example.com"}</a>`,
              align: "center",
              fontSize: "small",
            },
            innerBlocks: [],
            color: {
              text: "#2c3e50",
            },
            style: {
              typography: {
                fontWeight: "400",
                fontSize: "small",
              },
            },
          },
          {
            clientId: "separator-2",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: "|",
              align: "center",
              fontSize: "small",
              className: "contact-info-separator",
            },
            innerBlocks: [],
            color: {
              text: "#cbd5e1",
            },
          },
          {
            clientId: "linkedin-column",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: `<a href="${structured?.Contact?.LinkedIn || "https://www.linkedin.com/in/"}" target="_blank">${structured?.Contact?.LinkedIn || "https://www.linkedin.com/in/"}</a>`,
              align: "center",
              fontSize: "small",
            },
            innerBlocks: [],
            color: {
              text: "#2c3e50",
            },
            style: {
              typography: {
                fontWeight: "400",
                fontSize: "small",
              },
            },
          },
          {
            clientId: "separator-3",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: "|",
              align: "center",
              fontSize: "small",
              className: "contact-info-separator",
            },
            innerBlocks: [],
            color: {
              text: "#cbd5e1",
            },
          },
          {
            clientId: "website-column",
            name: "core/paragraph",
            isValid: true,
            attributes: {
              content: `<a href="https://${structured?.Contact?.PersonalWebsite || "your-website.com"}" target="_blank">${structured?.Contact?.PersonalWebsite || "your-website.com"}</a>`,
              align: "center",
              fontSize: "small",
            },
            innerBlocks: [],
            color: {
              text: "#2c3e50",
            },
            style: {
              typography: {
                fontWeight: "400",
                fontSize: "small",
              },
            },
          },
        ],
        spacing: {
          margin: {
            top: "0",
            bottom: "0.5em",
          },
        },
      },
      {
        clientId: "summary",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content: structured?.Summary?.Description || "Your Summary",
          align: "center",
        },
        innerBlocks: [],
        spacing: {
          margin: {
            top: "1em",
            bottom: "1em",
          },
        },
        color: {
          text: "#2c3e50",
        },
        style: {
          typography: {
            fontWeight: "400",
          },
        },
      },
    ],
  };
  console.log(structured);
  // The skills section
  const skillsSection = {
    clientId: "skills-section",
    name: "core/group",
    isValid: true,
    attributes: {},
    innerBlocks: [
      {
        clientId: "skills-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Skills",
          level: 2,
        },
        innerBlocks: [],
      },
      {
        clientId: "skills-list",
        name: "core/list",
        isValid: true,
        attributes: {},
        innerBlocks: [
          ...structured?.Skills?.TopSkills?.map((skill, index) => ({
            clientId: `skill-${index}`,
            name: "core/list-item",
            isValid: true,
            attributes: {
              content: skill, 
            },
            innerBlocks: [],
          })) || [],
        ],
      },
    ],
  };

  const experiences = structured?.Experiences || structured?.Experience || [];
  // The experiences section
  const experiencesSection = {
    clientId: "experiences-section",
    name: "core/group",
    isValid: true,
    attributes: {},
    innerBlocks: [
      {
        clientId: "experiences-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Experience",
          level: 2,
        },
        innerBlocks: [],
      },
      {
        clientId: "experiences-list",
        name: "core/group",
        isValid: true,
        attributes: {},
        innerBlocks: [
          {
            clientId: "experience-item",
            name: "core/group",
            isValid: true,
            attributes: {},
            innerBlocks: experiences.map((experience, index) => ({
              clientId: `experience-item-${index}`,
              name: "core/group",
              isValid: true,
              attributes: {},
              innerBlocks: [
                {
                  clientId: `experience-company-${index}`,
                  name: "core/group",
                  isValid: true,
                  attributes: {
                    orientation: "horizontal",
                    className: "job-listing__company-row flex-row",
                    display: "flex",
                    justifyContent: "space-between",
                    style: {
                      spacing: {
                        margin: {
                          bottom: "5px"

                        }
                      },
                      display: "flex",
                      justifyContent: "space-between",
                    }
                  },
                  innerBlocks: [
                    {
                      clientId: `experience-company-name-${index}`,
                      name: "core/paragraph",
                      isValid: true,
                      attributes: {
                        content: `<strong>${experience.Company}</strong>`,
                        className: "job-listing__company-name",
                        style: {
                          spacing: {
                            margin: {
                              top: "0",
                              bottom: "0"
                            }
                          }
                        }
                      },
                      innerBlocks: [],
                    },
                    {
                      clientId: `experience-company-location-${index}`,
                      name: "core/paragraph",
                      isValid: true,
                      attributes: {
                        content: experience.Location,
                        className: "job-listing__company-location",
                        style: {
                          spacing: {
                            margin: {
                              top: "0",
                              bottom: "0"
                            }
                          }
                        }
                      },
                      innerBlocks: [],
                    },
                  ],
                },
                {
                  clientId: `experience-row-${index}`,
                  name: "core/group",
                  isValid: true,
                  attributes: {
                    orientation: "horizontal",
                    className: "job-listing__company-row flex-row",
                    display: "flex",
                    justifyContent: "space-between",
                    style: {
                      spacing: {
                        margin: {
                          bottom: "5px"

                        }
                      },
                      display: "flex",
                      justifyContent: "space-between",
                    }
                  },
                  innerBlocks: [
                    {
                      clientId: `experience-position-${index}`,
                      name: "core/paragraph",
                      isValid: true,
                      attributes: {
                        content: `${experience.Position}`,
                        style: {
                          spacing: {
                            margin: {
                              top: "5px",
                              bottom: "5px"
                            }
                          },
                          typography: {
                            color: {
                              text: "#666"
                            }
                          }
                        }
                      },
                      innerBlocks: [],
                    },
                    {
                      clientId: `experience-duration-${index}`,
                      name: "core/paragraph",
                      isValid: true,
                      attributes: {
                        content: experience.Duration,
                        className: "job-listing__duration",
                        style: {
                          spacing: {
                            margin: {
                              top: "0",
                              bottom: "10px"
                            }
                          },
                          typography: {
                            fontStyle: "italic",
                            fontSize: "14px"
                          },
                          color: {
                            text: "#666"
                          }
                        }
                      },
                      innerBlocks: [],
                    },
                  ],
                },
                {
                  clientId: `experience-responsibilities-${index}`,
                  name: "core/list",
                  isValid: true,
                  attributes: {},
                  innerBlocks: Array.isArray(experience?.Responsibilities) 
                    ? experience.Responsibilities.map((responsibility, i) => ({
                        clientId: `experience-responsibility-${index}-${i}`,
                        name: "core/list-item",
                        isValid: true,
                        attributes: {
                          content: responsibility,
                        },
                        innerBlocks: [],
                      }))
                    : experience?.Responsibilities || [],
                },
              ],
            })) || [],
          },
        ],
      },
    ],
  };

  // The education section
  const educationSection = {
    clientId: "education-section",
    name: "core/group",
    isValid: true,
    attributes: {},
    innerBlocks: [
      {
        clientId: "education-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Education",
          level: 2,
        },
        innerBlocks: [],
      },
      {
        clientId: "education-list",
        name: "core/group",
        isValid: true,
        attributes: {},
        innerBlocks: [
          {
            clientId: "education-items",
            name: "core/group",
            isValid: true,
            attributes: {},
            innerBlocks: structured?.Education?.map((education, index) => ({
              clientId: `education-item-${index}`,
              name: "core/group",
              isValid: true,
              attributes: {},
              innerBlocks: [
                {
                  clientId: `education-institution-row-${index}`,
                  name: "core/group",
                  isValid: true,
                  attributes: {
                    orientation: "horizontal",
                    className: "job-listing__company-row flex-row",
                    display: "flex",
                    justifyContent: "space-between",
                    style: {
                      spacing: {
                        margin: {
                          bottom: "2px"
                        }
                      },
                      display: "flex",
                    }
                  },
                  innerBlocks: [
                    {
                      clientId: `education-institution-${index}`,
                      name: "core/paragraph",
                      isValid: true,
                      attributes: {
                        content: education?.Institution || "Your Institution",
                        className: "job-listing__company-name",
                        style: {
                          typography: {
                            fontWeight: "700"
                          },
                          color: {
                            text: "var(--primary-color)"
                          }
                        }
                      },
                      innerBlocks: [],
                    },
                    {
                      clientId: `education-duration-${index}`,
                      name: "core/paragraph",
                      isValid: true,
                      attributes: {
                        content: education?.Duration || "Your Duration",
                        className: "job-listing__duration",
                        style: {
                          spacing: {
                            margin: {
                              top: "0",
                              bottom: "5px"
                            }
                          },
                          typography: {
                            fontStyle: "italic",
                            fontSize: "14px"
                          },
                          color: {
                            text: "#666"
                          }
                        }
                      },
                      innerBlocks: [],
                    },
                  ],
                },
                {
                  clientId: `education-degree-${index}`,
                  name: "core/paragraph",
                  isValid: true,
                  attributes: {
                    content: education?.Degree || education?.Certification || "Your Degree",
                    className: "resume-template__degree",
                    style: {
                      typography: {
                        fontWeight: "500",
                        fontSize: "15px"
                      },
                      color: {
                        text: "#4a5568"
                      },
                      spacing: {
                        margin: {
                          top: "0",
                          bottom: "20px"
                        }
                      }
                    }
                  },
                  innerBlocks: [],
                },
              ],
            })) || [],
          },
        ],
      },
    ],
  };

  // Add all sections to the blocks array
  blocks.push(
    headerSection,
    skillsSection,
    experiencesSection,
    educationSection,
  );

  return blocks;
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
        setPdfText(response.structured);

        // Store the structured data for later use
        if (typeof window !== "undefined") {
          window.lastParsedResume = response.structured;
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
    const resumeData = createBlocksFromStructuredData(pdfText);
    console.log("Created blocks from client-side parsing:", resumeData);
    onImportComplete(resumeData);
  };

  return (
    <div className="import-resume__container">
      <h2 className="import-resume__title">Import Your Current CV or LinkedIn Profile</h2>

      <div className="import-resume__instructions">
        <h3>How to Export Your LinkedIn Profile</h3>
        <ol>
          <li>
            Go to your{" "}
            <a
              href="https://www.linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn profile
            </a>
          </li>
          <li>
            Click on "Resources" dropdown at the top-right of your profile
          </li>
          <li>Select "Save to PDF"</li>
          <li>Save the PDF file to your computer</li>
          <li>Upload the PDF file using the form below</li>
        </ol>
      </div>

      <div
        {...getRootProps()}
        className={`import-resume__dropzone ${
          isDragActive ? "import-resume__dropzone--active" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="import-resume__upload-icon">📄</div>
        <p className="import-resume__text">
          {isDragActive
            ? "Drop your PDF resume here..."
            : "Drag & drop your PDF resume here, or click to select file"}
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Supports PDF format only
        </p>
      </div>

      {selectedFile && (
        <div style={{ marginTop: "12px", fontSize: "14px" }}>
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
          className={`import-resume__status-container ${
            status.type === "loading"
              ? "import-resume__status-container--loading"
              : status.type === "error"
                ? "import-resume__status-container--error"
                : "import-resume__status-container--success"
          }`}
        >
          {status.type === "loading" && (
            <div className="import-resume__flex-container">
              <div className="import-resume__spinner"></div>
              <span>{status.message}</span>
            </div>
          )}
          {status.type !== "loading" && status.message}
        </div>
      )}

      {status.type === "success" && (
        <button className="import-resume__button" onClick={handleImport}>
          Import Resume
        </button>
      )}
    </div>
  );
};

export { createBlocksFromStructuredData };
export default ImportResume;
