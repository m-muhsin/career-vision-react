import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerCoreBlocks } from '@wordpress/block-library'

import App from './App.jsx'
import './index.css'

registerCoreBlocks();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
