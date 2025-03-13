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
import ResumeBuilder from "./components/ResumeBuilder";

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
        spacing: { padding: { top: "1em" } },
      },
    },
    innerBlocks: [
      {
        clientId: "name-heading",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Muhammad Muhsin",
          level: 1,
          textAlign: "center",
          fontSize: "large",
          spacing: { margin: { top: "0", bottom: "0.5em" } },
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
            '<a href="mailto:muhammad.muhseen@gmail.com">muhammad.muhseen@gmail.com</a> | Colombo, Sri Lanka | <a href="https://www.linkedin.com/in/mmuhsin" target="_blank">linkedin.com/in/mmuhsin</a> | <a href="https://muhammad.dev" target="_blank">muhammad.dev</a>',
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
    attributes: { opacity: "alpha-channel", tagName: "hr" },
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
        spacing: { margin: { top: "1.5em", bottom: "0.5em" } },
        color: { text: "#2c3e50" },
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
        "Software engineer and business owner specializing in React, WordPress, and Gutenberg. Experienced in building Block Themes and modern WordPress experiences, including work on WordPress VIP platforms. Passionate about open-source technology, writing, and public speaking.",
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
        spacing: { margin: { top: "1.5em", bottom: "0.5em" } },
        color: { text: "#2c3e50" },
      },
    },
    innerBlocks: [],
  },

  // Most Recent Job
  {
    clientId: "job1-group",
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "div",
      style: { spacing: { margin: { bottom: "1.5em" } } },
    },
    innerBlocks: [
      {
        clientId: "job1-title",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Product Developer",
          level: 3,
          style: {
            typography: { fontWeight: "600", fontSize: "16px" },
            spacing: { margin: { bottom: "0.2em" } },
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
            "<strong>Awesome Motive, Inc.</strong> | Florida, United States | <em>Sep 2022 - Dec 2024</em>",
          style: {
            spacing: { margin: { top: "0", bottom: "0.5em" } },
            typography: { fontSize: "14px" },
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
            "<li>Rebuilt OptinMonster.com using Block Themes and custom blocks.</li><li>Developed features and fixed bugs using React, Vue, and PHP.</li>",
        },
        innerBlocks: [],
      },
    ],
  },

  // Previous Job
  {
    clientId: "job2-group",
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "div",
      style: { spacing: { margin: { bottom: "1.5em" } } },
    },
    innerBlocks: [
      {
        clientId: "job2-title",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Senior Engineer",
          level: 3,
          style: {
            typography: { fontWeight: "600", fontSize: "16px" },
            spacing: { margin: { bottom: "0.2em" } },
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
            "<strong>XWP</strong> | Melbourne, Australia | <em>Jan 2022 - Aug 2022</em>",
          style: {
            spacing: { margin: { top: "0", bottom: "0.5em" } },
            typography: { fontSize: "14px" },
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
            "<li>Developed frontend components using Gutenberg.</li><li>Built React extensions for Twitch and Amazon partnerships.</li>",
        },
        innerBlocks: [],
      },
    ],
  },
  {
    clientId: "job3-group",
    name: "core/group",
    isValid: true,
    attributes: {
      tagName: "div",
      style: { spacing: { margin: { bottom: "1.5em" } } },
    },
    innerBlocks: [
      {
        clientId: "job3-title",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Senior Engineer",
          level: 3,
          style: {
            typography: { fontWeight: "600", fontSize: "16px" },
            spacing: { margin: { bottom: "0.2em" } },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "job3-company",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "<strong>XWP</strong> | Melbourne, Australia | <em>Jan 2022 - Aug 2022</em>",
          style: {
            spacing: { margin: { top: "0", bottom: "0.5em" } },
            typography: { fontSize: "14px" },
          },
        },
        innerBlocks: [],
      },
      {
        clientId: "job3-desc",
        name: "core/list",
        isValid: true,
        attributes: {
          values:
            "<li>Developed frontend components using Gutenberg.</li><li>Built React extensions for Twitch and Amazon partnerships.</li>",
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
        spacing: { margin: { top: "1.5em", bottom: "0.5em" } },
        color: { text: "#2c3e50" },
      },
    },
    innerBlocks: [],
  },
  {
    clientId: "education-group",
    name: "core/group",
    isValid: true,
    attributes: { tagName: "div" },
    innerBlocks: [
      {
        clientId: "degree-title",
        name: "core/heading",
        isValid: true,
        attributes: {
          content: "Bachelor's Degree, Software Engineering",
          level: 3,
          style: { typography: { fontWeight: "600", fontSize: "16px" } },
        },
        innerBlocks: [],
      },
      {
        clientId: "institution",
        name: "core/paragraph",
        isValid: true,
        attributes: {
          content:
            "<strong>University of Plymouth</strong> | <em>2013 - 2016</em>",
          typography: { fontSize: "14px" },
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
        typography: { fontWeight: "600", textTransform: "uppercase", fontSize: "18px" },
        spacing: { margin: { top: "1.5em", bottom: "0.5em" } },
        color: { text: "#2c3e50" },
      },
    },
    innerBlocks: [],
  },
  {
    clientId: "skills-list",
    name: "core/paragraph",
    isValid: true,
    attributes: {
      content: "Next.js • WordPress • React.js • GraphQL • Gutenberg • REST API",
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
  const [isEditingMode, setIsEditingMode] = useState(true); // Whether we're in block editor mode or import/template mode

  console.log("blocks", blocks);
  
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

  // Handle imported resume data and prepare it for the block editor
  const handleImportComplete = (importedBlocks) => {
    console.log('App received imported blocks:', importedBlocks);
    setBlocks(importedBlocks);
    updateHistoryOnBlocksChange(importedBlocks);
    setIsEditingMode(true); // Switch to editor mode after import
  };

  // Toggle between editor and import/template view
  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
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
        toggleEditMode={toggleEditMode}
        isEditingMode={isEditingMode}
      />

      {/* Main Content Area - conditionally render either Editor or ResumeBuilder */}
      {isEditingMode ? (
        /* Editor Container */
        <div style={appStyles.editorContainer}>
          <BlockEditorProvider
            value={blocks}
            onChange={handleBlocksChange}
            onInput={handleBlocksChange}
          >
            <BlockCanvas height="100%" width="100%" styles={contentStyles} />
          </BlockEditorProvider>
        </div>
      ) : (
        /* Resume Builder */
        <div style={{...appStyles.editorContainer, padding: '20px'}}>
          <ResumeBuilder onImportComplete={handleImportComplete} />
        </div>
      )}
    </div>
  );
}
