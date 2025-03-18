import React from 'react';

const fonts = [
  {
    name: 'Inter',
    value: 'Inter',
    description: 'Modern, clean, digital-friendly',
    importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  },
  {
    name: 'Roboto',
    value: 'Roboto',
    description: 'Neutral, contemporary, easy-to-read',
    importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
  },
  {
    name: 'Open Sans',
    value: 'Open Sans',
    description: 'Clean, professional, web-friendly',
    importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap'
  },
  {
    name: 'Lato',
    value: 'Lato',
    description: 'Stylish, readable, versatile',
    importUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap'
  },
  {
    name: 'Montserrat',
    value: 'Montserrat',
    description: 'Modern, strong headings, clean look',
    importUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap'
  }
];

const FontSelector = ({ currentFont, onFontChange }) => {
  const handleFontChange = (event) => {
    const selectedFont = fonts.find(font => font.value === event.target.value);
    if (selectedFont) {
      onFontChange(selectedFont);
    }
  };

  return (
    <div className="font-selector">
      <select 
        value={currentFont.value} 
        onChange={handleFontChange}
        className="font-selector__dropdown"
      >
        {fonts.map(font => (
          <option key={font.value} value={font.value}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector; 