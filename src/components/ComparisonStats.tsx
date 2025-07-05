import React from 'react';
import { BarChart3, Plus, Minus, FileText, RefreshCw } from 'lucide-react';

interface ComparisonStatsProps {
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
    changed: number;
    totalChanges: number;
  };
}

export const ComparisonStats: React.FC<ComparisonStatsProps> = ({ 
  stats
}) => {
  const total = stats.additions + stats.deletions + stats.unchanged + stats.changed;
  const additionPercent = total > 0 ? (stats.additions / total) * 100 : 0;
  const deletionPercent = total > 0 ? (stats.deletions / total) * 100 : 0;
  const changedPercent = total > 0 ? (stats.changed / total) * 100 : 0;

  return (
    <div className="glass-panel border border-theme-neutral-300 rounded-lg p-4 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-theme-primary-900" />
        <h3 className="text-lg font-semibold text-theme-primary-900">Comparison Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-theme-secondary-50 border border-theme-secondary-200 rounded p-3 subtle-button">
          <div className="flex items-center gap-2 text-theme-secondary-800">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Additions</span>
          </div>
          <div className="text-2xl font-bold text-theme-secondary-800">{stats.additions}</div>
          <div className="text-xs text-theme-secondary-600">{additionPercent.toFixed(1)}% of total</div>
        </div>
        
        <div className="bg-theme-accent-50 border border-theme-accent-200 rounded p-3 subtle-button">
          <div className="flex items-center gap-2 text-theme-accent-800">
            <Minus className="w-4 h-4" />
            <span className="text-sm font-medium">Deletions</span>
          </div>
          <div className="text-2xl font-bold text-theme-accent-800">{stats.deletions}</div>
          <div className="text-xs text-theme-accent-600">{deletionPercent.toFixed(1)}% of total</div>
        </div>
      </div>

      {stats.changed > 0 && (
        <div className="mb-4">
          <div className="bg-theme-accent-50 border border-theme-accent-200 rounded p-3 subtle-button">
            <div className="flex items-center gap-2 text-theme-accent-800">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Substitutions</span>
            </div>
            <div className="text-2xl font-bold text-theme-accent-800">{stats.changed}</div>
            <div className="text-xs text-theme-accent-600">{changedPercent.toFixed(1)}% of total</div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-theme-neutral-600">Total Changes:</span>
          <span className="font-semibold text-theme-accent-600">{stats.totalChanges}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-theme-neutral-600">Unchanged:</span>
          <span className="font-semibold text-theme-neutral-700">{stats.unchanged}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-theme-neutral-600">Total Elements:</span>
          <span className="font-semibold text-theme-primary-900">{total}</span>
        </div>
      </div>
      
      {/* Visual progress bar */}
      <div className="mt-4">
        <div className="flex rounded-full overflow-hidden h-2 bg-theme-neutral-200">
          <div 
            className="bg-theme-secondary-500" 
            style={{ width: `${additionPercent}%` }}
          ></div>
          <div 
            className="bg-theme-accent-500" 
            style={{ width: `${deletionPercent}%` }}
          ></div>
          <div 
            className="bg-theme-accent-500" 
            style={{ width: `${changedPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};