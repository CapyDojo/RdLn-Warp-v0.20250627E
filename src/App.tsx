import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ComparisonInterface } from './components/ComparisonInterface';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { ExperimentalLayoutProvider, useExperimentalFeatures } from './contexts/ExperimentalLayoutContext';
import { OCRService } from './utils/OCRService';
import { LogoTestPage } from './pages/LogoTestPage'; // Import the new LogoTestPage
import { CuppingTestPage } from './pages/CuppingTestPage'; // Import the cupping test page
import { DeveloperDashboard } from './pages/DeveloperDashboard'; // Import the developer dashboard
import './styles/resize-overrides.css'; // SSMR CSS resize fixes

function AppContent() {
  const { currentTheme, themeConfig } = useTheme();
  
  // Get experimental features to check if results overlay is enabled
  const { features } = useExperimentalFeatures();
  
  // State for developer mode toggles
  const [showAdvancedOcrCardState, setShowAdvancedOcrCardState] = useState(true);
  const [showPerformanceDemoCardState, setShowPerformanceDemoCardState] = useState(true);
  
  // State for overlay visibility (only used when results overlay feature is enabled)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  
  // Toggle functions for developer mode controls
  const handleToggleAdvancedOcr = () => {
    setShowAdvancedOcrCardState(!showAdvancedOcrCardState);
  };
  
  const handleTogglePerformanceDemo = () => {
    setShowPerformanceDemoCardState(!showPerformanceDemoCardState);
  };
  
  // Overlay visibility handlers (only used when results overlay feature is enabled)
  const handleOverlayShow = () => {
    if (features.resultsOverlay) {
      setIsOverlayVisible(true);
      console.log('🎯 App: Results overlay shown - hiding header');
    }
  };
  
  const handleOverlayHide = () => {
    if (features.resultsOverlay) {
      setIsOverlayVisible(false);
      console.log('🎯 App: Results overlay hidden - showing header');
    }
  };
  

  // Cleanup OCR worker on app unmount
  useEffect(() => {
    return () => {
      OCRService.terminate();
    };
  }, []);

  // Determine if header should be hidden (only when results overlay feature is enabled AND overlay is visible)
  const shouldHideHeader = features.resultsOverlay && isOverlayVisible;
  
  return (
    <div className="min-h-screen">
      {/* Conditionally render header - only hide when results overlay experimental feature is enabled AND overlay is visible */}
      {!shouldHideHeader && <Header />}
      <main className={shouldHideHeader ? "pt-0" : "pt-32"}>
        <ComparisonInterface 
          showAdvancedOcrCard={showAdvancedOcrCardState}
          showPerformanceDemoCard={showPerformanceDemoCardState}
          onToggleAdvancedOcr={handleToggleAdvancedOcr}
          onTogglePerformanceDemo={handleTogglePerformanceDemo}
          onOverlayShow={handleOverlayShow}
          onOverlayHide={handleOverlayHide}
        />
      </main>
      
      
      {/* Footer - Enhanced with glassmorphism to match top sections */}
      <footer className="mt-16 glass-panel border-t border-theme-neutral-200 shadow-lg transition-all duration-300">
        <div className="footer-container">
          <div className="text-center text-theme-neutral-600">
            <p className="text-xs font-serif libertinus-math-text leading-relaxed">
              Built for legal professionals. All processing happens in your browser - your documents never leave your device.
            </p>
            <p className="text-xs mt-1 text-theme-neutral-500 font-serif libertinus-math-text leading-relaxed">
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
      <LayoutProvider>
        <ExperimentalLayoutProvider>
          {/* Conditional rendering for test pages */}
{window.location.pathname === '/logo-test' ? (
            <LogoTestPage />
          ) : window.location.pathname === '/cupping-test' ? (
            <CuppingTestPage />
          ) : window.location.pathname === '/dev-dashboard' ? (
            <DeveloperDashboard />
          ) : (
            <AppContent />
          )}
        </ExperimentalLayoutProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}

export default App;