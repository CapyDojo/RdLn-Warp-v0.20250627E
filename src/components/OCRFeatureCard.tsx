import React from 'react';
import { Image, Globe } from 'lucide-react';
import { BaseComponentProps } from '../types/components';
import { useComponentPerformance } from '../utils/performanceUtils.tsx';

interface OCRFeatureCardProps extends BaseComponentProps {
  /** Whether to show the OCR feature card */
  visible?: boolean;
}

/**
 * OCR Feature Card Component
 * 
 * Displays information about the Advanced Multi-Language OCR capabilities.
 * Extracted from ComparisonInterface for better modularity and reusability.
 */
export const OCRFeatureCard: React.FC<OCRFeatureCardProps> = ({ 
  visible = true,
  style,
  className,
  ...props
}) => {
  // Performance monitoring setup
  const performanceTracker = useComponentPerformance(props, 'OCRFeatureCard', {
    category: 'ui',
    autoTrackRender: true
  });
  
  if (!visible) {
    performanceTracker.trackMetric('visibility_state', { visible: false });
    return null;
  }
  
  // Track visibility and render
  performanceTracker.trackMetric('visibility_state', { visible: true });

  return (
    <div className={`glass-panel border border-theme-primary-200 rounded-lg p-4 mb-6 shadow-lg transition-all duration-300 ${className || ''}`} style={style}>
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-theme-primary-600" />
          <Globe className="w-5 h-5 text-theme-secondary-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-theme-primary-900 mb-1">Advanced Multi-Language OCR</h3>
          <p className="text-sm text-theme-primary-700 mb-2">
            Take a screenshot of any document and paste it directly into the input areas. 
            The app will automatically detect the language and extract text using advanced OCR technology.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-theme-primary-600">
            <div>
              <strong>Supported Languages:</strong> English, Chinese (Simplified & Traditional), Spanish, French, German, Japanese, Korean, Arabic, Russian
            </div>
            <div>
              <strong>Features:</strong> Auto-detection, Manual selection, Legal terminology optimization, Smart formatting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
