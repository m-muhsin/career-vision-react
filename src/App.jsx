import { useState, useEffect, useRef } from "react";
import { BlockEditorProvider, BlockCanvas } from "@wordpress/block-editor";

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
    overflow: 'hidden'
  },
  editorContainer: {
    width: '100%',
    height: 'calc(100% - 60px)',
    position: 'relative',
    marginTop: '60px',
    overflow: 'hidden'
  },
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 1000,
    transition: 'box-shadow 0.3s ease'
  },
  navbarScrolled: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  navbarLogo: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#2c3e50'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
  },
  saveButtonHover: {
    backgroundColor: '#34495e', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transform: 'translateY(-2px)'
  },
  saveButtonActive: {
    backgroundColor: '#1a252f',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    transform: 'translateY(1px)'
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
    fill: 'currentColor',
    transition: 'transform 0.2s ease'
  },
  buttonIconHover: {
    transform: 'translateY(2px)'
  },
  warningText: {
    color: '#d32f2f',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid rgba(211, 47, 47, 0.3)'
  }
};

export default function Editor() {
  // Initialize with resume template
  const [blocks, setBlocks] = useState(resumeTemplate);
  const [isPrinting, setIsPrinting] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const editorIframeRef = useRef(null);
  const [buttonHover, setButtonHover] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    // Add scroll event listener to detect when the page is scrolled
    const handleScroll = () => {
      // Get scroll position from the iframe instead of window
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentWindow) {
        const scrollY = editorIframe.contentWindow.scrollY;
        if (scrollY > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };

    // Add event listener to the iframe once it's loaded
    const setupIframeScroll = () => {
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentWindow) {
        editorIframe.contentWindow.addEventListener('scroll', handleScroll);
      }
    };

    // Check for iframe and add listener
    const intervalId = setInterval(() => {
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentWindow) {
        setupIframeScroll();
        clearInterval(intervalId);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentWindow) {
        editorIframe.contentWindow.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Check for content overflow
  useEffect(() => {
    const checkContentOverflow = () => {
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (!editorIframe) return;
      
      const iframeDocument = editorIframe.contentDocument || editorIframe.contentWindow.document;
      const editorWrapper = iframeDocument.querySelector('.editor-styles-wrapper');
      const contentContainer = iframeDocument.querySelector('.block-editor-block-list__layout');
      
      if (!editorWrapper || !contentContainer) return;
      
      // Check if content height exceeds the paper height
      const isOverflowing = contentContainer.scrollHeight > (editorWrapper.clientHeight - 60); // 60px buffer
      
      if (isOverflowing !== contentOverflow) {
        setContentOverflow(isOverflowing);
      }
      
      // Removed page break guide creation
    };
    
    // Check initially and on window resize
    const timeoutId = setTimeout(checkContentOverflow, 1000); // Initial delay to ensure iframe is loaded
    window.addEventListener('resize', checkContentOverflow);
    
    // Set up an interval to periodically check (content can change due to editing)
    const intervalId = setInterval(checkContentOverflow, 2000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('resize', checkContentOverflow);
    };
  }, [contentOverflow]);
  
  // Handle print functionality
  const handlePrint = () => {
    try {
      setIsPrinting(true);
      
      // Get iframe document
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (!editorIframe) {
        console.error('Editor iframe not found');
        setIsPrinting(false);
        return;
      }
      
      // Access the iframe document and window
      const iframeWindow = editorIframe.contentWindow;
      
      // Add print-specific stylesheet
      const styleElement = iframeWindow.document.createElement('style');
      styleElement.textContent = `
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .editor-styles-wrapper {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20px !important;
            width: 100% !important;
            min-height: auto !important;
            max-height: none !important;
          }
          
          .block-editor-block-list__insertion-point,
          .block-editor-writing-flow__click-redirect,
          .block-editor-block-list__block-selection-button,
          .block-editor-block-list__breadcrumb,
          .block-editor-block-toolbar,
          .block-editor-block-contextual-toolbar {
            display: none !important;
          }
        }
      `;
      iframeWindow.document.head.appendChild(styleElement);
      
      // Open print dialog
      iframeWindow.print();
      
      // Clean up
      setTimeout(() => {
        iframeWindow.document.head.removeChild(styleElement);
        setIsPrinting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Print error:', error);
      setIsPrinting(false);
    }
  };

  return (
    <div style={appStyles.container}>
      {/* Navigation Bar */}
      <div style={{
        ...appStyles.navbar,
        ...(scrolled ? appStyles.navbarScrolled : {})
      }}>
        <div style={appStyles.navbarLogo}>
          Resume Builder
        </div>
        
        <div style={appStyles.buttonContainer}>
          {contentOverflow && (
            <div style={appStyles.warningText}>
              ⚠️ Content exceeds one page
            </div>
          )}
          <button 
            style={{
              ...appStyles.saveButton,
              ...(buttonHover ? appStyles.saveButtonHover : {}),
              ...(buttonActive ? appStyles.saveButtonActive : {})
            }}
            onClick={handlePrint}
            disabled={isPrinting}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => {
              setButtonHover(false);
              setButtonActive(false);
            }}
            onMouseDown={() => setButtonActive(true)}
            onMouseUp={() => setButtonActive(false)}
          >
            <svg 
              style={{
                ...appStyles.buttonIcon,
                ...(buttonHover ? appStyles.buttonIconHover : {})
              }}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            {isPrinting ? 'Opening...' : 'Download'}
          </button>
        </div>
      </div>

      <div style={appStyles.editorContainer}>
        <BlockEditorProvider
          value={blocks}
          onChange={setBlocks}
          onInput={setBlocks}
        >
          <BlockCanvas 
            height="100%" 
            width="100%"
            styles={contentStyles}
            ref={editorIframeRef}
          />
        </BlockEditorProvider>
      </div>
    </div>
  );
}
