import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router }from './routes/routers'
import { RouterProvider } from "react-router"
import App from './App'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
