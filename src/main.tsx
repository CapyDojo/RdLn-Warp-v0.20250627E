import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/glassmorphism.css';
import { ThemeProvider } from './contexts/ThemeContext';
// STEP 1: Import Background Language Loader (Safe, Modular)
import { BackgroundLanguageLoader } from './services/BackgroundLanguageLoader';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

// STEP 1b: Safe Background Language Loading (SSMR Implementation)
// Initialize after a short delay to ensure app is fully loaded
setTimeout(async () => {
  try {
    console.log('🚀 Initializing background language loading...');
    await BackgroundLanguageLoader.startBackgroundLoading();
    console.log('✅ Background language loading started successfully');
  } catch (error) {
    console.warn('⚠️ Background language loading failed (non-critical):', error);
    // Graceful degradation - app continues to work normally
  }
}, 2000); // 2 second delay ensures app is ready

// STEP 1c: Safe Cleanup (Reversible)
// Cleanup background loader on page unload
window.addEventListener('beforeunload', async () => {
  try {
    await BackgroundLanguageLoader.cleanup();
  } catch (error) {
    console.warn('Background loader cleanup error (non-critical):', error);
  }
});
