import { useState, useEffect } from "react";
import { BlockEditorProvider, BlockCanvas } from "@wordpress/block-editor";
// import { createBlock } from "@wordpress/blocks";

// Base styles for the content within the block canvas iframe.
import componentsStyles from "@wordpress/components/build-style/style.css?raw";
import blockEditorContentStyles from "@wordpress/block-editor/build-style/content.css?raw";
import blocksStyles from "@wordpress/block-library/build-style/style.css?raw";
import blocksEditorStyles from "@wordpress/block-library/build-style/editor.css?raw";

// Simplified template using fewer blocks and simpler structure
const resumeTemplate = [
  {
    clientId: "e8000a83-72bc-422d-ab92-6fb88e00973a",
    name: "core/group",
    isValid: true,
    attributes: { tagName: "div", layout: { type: "constrained" } },
    innerBlocks: [
      {
        clientId: "a9b661c8-1c44-4609-bf23-0ce8104e7070",
        name: "core/heading",
        isValid: true,
        attributes: { content: "Muhammad Muhsin", level: 2, textAlign: "left" },
        innerBlocks: [],
      },
      {
        clientId: "4dc717b7-b077-449f-94ad-af5a062b89c1",
        name: "core/paragraph",
        isValid: true,
        attributes: { content: "muhammad.muhseen@gmail.com", dropCap: false },
        innerBlocks: [],
      },
      {
        clientId: "1608dccc-400a-4da3-b67d-6d37ce2f2894",
        name: "core/paragraph",
        isValid: true,
        attributes: { content: "", dropCap: false },
        innerBlocks: [],
      },
    ],
  },
];

// A4 paper dimensions are 210mm × 297mm (8.27in × 11.69in)
// At 96 DPI, that's approximately 794px × 1123px
const contentStyles = [
  { css: componentsStyles },
  { css: blockEditorContentStyles },
  { css: blocksStyles },
  { css: blocksEditorStyles },
  // Add A4 paper styling and system font stack
  {
    css: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
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
        padding: 60px;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid #e0e0e0;
      }
      
      /* Block editor container */
      .block-editor-block-list__layout {
        max-width: 674px !important; /* 794px - 2*60px padding */
      }
      
      /* Improved typography */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      p {
        margin-bottom: 1em;
      }
    `,
  },
];

// Full screen app styles
const appStyles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: '100vh',
    padding: 0,
    margin: 0,
    overflow: 'auto'
  },
  editorContainer: {
    width: '100%',
    height: '100%',
  }
};

export default function Editor() {
  // Initialize with resume template
  const [blocks, setBlocks] = useState(resumeTemplate);

  // Add styles to html and body to remove any gaps
  useEffect(() => {
    // Add styles to remove gaps in html and body
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div style={appStyles.container}>
      <div style={appStyles.editorContainer}>
        <BlockEditorProvider
          value={blocks}
          onChange={setBlocks}
          onInput={setBlocks}
        >
          <BlockCanvas 
            height="100vh" 
            width="100%"
            styles={contentStyles} 
          />
        </BlockEditorProvider>
      </div>
    </div>
  );
}
