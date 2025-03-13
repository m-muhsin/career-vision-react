import React, { useState, useEffect } from "react";

const headerStyles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    backgroundColor: "#1e293b",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: 1000,
    transition: "box-shadow 0.3s ease",
  },
  headerScrolled: {
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
    backgroundColor: "rgba(30, 41, 59, 0.95)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  logo: {
    height: "36px",
    width: "auto",
  },
  brand: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "500",
    fontSize: "18px",
    color: "#ffffff",
    whiteSpace: "nowrap",
  },
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  iconButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  iconButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  iconButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  downloadButton: {
    backgroundColor: "#05889a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.3s ease",
  },
  downloadButtonHover: {
    backgroundColor: "#069CAF",
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
    fill: "currentColor",
  },
  newButton: {
    backgroundColor: "#3aba60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 15px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.3s ease",
  },
  newButtonHover: {
    backgroundColor: "#4ade80",
  },
  importButton: {
    backgroundColor: "#d97706",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.3s ease",
  },
  importButtonHover: {
    backgroundColor: "#f59e0b",
  },
};

const Header = ({
  hasUndo,
  hasRedo,
  isPrinting,
  handleUndo,
  handleRedo,
  handlePrint,
  toggleEditMode,
  isEditingMode,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [undoHover, setUndoHover] = useState(false);
  const [undoActive, setUndoActive] = useState(false);
  const [redoHover, setRedoHover] = useState(false);
  const [redoActive, setRedoActive] = useState(false);
  const [downloadHover, setDownloadHover] = useState(false);
  const [newHover, setNewHover] = useState(false);
  const [importHover, setImportHover] = useState(false);

  // Effect to detect scrolling in the iframe
  useEffect(() => {
    const handleScroll = () => {
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentWindow) {
        const scrollY = editorIframe.contentWindow.scrollY;
        setScrolled(scrollY > 10);
      }
    };

    const setupIframeScroll = () => {
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentWindow) {
        editorIframe.contentWindow.addEventListener("scroll", handleScroll);
      }
    };

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
        editorIframe.contentWindow.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <header
      style={{
        ...headerStyles.header,
        ...(scrolled ? headerStyles.headerScrolled : {}),
      }}
    >
      <a 
        href="https://careervision.io"
        style={headerStyles.logoContainer}
      >
        <svg 
          viewBox="0 0 500 500" 
          style={headerStyles.logo}
          aria-hidden="true"
        >
          <g id="root" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="shape" transform="translate(125, 125)">
              <g id="left">
                <path
                  d="M125 0c-69.036 0 -125 55.964 -125 125c0 69.036 55.964 125 125 125"
                  fill="#069CAF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 25c-55.228 0 -100 44.772 -100 100c0 55.228 44.772 100 100 100"
                  fill="#069CAF"
                  opacity=".6"
                ></path>
                <path
                  d="M125 45c-44.183 0 -80 35.817 -80 80c0 44.183 35.817 80 80 80"
                  fill="#069CAF"
                  opacity=".7"
                ></path>
                <path
                  d="M125 61c-35.346 0 -64 28.654 -64 64c0 35.346 28.654 64 64 64"
                  fill="#069CAF"
                  opacity=".8"
                ></path>
                <path
                  d="M125 74c-28.167 0 -51 22.833 -51 51c0 28.167 22.833 51 51 51"
                  fill="#FFF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 100c-14.36 0 -26 11.417 -26 25.5c0 14.083 11.64 25.5 26 25.5"
                  fill="#FFF"
                  opacity=".5"
                ></path>
              </g>
              <g
                id="right"
                transform="translate(187.500000, 125.000000) scale(-1, 1) translate(-187.500000, -125.000000) translate(125.000000, 0.000000)"
              >
                <path
                  d="M125 0c-69.036 0 -125 55.964 -125 125c0 69.036 55.964 125 125 125"
                  fill="#FFFFFF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 25c-55.228 0 -100 44.772 -100 100c0 55.228 44.772 100 100 100"
                  fill="#FFFFFF"
                  opacity=".6"
                ></path>
                <path
                  d="M125 45c-44.183 0 -80 35.817 -80 80c0 44.183 35.817 80 80 80"
                  fill="#FFFFFF"
                  opacity=".7"
                ></path>
                <path
                  d="M125 61c-35.346 0 -64 28.654 -64 64c0 35.346 28.654 64 64 64"
                  fill="#FFFFFF"
                  opacity=".8"
                ></path>
                <path
                  d="M125 74c-28.167 0 -51 22.833 -51 51c0 28.167 22.833 51 51 51"
                  fill="#FFF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 100c-14.36 0 -26 11.417 -26 25.5c0 14.083 11.64 25.5 26 25.5"
                  fill="#FFF"
                  opacity=".5"
                ></path>
              </g>
            </g>
          </g>
        </svg>
        <span style={headerStyles.brand}>Career Vision</span>
      </a>

      <div style={headerStyles.actionsContainer}>
        {/* New + Button */}
        <button
          style={{
            ...headerStyles.newButton,
            ...(newHover ? headerStyles.newButtonHover : {})
          }}
          onClick={() => {
            // You can add functionality to create a new document here
            // For now, we'll just reset to the default template
            window.location.reload();
          }}
          onMouseEnter={() => setNewHover(true)}
          onMouseLeave={() => setNewHover(false)}
          title="Create New Resume"
          aria-label="Create new resume"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={headerStyles.buttonIcon}
          >
            <path
              d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              fill="currentColor"
            />
          </svg>
          New
        </button>
        
        {/* Import/Edit Toggle Button */}
        {isEditingMode && (
          <button
            style={{
              ...headerStyles.importButton,
              ...(importHover ? headerStyles.importButtonHover : {})
            }}
            onClick={toggleEditMode}
            onMouseEnter={() => setImportHover(true)}
            onMouseLeave={() => setImportHover(false)}
            title="Import Resume"
            aria-label="Import resume from PDF"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={headerStyles.buttonIcon}
            >
              <path
                d="M5 20h14v-2H5v2zM5 10h4v6h6v-6h4l-7-7-7 7z"
                fill="currentColor"
              />
            </svg>
            Import Resume
          </button>
        )}
        
        {!isEditingMode && (
          <button
            style={{
              ...headerStyles.importButton,
              ...(importHover ? headerStyles.importButtonHover : {})
            }}
            onClick={toggleEditMode}
            onMouseEnter={() => setImportHover(true)}
            onMouseLeave={() => setImportHover(false)}
            title="Back to Editor"
            aria-label="Return to editor"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={headerStyles.buttonIcon}
            >
              <path
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                fill="currentColor"
              />
            </svg>
            Back to Editor
          </button>
        )}
        
        {/* Undo Button */}
        <button
          style={{
            ...headerStyles.iconButton,
            ...(undoHover ? headerStyles.iconButtonHover : {}),
            ...(undoActive ? headerStyles.iconButtonActive : {}),
            ...(!hasUndo ? headerStyles.iconButtonDisabled : {}),
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
          aria-label="Undo action"
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
            ...headerStyles.iconButton,
            ...(redoHover ? headerStyles.iconButtonHover : {}),
            ...(redoActive ? headerStyles.iconButtonActive : {}),
            ...(!hasRedo ? headerStyles.iconButtonDisabled : {}),
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
          aria-label="Redo action"
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

        {/* Download Button */}
        <button
          style={{
            ...headerStyles.downloadButton,
            ...(downloadHover ? headerStyles.downloadButtonHover : {}),
          }}
          onClick={handlePrint}
          disabled={isPrinting}
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => {
            setDownloadHover(false);
          }}
          aria-label="Download resume"
        >
          <svg
            style={headerStyles.buttonIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
            <path
              d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
              fill="currentColor"
            />
          </svg>
          {isPrinting ? "Processing..." : "Download"}
        </button>
      </div>
    </header>
  );
};

export default Header;
