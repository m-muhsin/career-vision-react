import { useState, useEffect, useCallback } from "react";
import { BlockEditorProvider, BlockCanvas } from "@wordpress/block-editor";
import "./styles/wordpress-fixes.css";
import "./styles/block-editor-fix.css";
import "./styles/inline-style-fix.css";
import "./styles/wordpress-classes.css";
import "./styles/toolbar-fix.css";
import "./styles/iframe-styles.scss";
import "./styles/fonts.css";
import "./styles/block-layout-fix.css";
import "./App.css";
import "./styles/main.scss";
import { contentStyles } from "./styles/contentStyles.js";
import Header from "./components/Header";
import ResumeBuilder from "./components/ResumeBuilder";

import resumeData from "./assets/profile-object.json";

import { createBlocksFromStructuredData } from "./components/ImportResume";

// A4 paper dimensions are 210mm × 297mm (8.27in × 11.69in)
// At 96 DPI, that's approximately 794px × 1123px

export default function Editor() {
  // Initial state
  const [blocks, setBlocks] = useState(
    createBlocksFromStructuredData(resumeData)
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(true); // Whether we're in block editor mode or import/template mode

  // History state management
  const [history, setHistory] = useState([
    createBlocksFromStructuredData(resumeData),
  ]); // Stack of previous states
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
    // Process imported blocks to ensure consistent styling
    const processedBlocks = processImportedBlocks(importedBlocks);

    setBlocks(processedBlocks);
    updateHistoryOnBlocksChange(processedBlocks);
    setIsEditingMode(true); // Switch to editor mode after import
  };

  // Process imported blocks to ensure proper styling
  const processImportedBlocks = (blocks) => {
    return blocks.map((block) => {
      // Process block based on its type
      if (block.name === "core/group") {
        // Check if this is a job listing group
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          // Process inner blocks
          const processedInnerBlocks = processJobListingBlocks(
            block.innerBlocks
          );
          return { ...block, innerBlocks: processedInnerBlocks };
        }
      }

      // Process any nested blocks
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        return {
          ...block,
          innerBlocks: processImportedBlocks(block.innerBlocks),
        };
      }

      return block;
    });
  };

  // Process job listing blocks to ensure proper flex styling
  const processJobListingBlocks = (innerBlocks) => {
    // Second pass: ensure blocks have proper styling
    return innerBlocks.map((block) => {
      if (block.name === "core/group") {
        // Fix title row
        if (block.attributes?.className?.includes("job-listing__title-row")) {
          const titleRowStyle = {
            ...block.attributes.style,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          };

          if (block.innerBlocks && block.innerBlocks.length >= 2) {
            // First block should be heading, second should be duration
            const updatedInnerBlocks = block.innerBlocks.map(
              (innerBlock, index) => {
                if (index === 0 && innerBlock.name === "core/heading") {
                  // Job title
                  return {
                    ...innerBlock,
                    attributes: {
                      ...innerBlock.attributes,
                      style: {
                        ...innerBlock.attributes.style,
                        flex: "1",
                        spacing: { margin: { top: "0", bottom: "0" } },
                      },
                    },
                  };
                } else if (
                  index === 1 &&
                  innerBlock.name === "core/paragraph"
                ) {
                  // Duration
                  return {
                    ...innerBlock,
                    attributes: {
                      ...innerBlock.attributes,
                      className: "job-listing__duration",
                      style: {
                        ...innerBlock.attributes.style,
                        textAlign: "right",
                        minWidth: "150px",
                      },
                    },
                  };
                }
                return innerBlock;
              }
            );

            return {
              ...block,
              attributes: {
                ...block.attributes,
                style: titleRowStyle,
              },
              innerBlocks: updatedInnerBlocks,
            };
          }
        }

        // Fix company row
        if (block.attributes?.className?.includes("job-listing__company-row")) {
          const companyRowStyle = {
            ...block.attributes.style,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            spacing: { margin: { bottom: "5px" } },
          };

          if (block.innerBlocks && block.innerBlocks.length >= 2) {
            // First block should be company name, second should be location
            const updatedInnerBlocks = block.innerBlocks.map(
              (innerBlock, index) => {
                if (index === 0 && innerBlock.name === "core/paragraph") {
                  // Company name
                  return {
                    ...innerBlock,
                    attributes: {
                      ...innerBlock.attributes,
                      className: "job-listing__company-name",
                      style: {
                        ...innerBlock.attributes.style,
                        flex: "1",
                        spacing: { margin: { top: "0", bottom: "0" } },
                      },
                    },
                  };
                } else if (
                  index === 1 &&
                  innerBlock.name === "core/paragraph"
                ) {
                  // Location
                  return {
                    ...innerBlock,
                    attributes: {
                      ...innerBlock.attributes,
                      className: "job-listing__company-location",
                      style: {
                        ...innerBlock.attributes.style,
                        textAlign: "right",
                        minWidth: "120px",
                        spacing: { margin: { top: "0", bottom: "0" } },
                      },
                    },
                  };
                }
                return innerBlock;
              }
            );

            return {
              ...block,
              attributes: {
                ...block.attributes,
                style: companyRowStyle,
              },
              innerBlocks: updatedInnerBlocks,
            };
          }
        }
      }

      // Process any nested blocks
      if (block.innerBlocks && block.innerBlocks.length > 0) {
        return {
          ...block,
          innerBlocks: processJobListingBlocks(block.innerBlocks),
        };
      }

      return block;
    });
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

  // Inject direct CSS into the iframe for more reliable styling
  useEffect(() => {
    const injectCssIntoIframe = () => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (!editorIframe) return;

      try {
        const iframeDocument =
          editorIframe.contentDocument || editorIframe.contentWindow.document;

        // Check if our custom style element already exists
        let styleElement = iframeDocument.getElementById("custom-flex-styles");

        if (!styleElement) {
          // Create and inject a style element with custom CSS
          styleElement = iframeDocument.createElement("style");
          styleElement.id = "custom-flex-styles";
          styleElement.textContent = `
            /* Direct flex layout styling */
            .job-listing__title-row, div[class*="job-listing__title-row"] {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              width: 100% !important;
            }
            
            .job-listing__company-row, div[class*="job-listing__company-row"] {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              width: 100% !important;
            }
            
            /* Style job title and duration */
            .job-listing__duration {
              text-align: right !important;
              min-width: 150px !important;
            }
            
            /* Company name and location styling */
            .job-listing__company-name {
              flex: 1 !important;
            }
            
            .job-listing__company-location {
              text-align: right !important;
              min-width: 120px !important;
            }
          `;

          iframeDocument.head.appendChild(styleElement);
        }
      } catch (error) {
        console.error("Error injecting CSS into iframe:", error);
      }
    };

    // Attempt to inject the CSS immediately and then periodically
    const initialTimeoutId = setTimeout(injectCssIntoIframe, 1500);
    const intervalId = setInterval(injectCssIntoIframe, 3000);

    return () => {
      clearTimeout(initialTimeoutId);
      clearInterval(intervalId);
    };
  }, []);

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
          .block-editor-block-contextual-toolbar,
          .rich-text [data-rich-text-placeholder] {
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

  const [currentFont, setCurrentFont] = useState({
    name: 'Open Sans',
    value: 'Open Sans',
    description: 'Clean, professional, web-friendly',
    importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap'
  });

  // Handle font change
  const handleFontChange = (font) => {
    setCurrentFont(font);
    
    // Update the font in the iframe
    const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
    if (editorIframe) {
      const iframeDocument = editorIframe.contentDocument || editorIframe.contentWindow.document;
      
      // Update CSS variables
      const root = iframeDocument.documentElement;
      root.style.setProperty('--font-primary', `'${font.value}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`);
      
      // Update font family for all elements
      const styleElement = iframeDocument.createElement('style');
      styleElement.textContent = `
        body.block-editor-iframe__body,
        .editor-styles-wrapper,
        .editor-styles-wrapper * {
          font-family: '${currentFont.value}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        .editor-styles-wrapper h1,
        .editor-styles-wrapper h2,
        .editor-styles-wrapper h3,
        .editor-styles-wrapper h4,
        .editor-styles-wrapper h5,
        .editor-styles-wrapper h6 {
          font-family: '${currentFont.value}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
      `;
      
      // Remove any existing font style element
      const existingStyle = iframeDocument.getElementById('dynamic-font-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      styleElement.id = 'dynamic-font-styles';
      iframeDocument.head.appendChild(styleElement);
    }
  };

  return (
    <div className="app__container">
      <Header
        hasUndo={hasUndo}
        hasRedo={hasRedo}
        isPrinting={isPrinting}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handlePrint={handlePrint}
        toggleEditMode={toggleEditMode}
        isEditingMode={isEditingMode}
        onFontChange={handleFontChange}
      />

      {/* Main Content Area - conditionally render either Editor or ResumeBuilder */}
      {isEditingMode ? (
        /* Editor Container */
        <div className="app__editor-container">
          <BlockEditorProvider
            value={blocks}
            onChange={handleBlocksChange}
            onInput={handleBlocksChange}
          >
            <BlockCanvas
              height="100%"
              width="100%"
              styles={contentStyles}
              className="custom-editor-styling"
            />
          </BlockEditorProvider>
        </div>
      ) : (
        /* Resume Builder */
        <div className="app__editor-container" style={{ padding: "20px" }}>
          <ResumeBuilder onImportComplete={handleImportComplete} />
        </div>
      )}
    </div>
  );
}
