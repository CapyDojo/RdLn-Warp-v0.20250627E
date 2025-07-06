import React from 'react';
import { Settings, Zap, Image, Layout, Monitor, Smartphone, Maximize } from 'lucide-react';
import { useLayout, LayoutMode } from '../contexts/LayoutContext';

interface DeveloperModeCardProps {
  showAdvancedOcrCard?: boolean;
  showPerformanceDemoCard?: boolean;
  onToggleAdvancedOcr?: () => void;
  onTogglePerformanceDemo?: () => void;
}

export const DeveloperModeCard: React.FC<DeveloperModeCardProps> = ({
  showAdvancedOcrCard = true,
  showPerformanceDemoCard = true,
  onToggleAdvancedOcr,
  onTogglePerformanceDemo
}) => {
  const { currentLayout, setLayout, supportsContainerQueries } = useLayout();
  return (
    <div className="glass-panel border border-theme-neutral-300 rounded-lg p-4 shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold text-theme-primary-900 mb-2 flex items-center gap-2">
        <Settings className="w-5 h-5 text-theme-primary-900" aria-label="Developer Mode" />
        Developer Mode
      </h3>
      
      {/* Layout Testing Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-theme-neutral-700 mb-2 flex items-center gap-1">
          <Layout className="w-4 h-4" />
          Layout Experiments
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setLayout('current')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              currentLayout === 'current'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Current production layout (max-w-7xl)"
          >
            <Monitor className="w-3 h-3" />
            Current
          </button>
          
          <button
            onClick={() => setLayout('option-a')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              currentLayout === 'option-a'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Traditional responsive (95vw, max 1440px)"
          >
            <Smartphone className="w-3 h-3" />
            Responsive
          </button>
          
          <button
            onClick={() => setLayout('option-b')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              currentLayout === 'option-b'
                ? 'bg-purple-500 text-white'
                : supportsContainerQueries
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-red-200 text-red-700 cursor-not-allowed'
            }`}
            title={supportsContainerQueries ? "Container queries (smart containers)" : "Container queries not supported"}
            disabled={!supportsContainerQueries}
          >
            <Layout className="w-3 h-3" />
            Container
          </button>
          
          <button
            onClick={() => setLayout('option-c')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              currentLayout === 'option-c'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title="Disabled - use Current instead"
            disabled={true}
          >
            <Maximize className="w-3 h-3" />
            Disabled
          </button>
          
          <button
            onClick={() => setLayout('option-d')}
            className={`px-2 py-1.5 text-xs rounded transition-all flex items-center gap-1 ${
              currentLayout === 'option-d'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Hybrid: Responsive layout + Fluid scaling + smooth animations"
          >
            <span className="w-3 h-3">✨</span>
            Hybrid
          </button>
        </div>
        
        {/* Quick cycle button */}
        <button
          onClick={() => {
            const layouts: LayoutMode[] = ['current', 'option-a', 'option-b', 'option-d'];
            const filteredLayouts = layouts.filter(layout => 
              layout !== 'option-b' || supportsContainerQueries
            );
            const currentIndex = filteredLayouts.indexOf(currentLayout);
            const nextIndex = (currentIndex + 1) % filteredLayouts.length;
            setLayout(filteredLayouts[nextIndex]);
          }}
          className="mt-2 px-3 py-1 text-xs bg-theme-primary-100 hover:bg-theme-primary-200 text-theme-primary-700 rounded transition-all"
          title="Cycle through all available layouts"
        >
          🔄 Quick Cycle Layouts
        </button>
        
        {/* Current layout info */}
        <div className="mt-2 text-xs text-theme-neutral-600">
          Active: <span className="font-medium">{currentLayout}</span>
          {!supportsContainerQueries && (
            <span className="text-red-600 ml-2">⚠️ Container queries unsupported</span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        {onToggleAdvancedOcr && (
          <button
            onClick={onToggleAdvancedOcr}
            className={`px-2 py-1 text-xs rounded transition-all ${
              showAdvancedOcrCard 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            title="Toggle Advanced OCR card visibility"
            aria-label={`Toggle Advanced OCR card visibility ${showAdvancedOcrCard ? 'ON' : 'OFF'}`}
          >
            <Zap className="w-4 h-4" />
            <span className="ml-1">OCR {showAdvancedOcrCard ? 'ON' : 'OFF'}</span>
          </button>
        )}
        {onTogglePerformanceDemo && (
          <button
            onClick={onTogglePerformanceDemo}
            className={`px-2 py-1 text-xs rounded transition-all ${
              showPerformanceDemoCard 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            title="Toggle Performance Demo card visibility"
            aria-label={`Toggle Performance Demo card visibility ${showPerformanceDemoCard ? 'ON' : 'OFF'}`}
          >
            <Image className="w-4 h-4" />
            <span className="ml-1">Demo {showPerformanceDemoCard ? 'ON' : 'OFF'}</span>
          </button>
        )}
        <a 
          href="/logo-test" 
          className="px-3 py-2 bg-theme-primary-100/50 hover:bg-theme-primary-200/50 text-theme-primary-700 hover:text-theme-primary-800 text-sm font-medium rounded-lg border border-theme-primary-200/50 transition-all duration-200"
          title="View logo concept designs"
          aria-label="View logo concept designs"
        >
          Logo Test
        </a>
        <a 
          href="/cupping-test" 
          className="px-3 py-2 bg-theme-accent-100/50 hover:bg-theme-accent-200/50 text-theme-accent-700 hover:text-theme-accent-800 text-sm font-medium rounded-lg border border-theme-accent-200/50 transition-all duration-200"
          title="View cupping effect investigations"
          aria-label="View cupping effect investigations"
        >
          Cupping Test
        </a>
      </div>
    </div>
  );
};
