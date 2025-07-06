import React from 'react';
import '../styles/cupping-test.css';

/**
 * Cupping Test Page
 * 
 * Visual investigation of different approaches to create concave "cupping" effects
 * for drag handles that embrace the panels above them.
 */
export const CuppingTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-theme-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-theme-neutral-900 mb-8">
          Concave Cupping Effect Investigation
        </h1>
        
        <div className="glass-panel rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-theme-neutral-900">Goal: Create Inward-Curving "Cup" Shape</h2>
          <p className="text-theme-neutral-700 mb-4">
            We want drag handles that curve <strong>inward</strong> at the top to "cup" or "cradle" 
            the panels above them, like a physical handle supporting an object.
          </p>
          <div className="bg-theme-accent-100 border-l-4 border-theme-accent-400 p-4">
            <p className="text-theme-accent-800">
              <strong>Challenge:</strong> CSS border-radius only creates convex (outward) curves. 
              We need concave (inward) curves.
            </p>
          </div>
        </div>

        <div className="cupping-tests">
          
          {/* Option 1: CSS clip-path polygon */}
          <div className="test-item">
            <div className="test-label">
              Option 1: CSS clip-path (polygon) - Angular concave
            </div>
            <div className="flex items-center gap-4">
              <div className="cupping-test-1"></div>
              <div className="text-sm text-theme-neutral-600">
                ✅ True concave shape<br/>
                ✅ Good browser support<br/>
                ❌ Angular (not smooth curves)
              </div>
            </div>
          </div>

          {/* Option 2: CSS clip-path with path() */}
          <div className="test-item">
            <div className="test-label">
              Option 2: CSS clip-path (SVG path) - Smooth concave curves
            </div>
            <div className="flex items-center gap-4">
              <div className="cupping-test-2"></div>
              <div className="text-sm text-theme-neutral-600">
                ✅ True smooth concave curves<br/>
                ✅ Perfect cupping shape<br/>
                ⚠️ Limited browser support for path()
              </div>
            </div>
          </div>

          {/* Option 3: Pseudo-elements */}
          <div className="test-item">
            <div className="test-label">
              Option 3: Pseudo-elements - Layered approach
            </div>
            <div className="flex items-center gap-4">
              <div className="cupping-test-3"></div>
              <div className="text-sm text-theme-neutral-600">
                ❌ Still convex curves<br/>
                ❌ Complex layering<br/>
                ❌ Breaks layouts
              </div>
            </div>
          </div>

          {/* Option 4: SVG mask */}
          <div className="test-item">
            <div className="test-label">
              Option 4: SVG mask - True curves with compatibility
            </div>
            <div className="flex items-center gap-4">
              <div className="cupping-test-4"></div>
              <div className="text-sm text-theme-neutral-600">
                ✅ Perfect smooth curves<br/>
                ✅ Good browser support<br/>
                ⚠️ More complex implementation
              </div>
            </div>
          </div>

          {/* Option 5: Box-shadow technique */}
          <div className="test-item">
            <div className="test-label">
              Option 5: Box-shadow - Fake concave illusion
            </div>
            <div className="flex items-center gap-4">
              <div className="cupping-test-5"></div>
              <div className="text-sm text-theme-neutral-600">
                ❌ Not true concave<br/>
                ❌ Visual tricks only<br/>
                ❌ Fragile implementation
              </div>
            </div>
          </div>

          {/* Mobile double cupping */}
          <div className="test-item">
            <div className="test-label">
              Mobile Special: Double cupping (top + bottom concave)
            </div>
            <div className="flex items-center gap-4">
              <div className="cupping-mobile-test"></div>
              <div className="text-sm text-theme-neutral-600">
                ✅ Cups both panels above/below<br/>
                ✅ Perfect for mobile handle<br/>
                ⚠️ Complex clip-path polygon
              </div>
            </div>
          </div>

        </div>

        {/* Recommendations */}
        <div className="glass-panel rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-theme-neutral-900">Recommendations</h2>
          
          <div className="space-y-4">
            <div className="border border-theme-secondary-300 bg-theme-secondary-100 p-4 rounded-lg">
              <h3 className="font-semibold text-theme-secondary-800 mb-2">✅ BEST: Option 1 - CSS clip-path (polygon)</h3>
              <p className="text-theme-secondary-700 text-sm">
                Good balance of true concave shape, browser support, and simplicity. 
                Angular corners are acceptable for a modern, clean design.
              </p>
            </div>
            
            <div className="border border-theme-primary-300 bg-theme-primary-100 p-4 rounded-lg">
              <h3 className="font-semibold text-theme-primary-800 mb-2">🎯 PREMIUM: Option 2 - CSS clip-path (SVG path)</h3>
              <p className="text-theme-primary-700 text-sm">
                Perfect smooth curves, but requires fallback for older browsers. 
                Consider progressive enhancement.
              </p>
            </div>
            
            <div className="border border-theme-accent-300 bg-theme-accent-100 p-4 rounded-lg">
              <h3 className="font-semibold text-theme-accent-800 mb-2">⚠️ ALTERNATIVE: Option 4 - SVG mask</h3>
              <p className="text-theme-accent-700 text-sm">
                Most compatible approach for perfect curves, but more complex to implement and maintain.
              </p>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="glass-panel rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-theme-neutral-900">Implementation Considerations</h2>
          <ul className="space-y-2 text-sm text-theme-neutral-700">
            <li>• <strong>Responsiveness:</strong> clip-path percentages work well with different handle widths</li>
            <li>• <strong>Themes:</strong> All approaches work with dynamic theme colors</li>
            <li>• <strong>Mobile:</strong> Double cupping for mobile handles between panels</li>
            <li>• <strong>Fallback:</strong> Regular rounded corners for unsupported browsers</li>
            <li>• <strong>Performance:</strong> clip-path is GPU-accelerated and performant</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
