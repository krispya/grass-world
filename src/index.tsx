import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WorldProvider } from 'koota/react'
import { world } from './core/world'
import { App } from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorldProvider world={world}>
      <App />
    </WorldProvider>
  </StrictMode>,
)
