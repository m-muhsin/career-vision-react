import { useState, useEffect, useRef } from "react";
import { BlockEditorProvider, BlockCanvas } from "@wordpress/block-editor";
import html2pdf from 'html2pdf.js';
// import { createBlock } from "@wordpress/blocks";

// Base styles for the content within the block canvas iframe.
import componentsStyles from "@wordpress/components/build-style/style.css?raw";
import blockEditorContentStyles from "@wordpress/block-editor/build-style/content.css?raw";
import blocksStyles from "@wordpress/block-library/build-style/style.css?raw";
import blocksEditorStyles from "@wordpress/block-library/build-style/editor.css?raw";

// Simplified template using fewer blocks and simpler structure
const resumeTemplate = [
  // Header section
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
            bottom: "2em"
          }
        },
        border: {
          bottom: {
            color: "#cccccc",
            width: "1px",
            style: "solid"
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
          content: "Your Full Name", 
          level: 1, 
          textAlign: "center",
          fontSize: "large",
          spacing: {
            margin: {
              top: "0",
              bottom: "0.5em"
            }
          },
          style: {
            typography: {
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }
          }
        },
        innerBlocks: [],
      },
      {
        clientId: "contact-info",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "Email: your.email@example.com | Phone: (123) 456-7890 | Location: City, State | LinkedIn: linkedin.com/in/yourname",
          align: "center",
          fontSize: "small"
        },
        innerBlocks: [],
      }
    ],
  },
  
  // Professional Summary
  {
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
    innerBlocks: [],
  },
  {
    clientId: "summary-content",
    name: "core/paragraph",
    isValid: true,
    attributes: { 
      content: "Results-driven professional with over [X] years of experience in [industry/field]. Proven track record of [key achievement] and [key skill]. Adept at [skill/responsibility] and [skill/responsibility], with a strong focus on [value proposition]. Seeking to leverage my expertise in [area of expertise] to drive success for [target company/role]."
    },
    innerBlocks: [],
  },
  
  // Work Experience
  {
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
    innerBlocks: [],
  },
  
  // Job 1
  {
    clientId: "job1-group",
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
      {
        clientId: "job1-title",
        name: "core/heading",
        isValid: true,
        attributes: { 
          content: "Job Title", 
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
        innerBlocks: [],
      },
      {
        clientId: "job1-company",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "<strong>Company Name</strong> | City, State | <em>Month Year - Present</em>",
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
        innerBlocks: [],
      },
      {
        clientId: "job1-desc",
        name: "core/list",
        isValid: true,
        attributes: {
          values: "<li>Spearheaded [specific project/initiative] that resulted in [specific, quantifiable result].</li><li>Managed a team of [X] professionals, overseeing [specific responsibility] and driving [specific outcome].</li><li>Implemented [specific strategy/solution] that improved [specific metric] by [X]%.</li><li>Collaborated with cross-functional teams to [specific accomplishment] and [specific result].</li>"
        },
        innerBlocks: [],
      }
    ],
  },
  
  // Job 2
  {
    clientId: "job2-group",
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
      {
        clientId: "job2-title",
        name: "core/heading",
        isValid: true,
        attributes: { 
          content: "Previous Job Title", 
          level: 3,
          textAlign: "center",
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
        innerBlocks: [],
      },
      {
        clientId: "job2-company",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "<strong>Previous Company</strong> | City, State | <em>Month Year - Month Year</em>",
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
        innerBlocks: [],
      },
      {
        clientId: "job2-desc",
        name: "core/list",
        isValid: true,
        attributes: {
          values: "<li>Led [specific initiative] that [specific achievement].</li><li>Developed and implemented [specific strategy] resulting in [specific outcome].</li><li>Consistently exceeded [specific goals/metrics] by [percentage/amount].</li>"
        },
        innerBlocks: [],
      }
    ],
  },
  
  // Education
  {
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
    innerBlocks: [],
  },
  
  // Degree
  {
    clientId: "education-group",
    name: "core/group",
    isValid: true,
    attributes: { 
      tagName: "div"
    },
    innerBlocks: [
      {
        clientId: "degree-title",
        name: "core/heading",
        isValid: true,
        attributes: { 
          content: "Degree Name", 
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
        innerBlocks: [],
      },
      {
        clientId: "institution",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "<strong>Institution Name</strong> | City, State | <em>Graduation Year</em>",
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
        innerBlocks: [],
      },
      {
        clientId: "education-desc",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "Relevant coursework: [Course 1], [Course 2], [Course 3]<br>GPA: [X.XX/4.0]<br>Honors/Awards: [Honor/Award], [Honor/Award]",
          fontSize: "small"
        },
        innerBlocks: [],
      }
    ],
  },
  
  // Skills
  {
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
    innerBlocks: [],
  },
  {
    clientId: "skills-group",
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
      {
        clientId: "tech-skills",
        name: "core/heading",
        isValid: true,
        attributes: { 
          content: "Technical Skills", 
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
        innerBlocks: [],
      },
      {
        clientId: "tech-skills-list",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "[Skill 1] • [Skill 2] • [Skill 3] • [Skill 4] • [Skill 5] • [Skill 6]"
        },
        innerBlocks: [],
      },
      {
        clientId: "soft-skills",
        name: "core/heading",
        isValid: true,
        attributes: { 
          content: "Soft Skills", 
          level: 3,
          style: {
            typography: {
              fontWeight: "600",
              fontSize: "16px"
            },
            spacing: {
              margin: {
                top: "1em",
                bottom: "0.2em"
              }
            }
          }
        },
        innerBlocks: [],
      },
      {
        clientId: "soft-skills-list",
        name: "core/paragraph",
        isValid: true,
        attributes: { 
          content: "[Soft Skill 1] • [Soft Skill 2] • [Soft Skill 3] • [Soft Skill 4]"
        },
        innerBlocks: [],
      }
    ],
  },
  
  // Certifications (Optional)
  {
    clientId: "certifications-heading",
    name: "core/heading",
    isValid: true,
    attributes: { 
      content: "Certifications", 
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
    innerBlocks: [],
  },
  {
    clientId: "certifications-list",
    name: "core/list",
    isValid: true,
    attributes: {
      values: "<li><strong>[Certification Name]</strong> - [Issuing Organization] ([Year])</li><li><strong>[Certification Name]</strong> - [Issuing Organization] ([Year])</li>"
    },
    innerBlocks: [],
  }
];

// A4 paper dimensions are 210mm × 297mm (8.27in × 11.69in)
// At 96 DPI, that's approximately 794px × 1123px
const contentStyles = [
  { css: componentsStyles },
  { css: blockEditorContentStyles },
  { css: blocksStyles },
  { css: blocksEditorStyles },
  // Add A4 paper styling and system font stack
  {
    css: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        font-size: 16px;
        line-height: 1.5;
        background-color: #f0f0f0;
      }
      
      /* A4 paper styling */
      .wp-block-post-content,
      .editor-styles-wrapper {
        background-color: white;
        width: 794px !important;
        min-height: 1123px !important;
        margin: 20px auto;
        padding: 15px;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid #e0e0e0;
      }
      
      /* Block editor container */
      .block-editor-block-list__layout {
        max-width: calc(794px - (2 * 15px)) !important; /* Derive max-width from A4 width minus padding */
      }

      p {
        margin-bottom: 1em;
      }
      
      /* Hide UI elements during PDF export */
      .pdf-export-mode .block-editor-writing-flow__click-redirect,
      .pdf-export-mode .block-editor-block-list__insertion-point,
      .pdf-export-mode .block-editor-block-list__block-selection-button,
      .pdf-export-mode .block-editor-block-list__breadcrumb,
      .pdf-export-mode .block-editor-block-toolbar,
      .pdf-export-mode .block-editor-block-contextual-toolbar {
        display: none !important;
      }
    `,
  },
];

// Full screen app styles
const appStyles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: '100vh',
    padding: 0,
    margin: 0,
    overflow: 'auto'
  },
  editorContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  buttonContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000
  },
  saveButton: {
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s, transform 0.2s',
    outline: 'none',
  }
};

export default function Editor() {
  // Initialize with resume template
  const [blocks, setBlocks] = useState(resumeTemplate);
  const [isExporting, setIsExporting] = useState(false);
  const editorIframeRef = useRef(null);

  // Add styles to html and body to remove any gaps
  useEffect(() => {
    // Add styles to remove gaps in html and body
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
  }, []);
  
  // Handle saving to PDF
  const handleSaveToPDF = () => {
    try {
      setIsExporting(true);
      
      // Get iframe document
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (!editorIframe) {
        console.error('Editor iframe not found');
        setIsExporting(false);
        return;
      }
      
      // Access the iframe document
      const iframeDocument = editorIframe.contentDocument || editorIframe.contentWindow.document;
      
      // Get editor content
      const contentElement = iframeDocument.querySelector('.editor-styles-wrapper');
      if (!contentElement) {
        console.error('Editor content element not found');
        setIsExporting(false);
        return;
      }
      
      // Clone content to avoid modifying the original
      const contentClone = contentElement.cloneNode(true);
      
      // Remove any editor UI elements from the clone
      const uiElements = contentClone.querySelectorAll(
        '.block-editor-block-list__insertion-point, ' +
        '.block-editor-writing-flow__click-redirect, ' +
        '.block-editor-block-list__block-selection-button, ' +
        '.block-editor-block-list__breadcrumb, ' +
        '.block-editor-block-toolbar, ' +
        '.block-editor-block-contextual-toolbar'
      );
      
      uiElements.forEach(el => el.remove());
      
      // PDF export options
      const opt = {
        margin: [0, 0],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };
      
      // Generate and download PDF
      html2pdf().from(contentClone).set(opt).save().then(() => {
        setIsExporting(false);
      }).catch(err => {
        console.error('PDF generation error:', err);
        setIsExporting(false);
      });
    } catch (error) {
      console.error('PDF export error:', error);
      setIsExporting(false);
    }
  };

  return (
    <div style={appStyles.container}>
      <div style={appStyles.editorContainer}>
        {/* Save to PDF Button */}
        <div style={appStyles.buttonContainer}>
          <button 
            style={appStyles.saveButton}
            onClick={handleSaveToPDF}
            disabled={isExporting}
          >
            {isExporting ? 'Generating PDF...' : 'Save to PDF'}
          </button>
        </div>
        
        <BlockEditorProvider
          value={blocks}
          onChange={setBlocks}
          onInput={setBlocks}
        >
          <BlockCanvas 
            height="100vh" 
            width="100%"
            styles={contentStyles}
            ref={editorIframeRef}
          />
        </BlockEditorProvider>
      </div>
    </div>
  );
}
