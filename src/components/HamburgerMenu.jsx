
import { useState } from 'react';

const HamburgerMenu = ({ onPrint, onToggleEditMode, isEditingMode }) => {
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
            Print Resume
          </button>
          <button onClick={() => {
            onToggleEditMode();
            setIsOpen(false);
          }}>
            {isEditingMode ? 'Import Resume' : 'Edit Resume'}
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
