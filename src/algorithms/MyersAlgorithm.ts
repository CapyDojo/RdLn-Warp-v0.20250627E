import { DiffChange, ComparisonResult, ComparisonStats } from '../types';

const DEBUG_MODE = false;

export class MyersAlgorithm {
  private static readonly ABBREVIATIONS = new Set([
    'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'etc.', 'e.g.', 'i.e.',
    'St.', 'Ave.', 'Blvd.', 'Capt.', 'Cmdr.', 'Col.', 'Gen.', 'Gov.',
    'Hon.', 'Jr.', 'Sr.', 'Lt.', 'Sgt.', 'Rep.', 'Rev.', 'Sen.',
  ]);

  private static tokenize(text: string): string[] {
    if (text === null || text === undefined) {
        return [];
    }
    const tokens: string[] = [];
    let currentToken = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1] || '';

        if (/[\s]/.test(char)) {
            if (currentToken) {
                tokens.push(currentToken);
                currentToken = '';
            }
            tokens.push(char);
        } else if (/[.,;?!()"']/.test(char)) {
            if (currentToken) {
                const lastToken = tokens[tokens.length - 1];
                const potentialAbbr = currentToken + char;
                if (this.ABBREVIATIONS.has(potentialAbbr) && (nextChar === ' ' || nextChar === '' || nextChar === '\n')) {
                    currentToken += char;
                    continue;
                }
                tokens.push(currentToken);
                currentToken = '';
            }
            tokens.push(char);
        } else if (char === '-' && currentToken.length > 0 && /\d/.test(text[i - 1]) && /\d/.test(nextChar)) {
            currentToken += char;
        } else {
            currentToken += char;
        }
    }

    if (currentToken) {
        tokens.push(currentToken);
    }

    return tokens;
  }

  private static shouldTreatAsSubstitution(removed: string, added: string): boolean {
    const removedTrimmed = removed.trim();
    const addedTrimmed = added.trim();
    if (removedTrimmed.length === 0 || addedTrimmed.length === 0) return false;

    const lengthRatio = removedTrimmed.length > addedTrimmed.length
        ? addedTrimmed.length / removedTrimmed.length
        : removedTrimmed.length / addedTrimmed.length;

    return lengthRatio > 0.5;
  }

  private static preciseChunking(changes: Array<{type: string, content: string}>): Array<{type: string, content: string, originalContent?: string, revisedContent?: string}> {
    if (!changes || changes.length === 0) {
      return [];
    }

    const result: Array<{type: string, content: string, originalContent?: string, revisedContent?: string}> = [];
    let i = 0;

    while (i < changes.length) {
      const current = changes[i];

      if (current.type === 'removed' && i + 1 < changes.length) {
        let removedContent = '';
        let addedContent = '';
        let tempIndex = i;

        while (tempIndex < changes.length && changes[tempIndex].type === 'removed') {
          removedContent += changes[tempIndex].content;
          tempIndex++;
        }

        while (tempIndex < changes.length && changes[tempIndex].type === 'added') {
          addedContent += changes[tempIndex].content;
          tempIndex++;
        }

        if (removedContent && addedContent && this.shouldTreatAsSubstitution(removedContent, addedContent)) {
          result.push({
            type: 'changed',
            content: '',
            originalContent: removedContent,
            revisedContent: addedContent,
          });
          i = tempIndex;
          continue;
        }
      }

      result.push(current);
      i++;
    }

    return result;
  }

  private static backtrack(a: string[], b: string[], trace: Array<{ [key: number]: number }>, d: number): Array<{type: string, content: string}> {
    const changes: Array<{type: string, content: string}> = [];
    let x = a.length;
    let y = b.length;

    for (let i = d; i > 0; i--) {
        const v = trace[i];
        const v_prev = trace[i - 1];
        const k = x - y;

        let x_prev: number;
        let y_prev: number;

        const prev_k_plus_1 = v_prev[k + 1];
        const prev_k_minus_1 = v_prev[k - 1];

        if (k === -i || (k !== i && prev_k_minus_1 !== undefined && (prev_k_plus_1 === undefined || prev_k_minus_1 < prev_k_plus_1))) {
            x_prev = prev_k_plus_1;
            y_prev = prev_k_plus_1 - (k + 1);
        } else {
            x_prev = prev_k_minus_1 !== undefined ? prev_k_minus_1 + 1 : -1;
            y_prev = prev_k_minus_1 !== undefined ? prev_k_minus_1 - (k - 1) : -1;
        }

        while (x > x_prev && y > y_prev) {
            changes.unshift({ type: 'unchanged', content: a[x - 1] });
            x--;
            y--;
        }

        if (x !== x_prev || y !== y_prev) {
            if (x_prev < x) {
                changes.unshift({ type: 'removed', content: a[x - 1] });
                x--;
            } else {
                changes.unshift({ type: 'added', content: b[y - 1] });
                y--;
            }
        }
    }

    while (x > 0 && y > 0) {
        changes.unshift({ type: 'unchanged', content: a[x - 1] });
        x--;
        y--;
    }

    return changes;
  }

  private static myers(a: string[], b: string[]): Array<{type: string, content: string, originalContent?: string, revisedContent?: string}> {
    const n = a.length;
    const m = b.length;
    const max = n + m;
    
    const v: { [key: number]: number } = {};
    v[1] = 0;
    
    const trace: Array<{ [key: number]: number }> = [];
    
    for (let d = 0; d <= max; d++) {
      trace[d] = { ...v };
      
      for (let k = -d; k <= d; k += 2) {
        let x: number;
        
        if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
          x = v[k + 1];
        } else {
          x = v[k - 1] + 1;
        }
        
        let y = x - k;
        
        while (x < n && y < m && a[x] === b[y]) {
          x++;
          y++;
        }
        
        v[k] = x;
        
        if (x >= n && y >= m) {
          const rawChanges = this.backtrack(a, b, trace, d);
          return this.preciseChunking(rawChanges);
        }
      }
    }
    
    return [];
  }

  public static diff(original: string, revised: string): ComparisonResult {
    const originalTokens = this.tokenize(original);
    const revisedTokens = this.tokenize(revised);

    if (DEBUG_MODE) {
      console.log('Original Tokens:', originalTokens);
      console.log('Revised Tokens:', revisedTokens);
    }

    const changes = this.myers(originalTokens, revisedTokens);

    const stats: ComparisonStats = {
      additions: 0,
      deletions: 0,
      substitutions: 0,
      unchanged: 0,
    };

    changes.forEach(change => {
      if (change.type === 'added') stats.additions++;
      else if (change.type === 'removed') stats.deletions++;
      else if (change.type === 'changed') stats.substitutions++;
      else stats.unchanged++;
    });

    return { changes, stats };
  }
}
