import React from 'react';
import { Scale, FileText, ArrowLeftRight, Search, Type, Zap, Eye, Target } from 'lucide-react';

export const LogoShowcase: React.FC = () => {
  return (
    <div className="p-8 bg-theme-neutral-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-theme-primary-900 mb-4 text-center font-serif">RdLn Logo Concepts</h2>
      <p className="text-lg text-theme-neutral-700 mb-12 text-center max-w-3xl">
        Four sophisticated logo concepts for the professional legal document comparison tool. 
        Each design emphasizes precision, professionalism, and the core functionality of document analysis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {/* Idea 1: The Abstract "RdLn" Monogram */}
        <div className="glass-panel p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
          <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-theme-primary-500 to-theme-primary-700 rounded-2xl mb-6 shadow-lg">
            <span className="text-white text-3xl font-bold font-serif leading-none tracking-tighter transform hover:scale-105 transition-transform duration-200">
              RdLn
            </span>
          </div>
          <h3 className="text-xl font-semibold text-theme-primary-800 mb-3 font-serif">Abstract Monogram</h3>
          <p className="text-theme-neutral-600 text-sm leading-relaxed">
            A sophisticated typographic approach where the letters "R," "d," "L," and "n" form an elegant, 
            interconnected symbol. Emphasizes the mathematical precision of the Myers algorithm through 
            clean geometry and negative space.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-theme-primary-600">
            <Type className="w-4 h-4" />
            <span>Typography-focused</span>
          </div>
        </div>

        {/* Idea 2: The Balanced Document */}
        <div className="glass-panel p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
          <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-theme-secondary-500 to-theme-secondary-700 rounded-2xl mb-6 shadow-lg relative overflow-hidden">
            <FileText className="w-10 h-10 text-white absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-6 opacity-80" />
            <FileText className="w-10 h-10 text-white absolute right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2 -rotate-6 opacity-80" />
            <ArrowLeftRight className="w-8 h-8 text-white absolute z-10 drop-shadow-lg" />
          </div>
          <h3 className="text-xl font-semibold text-theme-primary-800 mb-3 font-serif">Balanced Documents</h3>
          <p className="text-theme-neutral-600 text-sm leading-relaxed">
            Two stylized document forms in perfect equilibrium, connected by a comparison arrow. 
            Represents the core function of document analysis while maintaining visual harmony 
            and professional appeal.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-theme-secondary-600">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Function-focused</span>
          </div>
        </div>

        {/* Idea 3: The Modern Scale of Justice with a Digital Twist */}
        <div className="glass-panel p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
          <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-theme-accent-500 to-theme-accent-700 rounded-2xl mb-6 shadow-lg relative">
            <Scale className="w-14 h-14 text-white" />
            <div className="absolute bottom-3 right-3 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Type className="w-3 h-3 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-theme-primary-800 mb-3 font-serif">Digital Justice</h3>
          <p className="text-theme-neutral-600 text-sm leading-relaxed">
            A contemporary interpretation of the scales of justice, enhanced with digital elements. 
            Bridges traditional legal symbolism with modern technology, emphasizing fairness 
            and precision in document comparison.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-theme-accent-600">
            <Scale className="w-4 h-4" />
            <span>Heritage-focused</span>
          </div>
        </div>

        {/* Idea 4: The Precision Lens */}
        <div className="glass-panel p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
          <div className="w-28 h-28 flex items-center justify-center bg-gradient-to-br from-theme-primary-600 to-theme-primary-800 rounded-2xl mb-6 shadow-lg relative">
            <Search className="w-14 h-14 text-white opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white border-opacity-40 rounded-full flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <span className="text-white text-xs font-bold">+</span>
                  <span className="text-white text-xs font-bold opacity-60">/</span>
                  <span className="text-white text-xs font-bold">-</span>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-theme-primary-800 mb-3 font-serif">Precision Lens</h3>
          <p className="text-theme-neutral-600 text-sm leading-relaxed">
            A magnifying lens focused on document details, with diff symbols at its center. 
            Represents the meticulous analysis and attention to detail that defines 
            professional legal document review.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-theme-primary-600">
            <Eye className="w-4 h-4" />
            <span>Analysis-focused</span>
          </div>
        </div>
      </div>

      {/* Design Principles Section */}
      <div className="mt-16 w-full max-w-6xl">
        <h3 className="text-2xl font-semibold text-theme-primary-900 mb-8 text-center font-serif">Design Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-lg text-center">
            <Target className="w-8 h-8 text-theme-primary-600 mx-auto mb-4" />
            <h4 className="font-semibold text-theme-primary-800 mb-2">Precision</h4>
            <p className="text-sm text-theme-neutral-600">
              Each design emphasizes accuracy and attention to detail, core values in legal document analysis.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-lg text-center">
            <Zap className="w-8 h-8 text-theme-secondary-600 mx-auto mb-4" />
            <h4 className="font-semibold text-theme-primary-800 mb-2">Efficiency</h4>
            <p className="text-sm text-theme-neutral-600">
              Clean, uncluttered designs that communicate speed and professional competence.
            </p>
          </div>
          <div className="glass-panel p-6 rounded-lg text-center">
            <Scale className="w-8 h-8 text-theme-accent-600 mx-auto mb-4" />
            <h4 className="font-semibold text-theme-primary-800 mb-2">Trust</h4>
            <p className="text-sm text-theme-neutral-600">
              Professional aesthetics that inspire confidence in legal and corporate environments.
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="mt-12 glass-panel p-6 rounded-lg w-full max-w-4xl">
        <h4 className="font-semibold text-theme-primary-800 mb-4 text-center">Implementation Considerations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-theme-neutral-600">
          <div>
            <h5 className="font-medium text-theme-primary-700 mb-2">Scalability</h5>
            <p>All concepts work effectively from favicon size (16px) to large displays, maintaining clarity and recognition.</p>
          </div>
          <div>
            <h5 className="font-medium text-theme-primary-700 mb-2">Versatility</h5>
            <p>Designs adapt to different contexts: app icons, letterheads, business cards, and digital interfaces.</p>
          </div>
          <div>
            <h5 className="font-medium text-theme-primary-700 mb-2">Brand Consistency</h5>
            <p>Each concept can be extended into a complete visual identity system with consistent typography and color schemes.</p>
          </div>
          <div>
            <h5 className="font-medium text-theme-primary-700 mb-2">Professional Appeal</h5>
            <p>Sophisticated aesthetics appropriate for law firms, corporate legal departments, and professional service providers.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 text-center">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-theme-primary-600 text-white rounded-lg hover:bg-theme-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          ← Return to Application
        </a>
      </div>

      {/* Removal Instructions */}
      <div className="mt-8 text-center">
        <p className="text-xs text-theme-neutral-500 max-w-2xl">
          This is a temporary test page. To remove after testing: delete src/components/LogoShowcase.tsx, 
          src/pages/LogoTestPage.tsx, remove imports from App.tsx, and remove the "Logo Test" link from Header.tsx.
        </p>
      </div>
    </div>
  );
};