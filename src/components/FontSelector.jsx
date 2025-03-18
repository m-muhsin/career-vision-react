import React, { useState, useEffect } from 'react';
import '../styles/components/_font-selector.scss';

const fonts = [
  {
    value: 'Open Sans',
  },
  {
    value: 'Inter',
  },
  {
    value: 'Roboto',
  },
  {
    value: 'Lato',
  },
  {
    value: 'Montserrat',
  }
];

const FontSelector = ({ currentFont, onFontChange }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <div className="font-selector">
      <select
        value={currentFont.value}
        onChange={(e) => onFontChange(fonts.find(font => font.value === e.target.value))}
        className="font-selector__dropdown"
      >
        {fonts.map((font) => (
          <option key={font.value} value={font.value}>
            {font.value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector; 