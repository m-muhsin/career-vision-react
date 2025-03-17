import React, { useState, useEffect } from "react";

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
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <a href="https://careervision.io" className="header__logo-container">
        <svg viewBox="0 0 500 500" className="header__logo" aria-hidden="true">
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
        <span className="header__brand">CareerVision</span>
      </a>

      <div className="header__actions-container">
        {isEditingMode && (
          <>
            <button
              className={`header__icon-button ${!hasUndo ? "header__icon-button--disabled" : ""}`}
              onClick={hasUndo ? handleUndo : undefined}
              disabled={!hasUndo}
              title="Undo"
            >
              <svg className="header__button-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"
                />
              </svg>
            </button>

            <button
              className={`header__icon-button ${!hasRedo ? "header__icon-button--disabled" : ""}`}
              onClick={hasRedo ? handleRedo : undefined}
              disabled={!hasRedo}
              title="Redo"
            >
              <svg className="header__button-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"
                />
              </svg>
            </button>
          </>
        )}

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

        <div className="header__actions">
        <button
          className="header__import-button header__import-button--desktop"
          onClick={() => toggleEditMode(false)}
          title="Import Resume"
        >
          <svg className="header__button-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,19.5V17.5H9.5V19.5H13.5M13.5,16.5V14.5H9.5V16.5H13.5M18,20H6V4H13V9H18"
            />
          </svg>
          Import
        </button>
        <HamburgerMenu 
          onPrint={handlePrint}
          onToggleEditMode={toggleEditMode}
          isEditingMode={isEditingMode}
        />
      </div>
      </div>
    </header>
  );
};

export default Header;
