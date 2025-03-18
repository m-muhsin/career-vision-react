import React from 'react';
import '../styles/components/_font-selector.scss';

const fonts = [
  {
    name: 'Open Sans',
    value: 'Open Sans',
    description: 'Clean, professional, web-friendly',
    importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap'
  },
  {
    name: 'Inter',
    value: 'Inter',
    description: 'Modern, clean, highly readable',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
  },
  {
    name: 'Roboto',
    value: 'Roboto',
    description: 'Clean, modern, versatile',
    importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
  },
  {
    name: 'Lato',
    value: 'Lato',
    description: 'Semi-rounded, professional',
    importUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap'
  },
  {
    name: 'Montserrat',
    value: 'Montserrat',
    description: 'Modern, geometric, elegant',
    importUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap'
  }
];

const FontSelector = ({ currentFont, onFontChange }) => {
  return (
    <div className="font-selector">
      <select
        value={currentFont.value}
        onChange={(e) => onFontChange(fonts.find(font => font.value === e.target.value))}
        className="font-selector__dropdown"
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector; 