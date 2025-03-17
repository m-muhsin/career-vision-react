// Base styles for the content within the block canvas iframe.
import componentsStyles from "@wordpress/components/build-style/style.css?raw";
import blockEditorContentStyles from "@wordpress/block-editor/build-style/content.css?raw";
import blocksStyles from "@wordpress/block-library/build-style/style.css?raw";
import blocksEditorStyles from "@wordpress/block-library/build-style/editor.css?raw";

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';


const contentStyles = [
  { css: componentsStyles },
  { css: blockEditorContentStyles },
  { css: blocksStyles },
  { css: blocksEditorStyles },

  // A4 paper dimensions are 210mm × 297mm (8.27in × 11.69in)
  // At 96 DPI, that's approximately 794px × 1123px
  // Add A4 paper styling and system font stack
  {
    css: `

      @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
      /* Apply Open Sans to the editor iframe and wrapper */
      body.block-editor-iframe__body,
      .editor-styles-wrapper,
      .editor-styles-wrapper * {
        font-family: 'Open Sans', sans-serif !important;
      }

      body {
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        background-color: #f0f0f0;
      }
      
      /* A4 paper styling */
      .wp-block-post-content,
      .editor-styles-wrapper {
        background-color: white;
        width: 794px !important;
        min-height: 1123px !important;
        margin: 20px auto;
        padding: 15px;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid #e0e0e0;
      }
      
      /* Block editor container */
      .block-editor-block-list__layout {
        max-width: calc(794px - (2 * 15px)) !important; /* Derive max-width from A4 width minus padding */
      }

      /* Text styling */
      p {
        margin-bottom: 1em;
      }
      
      /* Headings */
      h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        font-weight: 600;
      }
      
      h1 {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      h2 {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 18px;
        color: #2c3e50;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      h3 {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 0.2em;
      }
      
      /* Text alignment */
      .has-text-align-center,
      [data-align="center"],
      [style*="text-align: center"] {
        text-align: center !important;
      }
      
      .has-text-align-left,
      [data-align="left"],
      [style*="text-align: left"] {
        text-align: left !important;
      }
      
      .has-text-align-right,
      [data-align="right"],
      [style*="text-align: right"] {
        text-align: right !important;
      }
      
      /* Font sizes */
      .has-small-font-size,
      [data-font-size="small"] {
        font-size: 14px !important;
      }
      
      .has-large-font-size,
      [data-font-size="large"] {
        font-size: 24px !important;
      }
      
      /* Lists */
      ul {
        padding-left: 20px;
        margin-bottom: 1em;
      }
      
      ul li {
        margin-bottom: 0.5em;
      }
      
      /* Custom link styling */
      a {
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        padding-bottom: 1px;
        transition: border-color 0.2s ease;
      }
      
      a:hover {
        border-bottom-color: rgba(0, 0, 0, 0.6);
      }
      
      /* Separator */
      hr {
        border: none;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.1);
        margin: 1.5em 0;
      }
      
      /* WordPress toolbar fix */
      .block-editor-block-toolbar {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
      }
      
      .components-toolbar-group,
      .components-toolbar {
        display: inline-flex !important;
        flex-direction: row !important;
      }
      
      .components-dropdown-menu {
        display: inline-flex !important;
      }
      
      /* Additional styling for block attributes */
      .block-editor-block-list__block[data-align="center"] > * {
        text-align: center !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      
      .block-editor-block-list__block[data-type="core/paragraph"][data-align="center"] > p {
        text-align: center !important;
      }
      
      .block-editor-block-list__block[data-type="core/heading"][data-align="center"] > h1, 
      .block-editor-block-list__block[data-type="core/heading"][data-align="center"] > h2,
      .block-editor-block-list__block[data-type="core/heading"][data-align="center"] > h3 {
        text-align: center !important;
      }
      
      /* Job title row flex layout */
      .job-listing__title-row,
      .education-listing__row,
      div[class*="job-listing__title-row"],
      div[class*="education-listing__row"],
      .wp-block-group.job-listing__title-row,
      .wp-block-group.education-listing__row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
      }
      
      /* Fix for title row layout in Gutenberg editor */
      .job-listing__title-row > .block-editor-inner-blocks > .block-editor-block-list__layout,
      .education-listing__row > .block-editor-inner-blocks > .block-editor-block-list__layout,
      div[class*="job-listing__title-row"] > .block-editor-inner-blocks > .block-editor-block-list__layout,
      div[class*="education-listing__row"] > .block-editor-inner-blocks > .block-editor-block-list__layout {
        display: flex !important;
        width: 100% !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      
      /* Company row flex styling - extra specificity */
      .job-listing__company-row,
      div[class*="job-listing__company-row"],
      .wp-block-group.job-listing__company-row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
      }
      
      /* Force flex layout in the editor for company rows */
      .job-listing__company-row > .block-editor-inner-blocks > .block-editor-block-list__layout,
      div[class*="job-listing__company-row"] > .block-editor-inner-blocks > .block-editor-block-list__layout {
        display: flex !important;
        width: 100% !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      
      /* Additional more general flex selectors to catch edge cases */
      .wp-block-group > .block-editor-inner-blocks > .block-editor-block-list__layout {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      
      /* This is a more specific rule to target groups that should have flex layout */
      .wp-block-group[class*="job-listing__"] > .block-editor-inner-blocks > .block-editor-block-list__layout {
        justify-content: space-between !important;
        align-items: center !important;
      }
      
      /* Style for items within the flex containers */
      .job-listing__title-row > .block-editor-inner-blocks > .block-editor-block-list__layout > div:first-child,
      div[class*="job-listing__title-row"] > .block-editor-inner-blocks > .block-editor-block-list__layout > div:first-child {
        flex: 1 !important;
        min-width: 0 !important;
      }
      
      .job-listing__title-row > .block-editor-inner-blocks > .block-editor-block-list__layout > div:last-child,
      div[class*="job-listing__title-row"] > .block-editor-inner-blocks > .block-editor-block-list__layout > div:last-child {
        text-align: right !important;
        min-width: 150px !important;
        flex-shrink: 0 !important;
      }
      
      .job-listing__company-row > .block-editor-inner-blocks > .block-editor-block-list__layout > div:first-child,
      div[class*="job-listing__company-row"] > .block-editor-inner-blocks > .block-editor-block-list__layout > div:first-child {
        flex: 1 !important;
        min-width: 0 !important;
      }
      
      .job-listing__company-row > .block-editor-inner-blocks > .block-editor-block-list__layout > div:last-child,
      div[class*="job-listing__company-row"] > .block-editor-inner-blocks > .block-editor-block-list__layout > div:last-child {
        text-align: right !important;
        min-width: 120px !important;
        flex-shrink: 0 !important;
      }
      
      /* Override any default box model properties */
      .job-listing__company-row *,
      .job-listing__title-row *,
      div[class*="job-listing__company-row"] *,
      div[class*="job-listing__title-row"] * {
        box-sizing: border-box !important;
      }
      
      /* Ensure the job listings themselves have proper layout */
      [data-type="core/group"] {
        position: relative !important;
      }
      
      /* Duration styling */
      .job-listing__duration {
        font-style: italic !important;
        color: #666 !important;
      }
      
      /* Hide UI elements during PDF export */
      .pdf-export-mode .block-editor-writing-flow__click-redirect,
      .pdf-export-mode .block-editor-block-list__insertion-point,
      .pdf-export-mode .block-editor-block-list__block-selection-button,
      .pdf-export-mode .block-editor-block-list__breadcrumb,
      .pdf-export-mode .block-editor-block-toolbar,
      .pdf-export-mode .block-editor-block-contextual-toolbar {
        display: none !important;
      }

      /* Contact info row styling */
      .contact-info-row {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
        margin-bottom: 5px !important;
      }

      .contact-info-row > .block-editor-inner-blocks > .block-editor-block-list__layout {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
        width: 100% !important;
      }

      .contact-info-row .wp-block-paragraph {
        margin: 0 !important;
        font-size: 14px !important;
        color: #555 !important;
      }

      .contact-info-row a {
        color: inherit !important;
        text-decoration: none !important;
        transition: color 0.2s ease !important;
      }

      .contact-info-row a:hover {
        color: var(--secondary-color) !important;
      }

      @media (max-width: 640px) {
        .contact-info-row {
          gap: 12px !important;
        }
        
        .contact-info-row > .block-editor-inner-blocks > .block-editor-block-list__layout {
          gap: 12px !important;
        }
        
        .contact-info-row .wp-block-paragraph {
          font-size: 13px !important;
        }
      }

      /* Education section styling */
      .education-listing__details {
        margin-bottom: 24px !important;
        padding-bottom: 16px !important;
        border-bottom: 1px solid #eee !important;
      }

      .education-listing__details:last-child {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
        border-bottom: none !important;
      }

      .education-listing__row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 8px !important;
        width: 100% !important;
      }

      .education-listing__degree {
        font-size: 17px !important;
        font-weight: 600 !important;
        color: var(--primary-color) !important;
        margin-bottom: 6px !important;
        line-height: 1.4 !important;
      }

      .education-listing__institution {
        font-weight: 600 !important;
        color: #2c3e50 !important;
        font-size: 15px !important;
      }

      .education-listing__duration {
        font-style: italic !important;
        color: #666 !important;
        text-align: right !important;
        font-size: 14px !important;
        white-space: nowrap !important;
        margin-left: 16px !important;
      }

      .education-listing__description {
        color: #4a5568 !important;
        font-size: 15px !important;
        line-height: 1.6 !important;
        margin-top: 8px !important;
      }

      /* Fix for education row layout in Gutenberg editor */
      .education-listing__row > .block-editor-inner-blocks > .block-editor-block-list__layout {
        display: flex !important;
        width: 100% !important;
        justify-content: space-between !important;
        align-items: center !important;
      }

      .education-listing__row > .block-editor-inner-blocks > .block-editor-block-list__layout > div:first-child {
        flex: 1 !important;
        min-width: 0 !important;
      }

      .education-listing__row > .block-editor-inner-blocks > .block-editor-block-list__layout > div:last-child {
        text-align: right !important;
        min-width: 150px !important;
        flex-shrink: 0 !important;
      }
    `,
  },
];

export { contentStyles };
