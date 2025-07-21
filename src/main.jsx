import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Overlay from './components/Overlay'

createRoot(document.getElementById('root')).render(
    <>
        <App />
        <Overlay />
    </>
)