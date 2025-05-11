import React, { useState, useEffect } from "react";
import HamburgerMenu from "./HamburgerMenu";
import logo from "../assets/icon.svg";
import SecondaryHeader from "./SecondaryHeader";
import "../styles/components/header.scss";
import "../styles/components/_font-selector.scss";

const Header = ({
  hasUndo,
  hasRedo,
  isPrinting,
  handleUndo,
  handleRedo,
  handlePrint,
  toggleEditMode,
  isEditingMode,
  onFontChange,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentFont, setCurrentFont] = useState({
    name: "Open Sans",
    value: "Open Sans",
    description: "Clean, professional, web-friendly",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&family=Inter:wght@400;500;700&family=Roboto:wght@400;500;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;700&display=swap",
  });

  // Effect to detect scrolling in the iframe
  useEffect(() => {
    const handleScroll = () => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentWindow) {
        const scrollY = editorIframe.contentWindow.scrollY;
        setScrolled(scrollY > 10);
      }
    };

    const setupIframeScroll = () => {
      const editorIframe = document.querySelector(
        'iframe[name="editor-canvas"]'
      );
      if (editorIframe && editorIframe.contentWindow) {
        editorIframe.contentWindow.addEventListener("scroll", handleScroll);
      }
    };

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

  const handleFontChange = (font) => {
    setCurrentFont(font);
    onFontChange(font);
  };

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <a href="https://careervision.io" className="header__logo-container">
          <img
            src={logo}
            alt="Career Vision Logo"
            className="header__logo"
          />
          <span className="header__brand">Career Vision</span>
        </a>

        <div className="header__actions-container">
          <div className="header__actions">
            <div className="header__desktop-actions">
              <button
                className="header__new-button"
                onClick={() => {
                  if (
                    confirm(
                      "Create a new resume? All unsaved changes will be lost."
                    )
                  ) {
                    window.location.href = window.location.pathname;
                  }
                }}
                title="New Resume"
              >
                <svg className="header__button-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                  />
                </svg>
                New
              </button>
              <button
                className="header__import-button"
                onClick={() => toggleEditMode(false)}
                title="Import Resume"
              >
                <svg className="header__button-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  />
                </svg>
                Import
              </button>

              <button
                className="header__download-button"
                onClick={handlePrint}
                disabled={isPrinting}
                title="Export PDF"
              >
                <svg className="header__button-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
                  />
                </svg>
                Export PDF
              </button>
            </div>

            <HamburgerMenu
              onPrint={handlePrint}
              onToggleEditMode={toggleEditMode}
              isEditingMode={isEditingMode}
              onNew={() => {
                if (
                  confirm(
                    "Create a new resume? All unsaved changes will be lost."
                  )
                ) {
                  window.location.href = window.location.pathname;
                }
              }}
            />
          </div>
        </div>
      </header>

      {isEditingMode && (
        <SecondaryHeader
          hasUndo={hasUndo}
          hasRedo={hasRedo}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          currentFont={currentFont}
          onFontChange={handleFontChange}
        />
      )}
    </>
  );
};

export default Header;
