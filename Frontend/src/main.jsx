import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AvatarProvider } from "./context/AvatarProvider.jsx";



createRoot(document.getElementById('root')).render(
  <AvatarProvider>
    <App />
    </AvatarProvider>
)
