import { useState, useEffect, useCallback } from "react";
import { BlockEditorProvider, BlockCanvas } from "@wordpress/block-editor";
import "./styles/wordpress-fixes.css";
import "./styles/block-editor-fix.css";
import "./styles/inline-style-fix.css";
import "./styles/wordpress-classes.css";
import "./styles/toolbar-fix.css";
import "./styles/iframe-styles.scss";
import { contentStyles } from "./styles/contentStyles.js";

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
            bottom: "1em",
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
          textAlign: "center",
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
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: 1000,
    transition: "box-shadow 0.3s ease",
  },
  navbarScrolled: {
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  navbarLogo: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#2c3e50",
  },
  navbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  iconButton: {
    backgroundColor: "transparent",
    color: "#2c3e50",
    border: "none",
    borderRadius: "4px",
    padding: "8px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    outline: "none",
  },
  iconButtonHover: {
    backgroundColor: "#f5f5f5",
    transform: "translateY(-2px)",
  },
  iconButtonActive: {
    backgroundColor: "#e5e5e5",
    transform: "translateY(1px)",
  },
  iconButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  saveButton: {
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "all 0.2s ease-in-out",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  },
  saveButtonHover: {
    backgroundColor: "#34495e",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    transform: "translateY(-2px)",
  },
  saveButtonActive: {
    backgroundColor: "#1a252f",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
    transform: "translateY(1px)",
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
    fill: "currentColor",
    transition: "transform 0.2s ease",
  },
  buttonIconHover: {
    transform: "translateY(2px)",
  },
  warningText: {
    color: "#d32f2f",
    fontSize: "14px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    padding: "6px 12px",
    borderRadius: "4px",
    border: "1px solid rgba(211, 47, 47, 0.3)",
  },
};

export default function Editor() {
  // Initial state
  const [blocks, setBlocks] = useState(resumeTemplate);
  const [isPrinting, setIsPrinting] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [undoHover, setUndoHover] = useState(false);
  const [undoActive, setUndoActive] = useState(false);
  const [redoHover, setRedoHover] = useState(false);
  const [redoActive, setRedoActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    // Add scroll event listener to detect when the page is scrolled
    const handleScroll = () => {
      // Get scroll position from the iframe instead of window
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
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
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentWindow) {
        editorIframe.contentWindow.addEventListener("scroll", handleScroll);
      }
    };

    // Check for iframe and add listener
    const intervalId = setInterval(() => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentWindow) {
        setupIframeScroll();
        clearInterval(intervalId);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentWindow) {
        editorIframe.contentWindow.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
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
      {/* Navigation Bar */}
      <div
        style={{
          ...appStyles.navbar,
          ...(scrolled ? appStyles.navbarScrolled : {}),
        }}
      >
        <div style={appStyles.navbarLogo}>Career Vision</div>

        <div style={appStyles.navbarActions}>
          {/* Undo Button */}
          <button
            style={{
              ...appStyles.iconButton,
              ...(undoHover ? appStyles.iconButtonHover : {}),
              ...(undoActive ? appStyles.iconButtonActive : {}),
              ...(!hasUndo ? appStyles.iconButtonDisabled : {}),
            }}
            onClick={handleUndo}
            disabled={!hasUndo}
            onMouseEnter={() => setUndoHover(true)}
            onMouseLeave={() => {
              setUndoHover(false);
              setUndoActive(false);
            }}
            onMouseDown={() => setUndoActive(true)}
            onMouseUp={() => setUndoActive(false)}
            title="Undo"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 8C9.85 8 7.45 8.99 5.6 10.6L2 7V16H11L7.38 12.38C8.77 11.22 10.54 10.5 12.5 10.5C16.04 10.5 19.05 12.81 20.1 16L22.47 15.22C21.08 11.03 17.15 8 12.5 8Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Redo Button */}
          <button
            style={{
              ...appStyles.iconButton,
              ...(redoHover ? appStyles.iconButtonHover : {}),
              ...(redoActive ? appStyles.iconButtonActive : {}),
              ...(!hasRedo ? appStyles.iconButtonDisabled : {}),
            }}
            onClick={handleRedo}
            disabled={!hasRedo}
            onMouseEnter={() => setRedoHover(true)}
            onMouseLeave={() => {
              setRedoHover(false);
              setRedoActive(false);
            }}
            onMouseDown={() => setRedoActive(true)}
            onMouseUp={() => setRedoActive(false)}
            title="Redo"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8C6.85 8 2.92 11.03 1.54 15.22L3.9 16C4.95 12.81 7.95 10.5 11.5 10.5C13.45 10.5 15.23 11.22 16.62 12.38L13 16H22V7L18.4 10.6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div style={appStyles.buttonContainer}>
          {/* Removing content overflow warning
          {contentOverflow && (
            <div style={appStyles.warningText}>⚠️ Content exceeds one page</div>
          )}
          */}
          <button
            style={{
              ...appStyles.saveButton,
              ...(buttonHover ? appStyles.saveButtonHover : {}),
              ...(buttonActive ? appStyles.saveButtonActive : {}),
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
                ...(buttonHover ? appStyles.buttonIconHover : {}),
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            {isPrinting ? "Opening..." : "Download"}
          </button>
        </div>
      </div>

      <div style={appStyles.editorContainer}>
        <BlockEditorProvider
          value={blocks}
          onChange={handleBlocksChange}
          onInput={handleBlocksChange}
        >
          <BlockCanvas height="100%" width="100%" styles={contentStyles} />
        </BlockEditorProvider>
      </div>
    </div>
  );
}
