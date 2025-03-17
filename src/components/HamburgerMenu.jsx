import React, { useState, useEffect, useRef } from 'react';

const HamburgerMenu = ({ onPrint, onToggleEditMode, isEditingMode, onNew, isPrinting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isOpen) return;
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const addListeners = () => {
      document.addEventListener('mousedown', handleClickOutside, true);
      
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentDocument) {
        editorIframe.contentDocument.addEventListener('mousedown', handleClickOutside, true);
      }
    };

    const removeListeners = () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentDocument) {
        editorIframe.contentDocument.removeEventListener('mousedown', handleClickOutside, true);
      }
    };

    addListeners();

    const intervalId = setInterval(() => {
      const editorIframe = document.querySelector('iframe[name="editor-canvas"]');
      if (editorIframe && editorIframe.contentDocument) {
        editorIframe.contentDocument.addEventListener('mousedown', handleClickOutside, true);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      removeListeners();
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button 
        className={`hamburger-menu__button ${isOpen ? 'hamburger-menu__button--open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      {isOpen && (
        <div className="hamburger-menu__content">
          <button 
            className="hamburger-menu__item hamburger-menu__item--export"
            onClick={() => {
              onPrint();
              setIsOpen(false);
            }}
            disabled={isPrinting}
          >
            <svg className="hamburger-menu__icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Export PDF
          </button>

          <button 
            className="hamburger-menu__item hamburger-menu__item--new"
            onClick={() => {
              onNew();
              setIsOpen(false);
            }}
          >
            <svg className="hamburger-menu__icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            New Resume
          </button>

          <button 
            className="hamburger-menu__item hamburger-menu__item--import"
            onClick={() => {
              onToggleEditMode();
              setIsOpen(false);
            }}
          >
            <svg className="hamburger-menu__icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            {isEditingMode ? 'Import from LinkedIn' : 'Edit Resume'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
