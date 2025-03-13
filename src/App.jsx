import { useState, useEffect, useCallback } from "react";
import { BlockEditorProvider, BlockCanvas } from "@wordpress/block-editor";
import "./styles/wordpress-fixes.css";
import "./styles/block-editor-fix.css";
import "./styles/inline-style-fix.css";
import "./styles/wordpress-classes.css";
import "./styles/toolbar-fix.css";
import "./styles/iframe-styles.scss";
import "./styles/fonts.css";
import "./App.css";
import { contentStyles } from "./styles/contentStyles.js";
import Header from "./components/Header";
import ImportResume from "./components/ImportResume";

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
            top: "1em",
          },
        },
      },
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
              bottom: "0.5em",
            },
          },
          style: {
            typography: {
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "contact-info",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            '<a href="mailto:your.email@example.com">your.email@example.com</a> | (123) 456-7890 | City, State | <a href="https://linkedin.com/in/yourname" target="_blank">linkedin.com/in/yourname</a>',
          align: "center",
          fontSize: "small",
        },
        innerBlocks: [],
      },
    ],
  },
  {
    clientId: "separator-1",
    name: "core/separator",
    isValid: true,
    attributes: {
      opacity: "alpha-channel",
      tagName: "hr",
    },
    innerBlocks: [],
  },
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
          fontSize: "18px",
        },
        spacing: {
          margin: {
            top: "1.5em",
            bottom: "0.5em",
          },
        },
        color: {
          text: "#2c3e50",
        },
      },
    },
    innerBlocks: [],
  },
  {
    clientId: "summary-content",
    name: "core/paragraph",
    isValid: true,
    attributes: {
      content:
        "Results-driven professional with over [X] years of experience in [industry/field]. Proven track record of [key achievement] and [key skill]. Adept at [skill/responsibility] and [skill/responsibility], with a strong focus on [value proposition]. Seeking to leverage my expertise in [area of expertise] to drive success for [target company/role].",
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
          fontSize: "18px",
        },
        spacing: {
          margin: {
            top: "1.5em",
            bottom: "0.5em",
          },
        },
        color: {
          text: "#2c3e50",
        },
      },
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
            bottom: "1.5em",
          },
        },
      },
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
              fontSize: "16px",
            },
            spacing: {
              margin: {
                bottom: "0.2em",
              },
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "job1-company",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "<strong>Company Name</strong> | City, State | <em>Month Year - Present</em>",
          style: {
            spacing: {
              margin: {
                top: "0",
                bottom: "0.5em",
              },
            },
            typography: {
              fontSize: "14px",
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "job1-desc",
        name: "core/list",
        isValid: true,
        attributes: {
          values:
            "<li>Spearheaded [specific project/initiative] that resulted in [specific, quantifiable result].</li><li>Managed a team of [X] professionals, overseeing [specific responsibility] and driving [specific outcome].</li><li>Implemented [specific strategy/solution] that improved [specific metric] by [X]%.</li><li>Collaborated with cross-functional teams to [specific accomplishment] and [specific result].</li>",
        },
        innerBlocks: [],
      },
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
            bottom: "1.5em",
          },
        },
      },
    },
    innerBlocks: [
      {
        clientId: "job2-title",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Previous Job Title",
          level: 3,
          style: {
            typography: {
              fontWeight: "600",
              fontSize: "16px",
            },
            spacing: {
              margin: {
                bottom: "0.2em",
              },
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "job2-company",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "<strong>Previous Company</strong> | City, State | <em>Month Year - Month Year</em>",
          style: {
            spacing: {
              margin: {
                top: "0",
                bottom: "0.5em",
              },
            },
            typography: {
              fontSize: "14px",
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "job2-desc",
        name: "core/list",
        isValid: true,
        attributes: {
          values:
            "<li>Led [specific initiative] that [specific achievement].</li><li>Developed and implemented [specific strategy] resulting in [specific outcome].</li><li>Consistently exceeded [specific goals/metrics] by [percentage/amount].</li>",
        },
        innerBlocks: [],
      },
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
          fontSize: "18px",
        },
        spacing: {
          margin: {
            top: "1.5em",
            bottom: "0.5em",
          },
        },
        color: {
          text: "#2c3e50",
        },
      },
    },
    innerBlocks: [],
  },

  // Degree
  {
    clientId: "education-group",
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "div",
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
              fontSize: "16px",
            },
            spacing: {
              margin: {
                bottom: "0.2em",
              },
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "institution",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "<strong>Institution Name</strong> | City, State | <em>Graduation Year</em>",
          style: {
            spacing: {
              margin: {
                top: "0",
                bottom: "0.5em",
              },
            },
            typography: {
              fontSize: "14px",
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "education-desc",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "Relevant coursework: [Course 1], [Course 2], [Course 3]<br>GPA: [X.XX/4.0]<br>Honors/Awards: [Honor/Award], [Honor/Award]",
          fontSize: "small",
        },
        innerBlocks: [],
      },
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
          fontSize: "18px",
        },
        spacing: {
          margin: {
            top: "1.5em",
            bottom: "0.5em",
          },
        },
        color: {
          text: "#2c3e50",
        },
      },
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
            bottom: "1.5em",
          },
        },
      },
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
              fontSize: "16px",
            },
            spacing: {
              margin: {
                bottom: "0.2em",
              },
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "tech-skills-list",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "[Skill 1] • [Skill 2] • [Skill 3] • [Skill 4] • [Skill 5] • [Skill 6]",
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
              fontSize: "16px",
            },
            spacing: {
              margin: {
                top: "1em",
                bottom: "0.2em",
              },
            },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "soft-skills-list",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "[Soft Skill 1] • [Soft Skill 2] • [Soft Skill 3] • [Soft Skill 4]",
        },
        innerBlocks: [],
      },
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
          fontSize: "18px",
        },
        spacing: {
          margin: {
            top: "1.5em",
            bottom: "0.5em",
          },
        },
        color: {
          text: "#2c3e50",
        },
      },
    },
    innerBlocks: [],
  },
  {
    clientId: "certifications-list",
    name: "core/list",
    isValid: true,
    attributes: {
      values:
        "<li><strong>[Certification Name]</strong> - [Issuing Organization] ([Year])</li><li><strong>[Certification Name]</strong> - [Issuing Organization] ([Year])</li>",
    },
    innerBlocks: [],
  },
];

// A4 paper dimensions are 210mm × 297mm (8.27in × 11.69in)
// At 96 DPI, that's approximately 794px × 1123px

// Full screen app styles
const appStyles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: "100vh",
    padding: 0,
    margin: 0,
    overflow: "hidden",
  },
  editorContainer: {
    width: "100%",
    height: "calc(100% - 60px)",
    position: "relative",
    marginTop: "60px",
    overflow: "hidden",
  },
  importButton: {
    position: "fixed",
    top: "70px",
    right: "20px",
    backgroundColor: "var(--secondary-color)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    zIndex: 999,
    fontFamily: "var(--font-family-heading)",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "auto",
    padding: "20px",
  },
};

export default function Editor() {
  // Initial state
  const [blocks, setBlocks] = useState(resumeTemplate);
  const [isPrinting, setIsPrinting] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // History state management
  const [history, setHistory] = useState([resumeTemplate]); // Stack of previous states
  const [historyIndex, setHistoryIndex] = useState(0); // Current position in history
  const [hasUndo, setHasUndo] = useState(false); // Whether undo is available
  const [hasRedo, setHasRedo] = useState(false); // Whether redo is available

  // Update blocks without tracking history (for undo/redo operations)
  const updateBlocksNoHistory = useCallback((newBlocks) => {
    setBlocks(newBlocks);
  }, []);

  // Add current state to history when blocks change
  const updateHistoryOnBlocksChange = (newBlocks) => {
    // Skip if this is just an undo/redo navigation (blocks will match history)
    if (JSON.stringify(newBlocks) === JSON.stringify(history[historyIndex])) {
      return;
    }

    // Add the new state to history, removing any future states if we've gone back in time
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);

    // Limit history size (optional, to prevent excessive memory usage)
    if (newHistory.length > 100) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Update undo/redo availability
    setHasUndo(newHistory.length > 1);
    setHasRedo(false); // We've just added a new state, so there's nothing to redo
  };

  // Handler for changes from the BlockEditorProvider
  const handleBlocksChange = (newBlocks) => {
    setBlocks(newBlocks);
    updateHistoryOnBlocksChange(newBlocks);
  };

  // Handle imported resume data
  const handleImportComplete = (importedBlocks) => {
    setBlocks(importedBlocks);
    updateHistoryOnBlocksChange(importedBlocks);
    setShowImport(false);
  };

  // Function to handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      updateBlocksNoHistory(history[newIndex]);

      // Update undo/redo availability
      setHasUndo(newIndex > 0);
      setHasRedo(true);
    }
  }, [
    historyIndex,
    history,
    updateBlocksNoHistory,
    setHistoryIndex,
    setHasUndo,
    setHasRedo,
  ]);

  // Function to handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      updateBlocksNoHistory(history[newIndex]);

      // Update undo/redo availability
      setHasUndo(true);
      setHasRedo(newIndex < history.length - 1);
    }
  }, [
    historyIndex,
    history,
    updateBlocksNoHistory,
    setHistoryIndex,
    setHasUndo,
    setHasRedo,
  ]);

  // Add styles to html and body to remove any gaps
  useEffect(() => {
    // Add styles to remove gaps in html and body
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
  }, []);

  // Set up keyboard shortcuts for undo/redo
  useEffect(() => {
    // Handler for keyboard shortcuts
    const handleKeyDown = (event) => {
      // Check if we're in an input field or if a modifier other than cmd/ctrl/shift is pressed
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.altKey
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (isCtrlOrCmd && event.key === "z" && !event.shiftKey && hasUndo) {
        event.preventDefault();
        handleUndo();
      }

      // Redo: Cmd/Ctrl + Shift + Z or Ctrl + Y
      if (
        (isCtrlOrCmd && event.key === "z" && event.shiftKey) ||
        (!isMac && event.ctrlKey && event.key === "y")
      ) {
        if (hasRedo) {
          event.preventDefault();
          handleRedo();
        }
      }
    };

    // Add event listener to main document
    window.addEventListener("keydown", handleKeyDown);

    // Function to setup iframe keyboard listeners
    const setupIframeKeyboardListeners = () => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentDocument) {
        // Add event listener to iframe document
        editorIframe.contentDocument.addEventListener("keydown", handleKeyDown);
      }
    };

    // Try to set up iframe listeners
    const intervalId = setInterval(() => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentDocument) {
        setupIframeKeyboardListeners();
        clearInterval(intervalId);
      }
    }, 500);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);

      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentDocument) {
        editorIframe.contentDocument.removeEventListener(
          "keydown",
          handleKeyDown
        );
      }
    };
  }, [hasUndo, hasRedo, handleUndo, handleRedo]); // Re-run when these dependencies change

  // Check for content overflow
  useEffect(() => {
    const checkContentOverflow = () => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (!editorIframe) return;

      const iframeDocument =
        editorIframe.contentDocument || editorIframe.contentWindow.document;
      const editorWrapper = iframeDocument.querySelector(
        ".editor-styles-wrapper"
      );
      const contentContainer = iframeDocument.querySelector(
        ".block-editor-block-list__layout"
      );

      if (!editorWrapper || !contentContainer) return;

      // Check if content height exceeds the paper height
      const isOverflowing =
        contentContainer.scrollHeight > editorWrapper.clientHeight - 60; // 60px buffer

      if (isOverflowing !== contentOverflow) {
        setContentOverflow(isOverflowing);
      }
    };

    // Check initially and on window resize
    const timeoutId = setTimeout(checkContentOverflow, 1000); // Initial delay to ensure iframe is loaded
    window.addEventListener("resize", checkContentOverflow);

    // Set up an interval to periodically check (content can change due to editing)
    const intervalId = setInterval(checkContentOverflow, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener("resize", checkContentOverflow);
    };
  }, [contentOverflow]);

  // Handle print functionality
  const handlePrint = () => {
    try {
      setIsPrinting(true);

      // Get iframe document
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (!editorIframe) {
        console.error("Editor iframe not found");
        setIsPrinting(false);
        return;
      }

      // Access the iframe document and window
      const iframeWindow = editorIframe.contentWindow;

      // Add print-specific stylesheet
      const styleElement = iframeWindow.document.createElement("style");
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
      console.error("Print error:", error);
      setIsPrinting(false);
    }
  };

  return (
    <div style={appStyles.container}>
      {/* Header */}
      <Header 
        hasUndo={hasUndo}
        hasRedo={hasRedo}
        isPrinting={isPrinting}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handlePrint={handlePrint}
      />

      {/* Import Resume Button */}
      <button 
        style={appStyles.importButton}
        onClick={() => setShowImport(true)}
      >
        Import Resume
      </button>

      {/* Editor Container */}
      <div style={appStyles.editorContainer}>
        <BlockEditorProvider
          value={blocks}
          onChange={handleBlocksChange}
          onInput={handleBlocksChange}
        >
          <BlockCanvas height="100%" width="100%" styles={contentStyles} />
        </BlockEditorProvider>
      </div>

      {/* Import Resume Modal */}
      {showImport && (
        <div 
          style={appStyles.overlay}
          onClick={(e) => {
            // Close when clicking outside the import component
            if (e.target === e.currentTarget) {
              setShowImport(false);
            }
          }}
        >
          <ImportResume onImportComplete={handleImportComplete} />
        </div>
      )}
    </div>
  );
}
