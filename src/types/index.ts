export interface DiffChange {
  type: 'added' | 'removed' | 'unchanged' | 'changed';
  content: string; // For added, removed, unchanged
  originalContent?: string; // For 'changed' type - the original text
  revisedContent?: string; // For 'changed' type - the revised text
  index: number;
}

export interface ComparisonResult {
  changes: DiffChange[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
    changed: number; // New stat for changed items
    totalChanges: number;
  };
}

export interface ComparisonState {
  originalText: string;
  revisedText: string;
  result: ComparisonResult | null;
  isProcessing: boolean;
  error: string | null;
}