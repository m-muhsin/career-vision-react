import React, { useState, useEffect } from "react";

const headerStyles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    backgroundColor: "#1e293b", // Darker color as requested
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    zIndex: 1000,
    transition: "all 0.3s ease", // Smooth transition for all properties
  },
  headerScrolled: {
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(30, 41, 59, 0.95)", // Semi-transparent when scrolled
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "transform 0.3s ease",
  },
  logoContainerHover: {
    transform: "scale(1.05)",
  },
  logo: {
    height: "60px",
    width: "auto",
    fill: "#069CAF",
    display: "block",
  },
  brand: {
    fontFamily: "'Poppins', sans-serif", // Using Poppins font
    fontWeight: "400",
    fontSize: "18px",
    color: "#ffffff",
    whiteSpace: "nowrap", // Keep text on one line
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
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  },
  iconButtonAfter: {
    content: "''",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0)",
    transition: "background-color 0.2s ease",
  },
  iconButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  iconButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(1px)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  iconButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "none",
    transform: "none",
  },
  downloadButton: {
    backgroundColor: "#069CAF",
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
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    outline: "none",
    position: "relative",
    overflow: "hidden",
  },
  downloadButtonHover: {
    backgroundColor: "#4338CA",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
    transform: "translateY(-2px)",
  },
  downloadButtonActive: {
    backgroundColor: "#3730A3",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
    transform: "translateY(1px)",
  },
  buttonIcon: {
    width: "16px",
    height: "16px",
    fill: "currentColor",
    transition: "transform 0.3s ease",
  },
  buttonIconHover: {
    transform: "translateY(-1px)",
  },
};

const Header = ({
  hasUndo,
  hasRedo,
  isPrinting,
  handleUndo,
  handleRedo,
  handlePrint,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [undoHover, setUndoHover] = useState(false);
  const [undoActive, setUndoActive] = useState(false);
  const [redoHover, setRedoHover] = useState(false);
  const [redoActive, setRedoActive] = useState(false);
  const [downloadHover, setDownloadHover] = useState(false);
  const [downloadActive, setDownloadActive] = useState(false);
  const [logoHover, setLogoHover] = useState(false);

  // Effect to detect scrolling in the iframe
  useEffect(() => {
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
        style={{
          ...headerStyles.logoContainer,
          ...(logoHover ? headerStyles.logoContainerHover : {}),
        }}
        onMouseEnter={() => setLogoHover(true)}
        onMouseLeave={() => setLogoHover(false)}
      >
        <svg 
          viewBox="0 0 500 500" 
          style={headerStyles.logo}
          aria-hidden="true"
        >
          <g id="root" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <rect id="background" x="0" y="0" width="500" height="500"></rect>
            <g id="shape" transform="translate(125, 125)">
              <g id="left">
                <path
                  d="M125 0c-69.036 0 -125 55.964 -125 125c0 69.036 55.964 125 125 125"
                  id="shape.primary"
                  fill="#069CAF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 25c-55.228 0 -100 44.772 -100 100c0 55.228 44.772 100 100 100"
                  id="shape.primary"
                  fill="#069CAF"
                  opacity=".6"
                ></path>
                <path
                  d="M125 45c-44.183 0 -80 35.817 -80 80c0 44.183 35.817 80 80 80"
                  id="shape.primary"
                  fill="#069CAF"
                  opacity=".7"
                ></path>
                <path
                  d="M125 61c-35.346 0 -64 28.654 -64 64c0 35.346 28.654 64 64 64"
                  id="shape.primary"
                  fill="#069CAF"
                  opacity=".8"
                ></path>
                <path
                  d="M125 74c-28.167 0 -51 22.833 -51 51c0 28.167 22.833 51 51 51"
                  id="shape"
                  fill="#FFF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 100c-14.36 0 -26 11.417 -26 25.5c0 14.083 11.64 25.5 26 25.5"
                  id="shape"
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
                  id="shape.secondary"
                  fill="#FFFFFF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 25c-55.228 0 -100 44.772 -100 100c0 55.228 44.772 100 100 100"
                  id="shape.secondary"
                  fill="#FFFFFF"
                  opacity=".6"
                ></path>
                <path
                  d="M125 45c-44.183 0 -80 35.817 -80 80c0 44.183 35.817 80 80 80"
                  id="shape.secondary"
                  fill="#FFFFFF"
                  opacity=".7"
                ></path>
                <path
                  d="M125 61c-35.346 0 -64 28.654 -64 64c0 35.346 28.654 64 64 64"
                  id="shape.secondary"
                  fill="#FFFFFF"
                  opacity=".8"
                ></path>
                <path
                  d="M125 74c-28.167 0 -51 22.833 -51 51c0 28.167 22.833 51 51 51"
                  id="shape"
                  fill="#FFF"
                  opacity=".5"
                ></path>
                <path
                  d="M125 100c-14.36 0 -26 11.417 -26 25.5c0 14.083 11.64 25.5 26 25.5"
                  id="shape"
                  fill="#FFF"
                  opacity=".5"
                ></path>
              </g>
            </g>
          </g>
        </svg>
        <span style={headerStyles.brand}>Career Vision</span>
      </a 
        >

      <div style={headerStyles.actionsContainer}>
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
            ...(downloadActive ? headerStyles.downloadButtonActive : {}),
          }}
          onClick={handlePrint}
          disabled={isPrinting}
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => {
            setDownloadHover(false);
            setDownloadActive(false);
          }}
          onMouseDown={() => setDownloadActive(true)}
          onMouseUp={() => setDownloadActive(false)}
          aria-label="Download resume"
        >
          <svg
            style={{
              ...headerStyles.buttonIcon,
              ...(downloadHover ? headerStyles.buttonIconHover : {}),
            }}
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
