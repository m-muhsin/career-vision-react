
import { useState } from 'react';

const HamburgerMenu = ({ onPrint, onToggleEditMode, isEditingMode, onNew }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
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
          <button onClick={() => {
            onPrint();
            setIsOpen(false);
          }}>
            <svg className="hamburger-menu__icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
            </svg>
            Export PDF
          </button>
          <button onClick={() => {
            onNew();
            setIsOpen(false);
          }}>
            <svg className="hamburger-menu__icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            New Resume
          </button>
          <button onClick={() => {
            onToggleEditMode();
            setIsOpen(false);
          }}>
            <svg className="hamburger-menu__icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,19.5V17.5H9.5V19.5H13.5M13.5,16.5V14.5H9.5V16.5H13.5M18,20H6V4H13V9H18" />
            </svg>
            {isEditingMode ? 'Import Resume' : 'Edit Resume'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
