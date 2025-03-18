import React from 'react';
import FontSelector from './FontSelector';
import '../styles/components/_secondary-header.scss';

const SecondaryHeader = ({ 
  hasUndo, 
  hasRedo, 
  handleUndo, 
  handleRedo, 
  currentFont, 
  onFontChange 
}) => {
  return (
    <div className="secondary-header">
      <div className="secondary-header__container">
        <div className="secondary-header__left">
          <button
            className={`secondary-header__button ${
              !hasUndo ? "secondary-header__button--disabled" : ""
            }`}
            onClick={hasUndo ? handleUndo : undefined}
            disabled={!hasUndo}
            title="Undo"
          >
            <svg className="secondary-header__button-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"
              />
            </svg>
            Undo
          </button>

          <button
            className={`secondary-header__button ${
              !hasRedo ? "secondary-header__button--disabled" : ""
            }`}
            onClick={hasRedo ? handleRedo : undefined}
            disabled={!hasRedo}
            title="Redo"
          >
            <svg className="secondary-header__button-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"
              />
            </svg>
            Redo
          </button>
        </div>

        <div className="secondary-header__right">
          <FontSelector 
            currentFont={currentFont} 
            onFontChange={onFontChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader; 