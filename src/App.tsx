import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ComparisonInterface } from './components/ComparisonInterface';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { OCRService } from './utils/OCRService';
import { LogoTestPage } from './pages/LogoTestPage'; // Import the new LogoTestPage
import './styles/resize-overrides.css'; // SSMR CSS resize fixes

function AppContent() {
  const { currentTheme, themeConfig } = useTheme();
  
  // Dev toggle state for cards that won't make it to production
  const [showAdvancedOcrCard, setShowAdvancedOcrCard] = React.useState(true);
  const [showPerformanceDemoCard, setShowPerformanceDemoCard] = React.useState(true);

  // Cleanup OCR worker on app unmount
  useEffect(() => {
    return () => {
      OCRService.terminate();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header 
        showAdvancedOcrCard={showAdvancedOcrCard}
        showPerformanceDemoCard={showPerformanceDemoCard}
        onToggleAdvancedOcr={() => setShowAdvancedOcrCard(!showAdvancedOcrCard)}
        onTogglePerformanceDemo={() => setShowPerformanceDemoCard(!showPerformanceDemoCard)}
      />
      <main className="pt-24">
        <ComparisonInterface 
          showAdvancedOcrCard={showAdvancedOcrCard}
          showPerformanceDemoCard={showPerformanceDemoCard}
        />
      </main>
      
      {/* Footer - Enhanced with glassmorphism to match top sections */}
      <footer className="mt-16 glass-panel border-t border-theme-neutral-200 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-theme-neutral-600">
            <p className="text-sm font-serif libertinus-math-text leading-relaxed">
              Built for legal professionals. All processing happens in your browser - your documents never leave your device.
            </p>
            <p className="text-xs mt-2 text-theme-neutral-500 font-serif libertinus-math-text leading-relaxed">
              Proprietary algorithm tuned for surgical, semantic redlines. 
              Features advanced OCR powered by Tesseract.js for screenshot-to-text conversion.
            </p>
            
            {/* Enhanced footer features with glassmorphic styling */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-lg border border-theme-neutral-200 subtle-button">
                <h4 className="font-semibold text-theme-primary-800 mb-2 text-sm">🔒 Privacy First</h4>
                <p className="text-xs text-theme-neutral-600">
                  Client-side processing ensures complete confidentiality
                </p>
              </div>
              <div className="glass-panel p-4 rounded-lg border border-theme-neutral-200 subtle-button">
                <h4 className="font-semibold text-theme-primary-800 mb-2 text-sm">⚡ Lightning Fast</h4>
                <p className="text-xs text-theme-neutral-600">
                  Optimized Myers algorithm for instant results
                </p>
              </div>
              <div className="glass-panel p-4 rounded-lg border border-theme-neutral-200 subtle-button">
                <h4 className="font-semibold text-theme-primary-800 mb-2 text-sm">🌍 Multi-Language</h4>
                <p className="text-xs text-theme-neutral-600">
                  Advanced OCR supports 10+ languages
                </p>
              </div>
            </div>
            
            {/* Professional attribution */}
            <div className="mt-6 pt-4 border-t border-theme-neutral-200">
              <p className="text-xs text-theme-neutral-400 font-serif">
                © 2025 RdLn - Professional Text Redlining with OCR
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      {/* Conditional rendering for the logo test page */}
      {window.location.pathname === '/logo-test' ? (
        <LogoTestPage />
      ) : (
        <AppContent />
      )}
    </ThemeProvider>
  );
}

export default App;