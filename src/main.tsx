import { StrictMode,useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TokenProvider } from './Context/Context.tsx'
import { InstitutionProvider } from './Context/InstitutionContext.tsx'



createRoot(document.getElementById('root')!).render(
 
  <StrictMode>
      <BrowserRouter>
      <InstitutionProvider>
        <TokenProvider>
             <App />
  
        </TokenProvider>
      </InstitutionProvider>
      </BrowserRouter>
  </StrictMode>
)
