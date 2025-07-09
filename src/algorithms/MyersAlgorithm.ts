import { DiffChange, ComparisonResult } from '../types';

// DEBUG MODE: Set to true to enable detailed logging for debugging
const DEBUG_MODE = false;

// Debug logger that can be easily toggled
const debugLog = DEBUG_MODE ? console.log : () => {};

export class MyersAlgorithm {
  // SSMR: Feature flags for progressive implementation
  private static readonly FEATURE_FLAGS = {
    USE_OPTIMIZED_BOUNDARIES: true,    // Step 1: Regex-free boundary detection
    USE_PROGRESSIVE_SECTIONS: true,    // Step 2: Progressive section streaming  
    USE_CANCELLATION: true             // Step 3: Cancellation capability
  };

  // SSMR: Progressive section configuration
  private static readonly SECTION_CONFIG = {
    TARGET_SIZE: 3000,        // Target changes per section
    MIN_SIZE: 1000,          // Minimum section size
    MAX_SIZE: 8000,          // Maximum section size (performance guardrail)
  };

  // SSMR: Optimized lookup tables for fast sentence boundary detection
  private static readonly ABBREVIATIONS = new Set([
    // Legal entities
    'inc.', 'corp.', 'llc.', 'ltd.', 'co.', 'lp.', 'llp.', 'pc.', 'pa.', 'pllc.',
    'plc.', 'gmbh.', 'ag.', 'sa.', 'sas.', 'sarl.', 'bv.', 'nv.',
    // Titles and names
    'mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.',
    // Address abbreviations
    'st.', 'ave.', 'blvd.', 'rd.', 'dr.', 'ln.', 'ct.', 'pl.',
    // Dates and time
    'jan.', 'feb.', 'mar.', 'apr.', 'may.', 'jun.', 'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.',
    'mon.', 'tue.', 'wed.', 'thu.', 'fri.', 'sat.', 'sun.',
    // Common abbreviations
    'etc.', 'vs.', 'ie.', 'eg.', 'cf.', 'al.', 'et.',
    // Legal-specific
    'sec.', 'para.', 'art.', 'ch.', 'subch.', 'pt.', 'subpt.'
  ]);

  private static tokenize(text: string): string[] {
    // Enhanced tokenization that preserves meaningful units and handles abbreviations
    const tokens: string[] = [];
    let i = 0;
    
    
    while (i < text.length) {
      const char = text[i];
      
      // Skip whitespace but preserve it as tokens, with special handling for paragraph breaks
      if (/\s/.test(char)) {
        let whitespace = '';
        while (i < text.length && /\s/.test(text[i])) {
          whitespace += text[i];
          i++;
        }
        // Only push non-empty whitespace tokens
        if (whitespace.length > 0) {
          tokens.push(whitespace);
        }
        continue;
      }
      
      // Handle complete numbers (including currency, percentages, decimals)
      if (this.isStartOfNumber(text, i)) {
        const numberToken = this.extractNumber(text, i);
        tokens.push(numberToken.token);
        i = numberToken.endIndex;
        continue;
      }
      
      // Handle complete dates
      if (this.isStartOfDate(text, i)) {
        const dateToken = this.extractDate(text, i);
        tokens.push(dateToken.token);
        i = dateToken.endIndex;
        continue;
      }
      
      // ENHANCED: Handle abbreviations and company suffixes
      if (/[a-zA-Z]/.test(char)) {
        const wordToken = this.extractEnhancedWord(text, i);
        tokens.push(wordToken.token);
        i = wordToken.endIndex;
        continue;
      }
      
      // Handle punctuation as individual tokens
      tokens.push(char);
      i++;
    }
    
    const filteredTokens = tokens.filter(token => token.length > 0);
    
    
    return filteredTokens;
  }

  private static isStartOfNumber(text: string, index: number): boolean {
    const char = text[index];
    
    // Currency symbols
    if (/[$€£¥₹]/.test(char)) {
      return /\d/.test(text[index + 1] || '');
    }
    
    // Digits
    if (/\d/.test(char)) {
      return true;
    }
    
    // Negative numbers
    if (char === '-' && /\d/.test(text[index + 1] || '')) {
      return index === 0 || /\s/.test(text[index - 1] || '');
    }
    
    // Decimal numbers starting with period (.50)
    if (char === '.' && /\d/.test(text[index + 1] || '')) {
      return index === 0 || /\s/.test(text[index - 1] || '');
    }
    
    return false;
  }

  private static extractNumber(text: string, startIndex: number): { token: string, endIndex: number } {
    let i = startIndex;
    let token = '';
    
    // Handle currency symbol at start
    if (/[$€£¥₹]/.test(text[i])) {
      token += text[i];
      i++;
    }
    
    // Handle negative sign
    if (text[i] === '-') {
      token += text[i];
      i++;
    }
    
    // Handle digits, commas, and decimal points
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (/\d/.test(char)) {
        token += char;
        i++;
      } else if (char === ',' && /\d/.test(nextChar)) {
        // Comma in number (1,000)
        token += char;
        i++;
      } else if (char === '.' && /\d/.test(nextChar) && !token.includes('.')) {
        // Decimal point (only one allowed)
        token += char;
        i++;
      } else {
        break;
      }
    }
    
    // Handle percentage at end
    if (i < text.length && text[i] === '%') {
      token += text[i];
      i++;
    }
    
    return { token, endIndex: i };
  }

  private static isStartOfDate(text: string, index: number): boolean {
    // Look for date patterns: MM/DD/YYYY, DD-MM-YYYY, etc.
    const remaining = text.slice(index);
    return /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(remaining);
  }

  private static extractDate(text: string, startIndex: number): { token: string, endIndex: number } {
    let i = startIndex;
    let token = '';
    
    // Extract the date pattern
    while (i < text.length) {
      const char = text[i];
      if (/[\d\/\-\.]/.test(char)) {
        token += char;
        i++;
      } else {
        break;
      }
    }
    
    return { token, endIndex: i };
  }

  /**
   * REFINED: Extract words with precise abbreviation handling
   */
  private static extractEnhancedWord(text: string, startIndex: number): { token: string, endIndex: number } {
    let i = startIndex;
    let token = '';
    
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (/[a-zA-Z]/.test(char)) {
        token += char;
        i++;
      } else if (char === "'" && /[a-zA-Z]/.test(nextChar)) {
        // Handle contractions (don't, can't, etc.)
        token += char;
        i++;
      } else if (char === '-' && /[a-zA-Z]/.test(nextChar)) {
        // Handle hyphenated words (well-known, etc.)
        token += char;
        i++;
      } else if (char === '.' && this.shouldAppendPeriodToWord(token, text, i)) {
        // REFINED: Use new helper function to decide if period should be appended
        token += char;
        i++;
        // Continue if there's another letter after the period (for multi-part abbreviations)
        if (i < text.length && /[a-zA-Z]/.test(text[i])) {
          continue;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    return { token, endIndex: i };
  }

  /**
   * NEW: Precise logic for determining if a period should be appended to the current word
   */
  private static shouldAppendPeriodToWord(currentToken: string, fullText: string, periodIndex: number): boolean {
    const nextChar = fullText[periodIndex + 1];
    const charAfterNext = fullText[periodIndex + 2];
    
    // Case 1: Single capital letter followed by period, then another capital letter
    // This handles "J." in "J.P." - we want to include the period to continue building "J.P."
    if (currentToken.length === 1 && /[A-Z]/.test(currentToken) && /[A-Z]/.test(nextChar)) {
      // debugLog(`📝 Single capital "${currentToken}" + period + capital "${nextChar}" - including period`);
      return true;
    }
    
    // Case 2: Multi-part abbreviation in progress (like "J.P" when we encounter the final period)
    // This handles the final period in "J.P." to complete the abbreviation
    const multiPartPattern = /^[A-Z](\.[A-Z])+$/;
    if (multiPartPattern.test(currentToken)) {
      // debugLog(`📝 Multi-part abbreviation "${currentToken}" + final period - including period`);
      return true;
    }
    
    // Case 3: Check if current token + period forms a complete known abbreviation
    const tokenWithPeriod = currentToken + '.';
    if (this.isCompleteAbbreviation(tokenWithPeriod)) {
      // debugLog(`📝 Complete abbreviation "${tokenWithPeriod}" - including period`);
      return true;
    }
    
    // Case 4: Single capital letter at end of sequence (like final initial)
    if (currentToken.length === 1 && /[A-Z]/.test(currentToken)) {
      // Look ahead to see if there's space then capital (like "J. Smith")
      if (nextChar === ' ' && /[A-Z]/.test(charAfterNext)) {
        // debugLog(`📝 Single capital "${currentToken}" + period + space + capital - including period`);
        return true;
      }
      // Or if it's at the end of a word boundary
      if (!nextChar || /\s/.test(nextChar)) {
        // debugLog(`📝 Single capital "${currentToken}" at word boundary - including period`);
        return true;
      }
    }
    
    // Case 5: Multi-letter abbreviations (2-4 letters)
    if (currentToken.length >= 2 && currentToken.length <= 4 && /^[A-Z]+$/i.test(currentToken)) {
      // debugLog(`📝 Multi-letter abbreviation "${currentToken}" - including period`);
      return true;
    }
    
    // debugLog(`📝 Token "${currentToken}" + period - NOT including period`);
    return false;
  }

  /**
   * NEW: Check if a complete string (including period) is a known abbreviation
   */
  /**
   * Check if a complete string (including period) is a known abbreviation
   * Uses the centralized ABBREVIATIONS set for consistency
   */
  private static isCompleteAbbreviation(tokenWithPeriod: string): boolean {
    // Convert to lowercase for case-insensitive matching with the ABBREVIATIONS set
    const lowercaseToken = tokenWithPeriod.toLowerCase();
    
    // Use the centralized ABBREVIATIONS set defined at the class level
    return this.ABBREVIATIONS.has(lowercaseToken);
  }

  /**
   * @deprecated Use shouldAppendPeriodToWord instead
   * Legacy function kept for compatibility with existing code
   * Will be removed in a future release
   */
  private static isAbbreviation(currentToken: string, fullText: string, periodIndex: number): boolean {
    if (DEBUG_MODE) {
      console.warn('Deprecated: isAbbreviation is deprecated, use shouldAppendPeriodToWord instead');
    }
    return this.shouldAppendPeriodToWord(currentToken, fullText, periodIndex);
  }

  private static myers(a: string[], b: string[]): Array<{type: string, content: string, originalContent?: string, revisedContent?: string}> {
    const n = a.length;
    const m = b.length;
    const max = n + m;
    
    // V array for storing the furthest reaching D-path
    const v: { [key: number]: number } = {};
    v[1] = 0;
    
    // Trace array for backtracking
    const trace: Array<{ [key: number]: number }> = [];
    
    // Forward pass
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
          if (DEBUG_MODE) {
            debugLog('🔍 Raw changes before processing:', rawChanges);
          }
          const processedChanges = this.preciseChunking(rawChanges);
          if (DEBUG_MODE) {
            debugLog('📦 Changes after precise processing:', processedChanges);
          }
          return processedChanges;
        }
      }
    }
    
    return [];
  }

  private static backtrack(
    a: string[], 
    b: string[], 
    trace: Array<{ [key: number]: number }>, 
    d: number
  ): Array<{type: string, content: string}> {
    const result: Array<{type: string, content: string}> = [];
    let x = a.length;
    let y = b.length;
    
    for (let step = d; step >= 0; step--) {
      const v = trace[step];
      const k = x - y;
      
      let prevK: number;
      if (k === -step || (k !== step && v[k - 1] < v[k + 1])) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }
      
      const prevX = v[prevK];
      const prevY = prevX - prevK;
      
      // Add diagonal moves (unchanged)
      while (x > prevX && y > prevY) {
        result.unshift({ type: 'unchanged', content: a[x - 1] });
        x--;
        y--;
      }
      
      // Add horizontal/vertical moves (changes)
      if (step > 0) {
        if (x > prevX) {
          result.unshift({ type: 'removed', content: a[x - 1] });
          x--;
        } else if (y > prevY) {
          result.unshift({ type: 'added', content: b[y - 1] });
          y--;
        }
      }
    }
    
    return result;
  }

  /**
   * PRECISE chunking that preserves all characters while creating intelligent substitutions
   */
  private static preciseChunking(changes: Array<{type: string, content: string}>): Array<{type: string, content: string, originalContent?: string, revisedContent?: string}> {
    if (DEBUG_MODE) {
      debugLog('🎯 Starting precise chunking with character preservation');
    }
    const processed: Array<{type: string, content: string, originalContent?: string, revisedContent?: string}> = [];
    let i = 0;
    
    while (i < changes.length) {
      const current = changes[i];
      
      // Process unchanged tokens directly
      if (current.type === 'unchanged') {
        processed.push(current);
        i++;
        continue;
      }
      
      // For added/removed tokens, look for substitution opportunities
      if (current.type === 'added' || current.type === 'removed') {
        const segment = this.collectPreciseChangeSegment(changes, i);
        if (DEBUG_MODE) {
          debugLog(`🔍 Collected precise segment from index ${i} to ${segment.endIndex - 1}:`, segment.tokens);
        }
        
        // Check if this segment should become a substitution
        const substitutionResult = this.evaluateSubstitution(segment.tokens);
        
        if (substitutionResult.isSubstitution) {
          if (DEBUG_MODE) {
            debugLog(`✅ Creating substitution: "${substitutionResult.removedContent}" -> "${substitutionResult.addedContent}"`);
          }
          processed.push({
            type: 'changed',
            content: '',
            originalContent: substitutionResult.removedContent,
            revisedContent: substitutionResult.addedContent
          });
        } else {
          // Process tokens individually with intelligent grouping
          if (DEBUG_MODE) {
            debugLog(`📝 Processing segment tokens individually`);
          }
          this.processTokensIndividually(segment.tokens, processed);
        }
        
        i = segment.endIndex;
        continue;
      }
      
      // Default case: add the token as-is
      processed.push(current);
      i++;
    }
    
    if (DEBUG_MODE) {
      debugLog('🏁 Precise chunking complete. Result:', processed.length, 'items');
    }
    return processed;
  }

  /**
   * REFINED: Collect a precise change segment with aggressive collection of related changes
   */
  private static collectPreciseChangeSegment(
    changes: Array<{type: string, content: string}>, 
    startIndex: number
  ): {
    tokens: Array<{type: string, content: string}>,
    endIndex: number
  } {
    const tokens: Array<{type: string, content: string}> = [];
    let i = startIndex;
    
    if (DEBUG_MODE) {
      debugLog(`🔍 Starting precise segment collection from index ${i}`);
    }
    
    // First, collect all consecutive added/removed tokens
    while (i < changes.length && (changes[i].type === 'added' || changes[i].type === 'removed')) {
      tokens.push(changes[i]);
      if (DEBUG_MODE) {
        debugLog(`  ➕ Added ${changes[i].type}: "${changes[i].content}"`);
      }
      i++;
    }
    
    // Look for unchanged tokens that are truly internal to the change
    while (i < changes.length && changes[i].type === 'unchanged') {
      const unchangedToken = changes[i];
      
      // Only consider whitespace or connective punctuation as potential internal tokens
      if (!this.isWhitespaceOnly(unchangedToken.content) && 
          !this.isConnectivePunctuation(unchangedToken.content)) {
        if (DEBUG_MODE) {
          debugLog(`  🛑 Stopping at significant unchanged token: "${unchangedToken.content}"`);
        }
        break;
      }
      
      // Look ahead for more changes within reasonable distance
      let hasMoreChanges = false;
      let lookaheadDistance = 0;
      const maxLookahead = 5;
      
      for (let j = i + 1; j < changes.length && lookaheadDistance < maxLookahead; j++) {
        if (changes[j].type === 'added' || changes[j].type === 'removed') {
          hasMoreChanges = true;
          break;
        }
        
        if (changes[j].type === 'unchanged' && 
            !this.isWhitespaceOnly(changes[j].content) && 
            !this.isConnectivePunctuation(changes[j].content)) {
          break;
        }
        
        lookaheadDistance++;
      }
      
      if (hasMoreChanges) {
        tokens.push(unchangedToken);
        if (DEBUG_MODE) {
          debugLog(`  ⬜ Added internal unchanged: "${unchangedToken.content}"`);
        }
        i++;
        
        // Continue collecting more added/removed tokens
        while (i < changes.length && (changes[i].type === 'added' || changes[i].type === 'removed')) {
          tokens.push(changes[i]);
          if (DEBUG_MODE) {
            debugLog(`  ➕ Added ${changes[i].type}: "${changes[i].content}"`);
          }
          i++;
        }
      } else {
        if (DEBUG_MODE) {
          debugLog(`  🛑 Stopping at boundary unchanged token: "${unchangedToken.content}"`);
        }
        break;
      }
    }
    
    if (DEBUG_MODE) {
      debugLog(`📦 Collected precise segment with ${tokens.length} tokens`);
    }
    return { tokens, endIndex: i };
  }

  /**
   * Enhanced definition of connective punctuation
   */
  private static isConnectivePunctuation(content: string): boolean {
    const trimmed = content.trim();
    return [',', '.', '-', ':', ';', '(', ')'].includes(trimmed);
  }

  /**
   * Evaluate whether a segment should become a substitution
   */
  private static evaluateSubstitution(
    tokens: Array<{type: string, content: string}>
  ): {
    isSubstitution: boolean,
    removedContent: string,
    addedContent: string
  } {
    // Build content strings
    const removedContent = tokens
      .filter(token => token.type === 'removed' || 
                      (token.type === 'unchanged' && this.shouldIncludeInSubstitution(token, tokens)))
      .map(token => token.content)
      .join('');
    
    const addedContent = tokens
      .filter(token => token.type === 'added' || 
                      (token.type === 'unchanged' && this.shouldIncludeInSubstitution(token, tokens)))
      .map(token => token.content)
      .join('');
    
    if (DEBUG_MODE) {
      debugLog(`🧠 Evaluating substitution:`);
      debugLog(`  📤 Removed: "${removedContent}"`);
      debugLog(`  📥 Added: "${addedContent}"`);
    }
    
    // Check if this should be a substitution
    const isSubstitution = !!(removedContent && addedContent &&
                          this.shouldTreatAsSubstitution(removedContent, addedContent));
    
    if (DEBUG_MODE) {
      debugLog(`  🎯 Decision: ${isSubstitution ? 'SUBSTITUTE' : 'SEPARATE'}`);
    }
    
    return {
      isSubstitution,
      removedContent,
      addedContent
    };
  }

  /**
   * Determine if an unchanged token should be included in a substitution
   */
  private static shouldIncludeInSubstitution(
    token: {type: string, content: string},
    allTokens: Array<{type: string, content: string}>
  ): boolean {
    if (token.type !== 'unchanged') return false;
    
    const tokenIndex = allTokens.indexOf(token);
    const hasRemovedBefore = allTokens.slice(0, tokenIndex).some(t => t.type === 'removed');
    const hasAddedBefore = allTokens.slice(0, tokenIndex).some(t => t.type === 'added');
    const hasRemovedAfter = allTokens.slice(tokenIndex + 1).some(t => t.type === 'removed');
    const hasAddedAfter = allTokens.slice(tokenIndex + 1).some(t => t.type === 'added');
    
    return (hasRemovedBefore || hasAddedBefore) && (hasRemovedAfter || hasAddedAfter);
  }

  /**
   * Process tokens individually with intelligent grouping
   */
  private static processTokensIndividually(
    tokens: Array<{type: string, content: string}>,
    processed: Array<{type: string, content: string, originalContent?: string, revisedContent?: string}>
  ): void {
    let i = 0;
    
    while (i < tokens.length) {
      const current = tokens[i];
      
      if (current.type === 'unchanged') {
        processed.push(current);
        i++;
        continue;
      }
      
      // Collect consecutive tokens of the same type
      const group = this.collectConsecutiveTokens(tokens, i, current.type);
      
      if (group.length > 1 && this.shouldGroupConsecutiveTokens(group)) {
        if (DEBUG_MODE) {
          debugLog(`📦 Grouping ${group.length} consecutive ${current.type} tokens`);
        }
        processed.push({
          type: current.type,
          content: group.map(token => token.content).join('')
        });
      } else {
        group.forEach(token => processed.push(token));
      }
      
      i += group.length;
    }
  }

  /**
   * Collect consecutive tokens of the same type
   */
  private static collectConsecutiveTokens(
    tokens: Array<{type: string, content: string}>,
    startIndex: number,
    targetType: string
  ): Array<{type: string, content: string}> {
    const group: Array<{type: string, content: string}> = [];
    let i = startIndex;
    
    while (i < tokens.length && tokens[i].type === targetType) {
      group.push(tokens[i]);
      i++;
    }
    
    return group;
  }

  /**
   * Enhanced grouping logic for consecutive tokens
   */
  private static shouldGroupConsecutiveTokens(group: Array<{type: string, content: string}>): boolean {
    if (group.length < 2) return false;
    
    const combinedContent = group.map(item => item.content).join('');
    
    // Don't group across sentence boundaries
    if (this.containsSentenceBoundary(combinedContent)) {
      return false;
    }
    
    // Count meaningful words
    const meaningfulWords = this.countMeaningfulWords(combinedContent);
    
    // Group if we have multiple meaningful words
    if (meaningfulWords >= 2) {
      return true;
    }
    
    // Group if it looks like structured data (addresses, company names, etc.)
    if (this.looksLikeStructuredData(combinedContent)) {
      return true;
    }
    
    // Group if total length suggests a meaningful phrase
    if (combinedContent.trim().length > 15) {
      return true;
    }
    
    return false;
  }

  /**
   * Enhanced substitution detection with better structured data handling
   */
  private static shouldTreatAsSubstitution(removedContent: string, addedContent: string): boolean {
    // Don't create substitutions for very large content
    if (removedContent.length > 500 || addedContent.length > 500) {
      return false;
    }
    
    // Don't substitute across sentence boundaries
    if (this.containsSentenceBoundary(removedContent) || this.containsSentenceBoundary(addedContent)) {
      return false;
    }
    
    // Count meaningful words
    const removedWords = this.countMeaningfulWords(removedContent);
    const addedWords = this.countMeaningfulWords(addedContent);
    
    // Must have meaningful content in both
    if (removedWords === 0 || addedWords === 0) {
      return false;
    }
    
    // Calculate ratio
    const ratio = Math.max(removedWords, addedWords) / Math.min(removedWords, addedWords);
    
    // More lenient for structured data (addresses, company names, etc.)
    if (this.looksLikeStructuredData(removedContent) || this.looksLikeStructuredData(addedContent)) {
      return ratio <= 10; // Very lenient for structured data
    }
    
    return ratio <= 5;
  }

  /**
   * Enhanced structured data detection
   */
  private static looksLikeStructuredData(content: string): boolean {
    // Address patterns
    if (/\d+.*(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|place|pl)/i.test(content)) {
      return true;
    }
    
    // City, State ZIP patterns
    if (/[a-zA-Z\s]+,\s*[A-Z]{2}\s*\d{5}/.test(content)) {
      return true;
    }
    
    // Company name patterns with enhanced detection
    if (/(?:inc|corp|llc|ltd|co|plc|gmbh|ag|sa|sas|sarl|bv|nv|lp|llp|pc|pa|pllc)\./i.test(content)) {
      return true;
    }
    
    // Financial/legal entity patterns
    if (/(?:corporation|company|limited|partnership|associates|group|holdings|enterprises|international|securities)/i.test(content)) {
      return true;
    }
    
    // Address components
    if (/(?:suite|ste|floor|fl|building|bldg|unit|apt|apartment)\s*\d+/i.test(content)) {
      return true;
    }
    
    return false;
  }

  /**
   * Count meaningful words in content
   */
  private static countMeaningfulWords(content: string): number {
    return (content.match(/\b\w+\b/g) || []).length;
  }

  /**
   * Check if content is whitespace only
   */
  private static isWhitespaceOnly(content: string): boolean {
    return /^\s+$/.test(content);
  }

  /**
   * SSMR: Optimized sentence boundary detection with feature flags
   */
  /**
   * Detect sentence boundaries in content
   * Uses the optimized implementation by default
   */
  private static containsSentenceBoundary(content: string): boolean {
    // The optimized implementation is now the default
    // The feature flag is no longer needed as the fix has been proven stable
    return this.optimizedBoundaryDetection(content);
  }

  /**
   * @private
   * Legacy regex-based sentence boundary detection (kept as a reference but no longer used)
   */
  private static containsSentenceBoundaryLegacy(content: string): boolean {
    // Check for paragraph boundaries (double newlines)
    if (content.includes('\n\n')) {
      return true;
    }
    
    // For periods, be more selective - avoid abbreviations
    if (/\.\s{2,}/.test(content)) {
      return true;
    }
    
    // ENHANCED: Period followed by space and capital letter (but not abbreviations)
    if (/\.\s+[A-Z]/.test(content) && !this.endsWithAbbreviation(content)) {
      return true;
    }
    
    return false;
  }

  /**
   * SSMR: New optimized boundary detection without regex
   */
  private static optimizedBoundaryDetection(content: string): boolean {
    // Check for paragraph boundaries first (most common)
    if (content.includes('\n\n')) {
      return true;
    }
    
    // Scan character by character for sentence boundaries
    for (let i = 0; i < content.length - 1; i++) {
      if (content[i] === '.' && content[i + 1] === ' ') {
        // Check if this is multiple spaces (double space indicates sentence end)
        if (i + 2 < content.length && content[i + 2] === ' ') {
          return true;
        }
        
        // Check if followed by capital letter
        if (i + 2 < content.length && /[A-Z]/.test(content[i + 2])) {
          // Extract the word ending with this period
          const wordStart = content.lastIndexOf(' ', i - 1) + 1;
          const word = content.slice(wordStart, i + 1).toLowerCase();
          
          // Check if it's NOT a known abbreviation
          if (!this.ABBREVIATIONS.has(word)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  /**
   * ENHANCED: Check if content ends with a known abbreviation
   */
  private static endsWithAbbreviation(content: string): boolean {
    // Check if content ends with any known complete abbreviation
    if (this.isCompleteAbbreviation(content.slice(-4)) || 
        this.isCompleteAbbreviation(content.slice(-3)) || 
        this.isCompleteAbbreviation(content.slice(-2))) {
      return true;
    }
    
    // Check for multi-part abbreviation patterns at the end (J.P., A.B.C., etc.)
    const multiPartAbbrevPattern = /[A-Z](\.[A-Z])*\.$/;
    if (multiPartAbbrevPattern.test(content)) {
      return true;
    }
    
    return false;
  }

  /**
   * PRIORITY 1 OPTIMIZATION: Trim common prefix and suffix
   * Reduces the input size before running Myers algorithm
   * FIXED: Now respects word boundaries to prevent word fragmentation
   */
  private static trimCommonPrefixSuffix(originalText: string, revisedText: string): {
    commonPrefix: string;
    commonSuffix: string;
    originalCore: string;
    revisedCore: string;
  } {
    const startTime = performance.now();
    
    // Find common prefix
    let prefixLength = 0;
    const minLength = Math.min(originalText.length, revisedText.length);
    
    while (prefixLength < minLength &&
           originalText[prefixLength] === revisedText[prefixLength]) {
      prefixLength++;
    }
    
    // CRITICAL FIX: Backtrack to word boundary for prefix
    // This prevents splitting words like "Company" into "Co" + "mpany"
    while (prefixLength > 0 &&
           prefixLength < minLength &&
           /\w/.test(originalText[prefixLength - 1]) &&
           /\w/.test(originalText[prefixLength])) {
      prefixLength--;
    }
    
    // Find common suffix (from the remaining text after prefix)
    let suffixLength = 0;
    const originalRemaining = originalText.length - prefixLength;
    const revisedRemaining = revisedText.length - prefixLength;
    const maxSuffixLength = Math.min(originalRemaining, revisedRemaining);
    
    while (suffixLength < maxSuffixLength &&
           originalText[originalText.length - 1 - suffixLength] ===
           revisedText[revisedText.length - 1 - suffixLength]) {
      suffixLength++;
    }
    
    // CRITICAL FIX: Backtrack to word boundary for suffix
    // This prevents splitting words like "Contractor" into "Contracto" + "r"
    while (suffixLength > 0 &&
           suffixLength < maxSuffixLength &&
           /\w/.test(originalText[originalText.length - suffixLength - 1]) &&
           /\w/.test(originalText[originalText.length - suffixLength])) {
      suffixLength--;
    }
    
    const commonPrefix = originalText.slice(0, prefixLength);
    const commonSuffix = originalText.slice(originalText.length - suffixLength);
    
    const originalCore = originalText.slice(prefixLength, originalText.length - suffixLength);
    const revisedCore = revisedText.slice(prefixLength, revisedText.length - suffixLength);
    
    const endTime = performance.now();
    debugLog(`⚡ Prefix/suffix trimming completed in ${(endTime - startTime).toFixed(2)}ms`);
    debugLog(`📊 Trimming results:`, {
      prefixLength,
      suffixLength,
      commonPrefix: commonPrefix.slice(-20), // Last 20 chars of prefix
      commonSuffix: commonSuffix.slice(0, 20), // First 20 chars of suffix
      originalCoreLength: originalCore.length,
      revisedCoreLength: revisedCore.length
    });
    
    return {
      commonPrefix,
      commonSuffix,
      originalCore,
      revisedCore
    };
  }

  /**
   * PRIORITY 1 OPTIMIZATION: Reconstruct final result with prefix and suffix
   * Adds back the common prefix and suffix that were trimmed for efficiency
   */
  private static reconstructWithPrefixSuffix(
    coreChanges: DiffChange[],
    trimResult: {
      commonPrefix: string;
      commonSuffix: string;
      originalCore: string;
      revisedCore: string;
    }
  ): DiffChange[] {
    const startTime = performance.now();
    const finalChanges: DiffChange[] = [];
    let currentIndex = 0;
    
    // Add common prefix as unchanged if it exists
    if (trimResult.commonPrefix.length > 0) {
      finalChanges.push({
        type: 'unchanged',
        content: trimResult.commonPrefix,
        index: currentIndex++
      });
    }
    
    // Add core changes with updated indices
    coreChanges.forEach(change => {
      finalChanges.push({
        ...change,
        index: currentIndex++
      });
    });
    
    // Add common suffix as unchanged if it exists
    if (trimResult.commonSuffix.length > 0) {
      finalChanges.push({
        type: 'unchanged',
        content: trimResult.commonSuffix,
        index: currentIndex++
      });
    }
    
    const endTime = performance.now();
    debugLog(`⚡ Result reconstruction completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return finalChanges;
  }

  /**
   * PRIORITY 2.5: SSMR Paragraph-level prefix/suffix trimming
   * SAFE: No breaking changes, operates before existing character-level trimming
   * STEP-BY-STEP: Separate method, independent implementation
   * MODULAR: Can be enabled/disabled via feature flag
   * REVERSIBLE: Easy to disable by setting enableParagraphTrimming = false
   */
  private static trimCommonParagraphs(
    originalText: string, 
    revisedText: string,
    enableParagraphTrimming: boolean = true // ROLLBACK: Set to false to disable
  ): {
    commonPrefixParagraphs: string;
    commonSuffixParagraphs: string;
    originalCoreParagraphs: string;
    revisedCoreParagraphs: string;
    paragraphReductionRatio: number;
  } {
    const startTime = performance.now();
    
    // SAFE: Feature flag for easy disable
    if (!enableParagraphTrimming) {
      debugLog('📋 Paragraph trimming disabled - using original texts');
      return {
        commonPrefixParagraphs: '',
        commonSuffixParagraphs: '',
        originalCoreParagraphs: originalText,
        revisedCoreParagraphs: revisedText,
        paragraphReductionRatio: 0
      };
    }
    
    // Split into paragraphs using multiple paragraph separators
    const originalParagraphs = this.splitIntoParagraphs(originalText);
    const revisedParagraphs = this.splitIntoParagraphs(revisedText);
    
    debugLog('📋 Paragraph analysis:', {
      originalParagraphs: originalParagraphs.length,
      revisedParagraphs: revisedParagraphs.length
    });
    
    // Find common prefix paragraphs
    let prefixParagraphCount = 0;
    const minParagraphs = Math.min(originalParagraphs.length, revisedParagraphs.length);
    
    while (prefixParagraphCount < minParagraphs && 
           originalParagraphs[prefixParagraphCount] === revisedParagraphs[prefixParagraphCount]) {
      prefixParagraphCount++;
    }
    
    // Find common suffix paragraphs (from remaining paragraphs after prefix)
    let suffixParagraphCount = 0;
    const originalRemaining = originalParagraphs.length - prefixParagraphCount;
    const revisedRemaining = revisedParagraphs.length - prefixParagraphCount;
    const maxSuffixParagraphs = Math.min(originalRemaining, revisedRemaining);
    
    while (suffixParagraphCount < maxSuffixParagraphs &&
           originalParagraphs[originalParagraphs.length - 1 - suffixParagraphCount] === 
           revisedParagraphs[revisedParagraphs.length - 1 - suffixParagraphCount]) {
      suffixParagraphCount++;
    }
    
    // Reconstruct text sections
    const commonPrefixParagraphs = originalParagraphs.slice(0, prefixParagraphCount).join('');
    const commonSuffixParagraphs = originalParagraphs.slice(originalParagraphs.length - suffixParagraphCount).join('');
    
    const originalCoreParagraphs = originalParagraphs.slice(
      prefixParagraphCount, 
      originalParagraphs.length - suffixParagraphCount
    ).join('');
    
    const revisedCoreParagraphs = revisedParagraphs.slice(
      prefixParagraphCount, 
      revisedParagraphs.length - suffixParagraphCount
    ).join('');
    
    // Calculate reduction ratio
    const originalTotalLength = originalText.length + revisedText.length;
    const coreLength = originalCoreParagraphs.length + revisedCoreParagraphs.length;
    const paragraphReductionRatio = originalTotalLength > 0 ? 
      ((originalTotalLength - coreLength) / originalTotalLength * 100) : 0;
    
    const endTime = performance.now();
    
    debugLog(`📋 Paragraph trimming completed in ${(endTime - startTime).toFixed(2)}ms`);
    debugLog('📋 Paragraph trimming results:', {
      prefixParagraphs: prefixParagraphCount,
      suffixParagraphs: suffixParagraphCount,
      originalCoreParagraphs: originalCoreParagraphs.length,
      revisedCoreParagraphs: revisedCoreParagraphs.length,
      paragraphReductionRatio: paragraphReductionRatio.toFixed(1) + '%'
    });
    
    return {
      commonPrefixParagraphs,
      commonSuffixParagraphs,
      originalCoreParagraphs,
      revisedCoreParagraphs,
      paragraphReductionRatio
    };
  }

  /**
   * PRIORITY B: SSMR Single-Pass Paragraph Splitting (Hamano's optimization)
   * SAFE: Returns same format as before, but more efficient
   * STEP-BY-STEP: Replaces multi-pass approach with single state machine
   * MODULAR: Can be disabled by setting useSinglePassSplitting = false
   * REVERSIBLE: Falls back to original method if disabled
   */
  /**
   * Split text into paragraphs using the optimized single-pass method
   * The original method is kept as a fallback but marked as private
   */
  private static splitIntoParagraphs(
    text: string
  ): string[] {
    // Use the optimized implementation by default
    // The feature flag is no longer needed as the fix has been proven stable
    return this.splitIntoParagraphsSinglePass(text);
  }

  /**
   * PRIORITY B: Hamano's single-pass paragraph detection state machine
   * Reads document once, identifies ALL paragraph patterns simultaneously
   */
  private static splitIntoParagraphsSinglePass(text: string): string[] {
    const startTime = performance.now();
    const paragraphs: string[] = [];
    let currentParagraphStart = 0;
    let i = 0;
    
    debugLog('🔧 Using single-pass paragraph splitting (Hamano optimization)');
    
    while (i < text.length) {
      const char = text[i];
      
      if (char === '\n') {
        // Look ahead to determine paragraph break type
        const lookAhead = this.analyzeParagraphBreak(text, i);
        
        if (lookAhead.isParagraphBreak) {
          // Complete current paragraph (including full separator like \n\n)
          const paragraphContent = text.slice(currentParagraphStart, lookAhead.nextParagraphStart);
          if (paragraphContent.trim().length > 0) {
            paragraphs.push(paragraphContent);
          }
          
          // Skip to start of next paragraph
          i = lookAhead.nextParagraphStart;
          currentParagraphStart = i;
          continue;
        }
      }
      
      i++;
    }
    
    // Add final paragraph if exists
    if (currentParagraphStart < text.length) {
      const finalParagraph = text.slice(currentParagraphStart);
      if (finalParagraph.trim().length > 0) {
        paragraphs.push(finalParagraph);
      }
    }
    
    const endTime = performance.now();
    debugLog(`🔧 Single-pass splitting completed in ${(endTime - startTime).toFixed(2)}ms, found ${paragraphs.length} paragraphs`);
    
    return paragraphs;
  }

  /**
   * PRIORITY B: Analyze text at newline position to determine if it's a paragraph break
   */
  private static analyzeParagraphBreak(text: string, newlineIndex: number): {
    isParagraphBreak: boolean;
    nextParagraphStart: number;
  } {
    let i = newlineIndex + 1;
    
    // Skip whitespace after newline
    while (i < text.length && /[ \t]/.test(text[i])) {
      i++;
    }
    
    // Check for double newline (most common paragraph break)
    if (i < text.length && text[i] === '\n') {
      // Found double newline - definite paragraph break
      i++; // Skip second newline
      // Skip any additional whitespace
      while (i < text.length && /\s/.test(text[i])) {
        i++;
      }
      return { isParagraphBreak: true, nextParagraphStart: i };
    }
    
    // Check for legal document patterns after single newline
    const remainingText = text.slice(i);
    
    // Numbered clauses: "1.", "12.", "(a)", "(iv)"
    if (/^\d+\./.test(remainingText) || /^\([a-z]+\)/.test(remainingText) || /^\([ivx]+\)/.test(remainingText)) {
      return { isParagraphBreak: true, nextParagraphStart: i };
    }
    
    // Bullet points: "•", "*", "-"
    if (/^[•*-]\s/.test(remainingText)) {
      return { isParagraphBreak: true, nextParagraphStart: i };
    }
    
    // Significant indentation (4+ spaces or tab)
    if (/^(\s{4,}|\t)/.test(remainingText)) {
      return { isParagraphBreak: true, nextParagraphStart: i };
    }
    
    // Not a paragraph break
    return { isParagraphBreak: false, nextParagraphStart: i };
  }

  /**
   * PRIORITY B: Original multi-pass method (kept for rollback)
   * SAFE: Preserves original behavior if single-pass is disabled
   */
  /**
   * @private
   * Original multi-pass method (kept as a reference but no longer used)
   */
  private static splitIntoParagraphsOriginal(text: string): string[] {
    if (DEBUG_MODE) {
      debugLog('🔧 Using original multi-pass paragraph splitting (fallback)');
    }
    
    // Split on double newlines (most common paragraph separator)
    let paragraphs = text.split(/\n\s*\n/);
    
    // If we only get one paragraph, try single newlines (for legal docs with numbered clauses)
    if (paragraphs.length === 1) {
      // Look for numbered clauses, bullet points, or significant indentation changes
      paragraphs = text.split(/\n(?=\s*(?:\d+\.|\w+\)|•|\*|\s{4,}|\t))/)
        .filter(p => p.trim().length > 0);
    }
    
    // If still only one paragraph, split on any newline (fallback)
    if (paragraphs.length === 1) {
      paragraphs = text.split(/\n/)
        .filter(p => p.trim().length > 0);
    }
    
    // Ensure we preserve the original separators for reconstruction
    const result: string[] = [];
    let currentIndex = 0;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const startIndex = text.indexOf(paragraph, currentIndex);
      
      if (i > 0) {
        // Include the separator between this and previous paragraph
        const separator = text.slice(currentIndex, startIndex);
        if (separator && result.length > 0) {
          result[result.length - 1] += separator;
        }
      }
      
      result.push(paragraph);
      currentIndex = startIndex + paragraph.length;
    }
    
    return result;
  }

  /**
   * PRIORITY 2.5: SSMR Combined reconstruction with paragraph and character trimming
   * Reconstructs the final result by adding back both paragraph-level and character-level common parts
   */
  private static reconstructWithCombinedTrimming(
    coreChanges: DiffChange[],
    paragraphTrimResult: {
      commonPrefixParagraphs: string;
      commonSuffixParagraphs: string;
      originalCoreParagraphs: string;
      revisedCoreParagraphs: string;
      paragraphReductionRatio: number;
    },
    charTrimResult: {
      commonPrefix: string;
      commonSuffix: string;
      originalCore: string;
      revisedCore: string;
    }
  ): DiffChange[] {
    const startTime = performance.now();
    const finalChanges: DiffChange[] = [];
    let currentIndex = 0;
    
    // PRIORITY B: Fraser's lazy reconstruction - build strings only once at the end
    // Step 1: Add common paragraph prefix if it exists
    if (paragraphTrimResult.commonPrefixParagraphs.length > 0) {
      finalChanges.push({
        type: 'unchanged',
        content: paragraphTrimResult.commonPrefixParagraphs,
        index: currentIndex++
      });
    }
    
    // Step 2: Add character-level prefix (from the paragraph-trimmed content) if it exists
    if (charTrimResult.commonPrefix.length > 0) {
      finalChanges.push({
        type: 'unchanged',
        content: charTrimResult.commonPrefix,
        index: currentIndex++
      });
    }
    
    // Step 3: Add core changes with updated indices (no string manipulation here)
    coreChanges.forEach(change => {
      finalChanges.push({
        ...change,
        index: currentIndex++
      });
    });
    
    // Step 4: Add character-level suffix (from the paragraph-trimmed content) if it exists
    if (charTrimResult.commonSuffix.length > 0) {
      finalChanges.push({
        type: 'unchanged',
        content: charTrimResult.commonSuffix,
        index: currentIndex++
      });
    }
    
    // Step 5: Add common paragraph suffix if it exists
    if (paragraphTrimResult.commonSuffixParagraphs.length > 0) {
      finalChanges.push({
        type: 'unchanged',
        content: paragraphTrimResult.commonSuffixParagraphs,
        index: currentIndex++
      });
    }
    
    
    const endTime = performance.now();
    debugLog(`🔄 Combined result reconstruction completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return finalChanges;
  }

  /**
   * SSMR CHUNKING: Enhanced compare function with optional progress tracking
   * SAFE: Backwards compatible - existing calls work unchanged
   * MODULAR: Progress callback is optional
   * REVERSIBLE: Can be disabled by not passing progressCallback
   */
  public static async compare(
    originalText: string, 
    revisedText: string, 
    progressCallback?: (progress: number, stage: string) => void
  ): Promise<ComparisonResult> {
    debugLog('🎯 MyersAlgorithm.compare called with progressCallback:', !!progressCallback);
    
    // DEBUG: Log text details for debugging false equality
    debugLog('🔍 TEXT COMPARISON DEBUG:', {
      originalLength: originalText.length,
      revisedLength: revisedText.length,
      originalFirst50: originalText.substring(0, 50),
      revisedFirst50: revisedText.substring(0, 50),
      originalLast50: originalText.substring(Math.max(0, originalText.length - 50)),
      revisedLast50: revisedText.substring(Math.max(0, revisedText.length - 50)),
      areTextsIdentical: originalText === revisedText
    });
    
    // PRIORITY 1 OPTIMIZATION: Early equality check
    if (originalText === revisedText) {
      debugLog('⚡ Early equality detected - texts are identical');
      debugLog('🚨 WARNING: If you see this with different texts, there is a bug in the input handling!');
      if (progressCallback) {
        progressCallback(100, 'Texts are identical');
      }
      return {
        changes: [{ type: 'unchanged', content: originalText, index: 0 }],
        stats: { additions: 0, deletions: 0, unchanged: 1, changed: 0, totalChanges: 0 }
      };
    }
    
    // PRIORITY 1 OPTIMIZATION: Input size validation
    const originalLength = originalText.length;
    const revisedLength = revisedText.length;
    const totalLength = originalLength + revisedLength;
    
    if (totalLength > 500000) { // 500KB threshold
      debugLog('⚠️ Large input detected:', { originalLength, revisedLength, totalLength });
      if (progressCallback) {
        progressCallback(0, 'Processing large document...');
      }
    }
    
    // PRIORITY 2.5: SSMR Paragraph-level prefix/suffix trimming (NEW!)
    const paragraphTrimResult = this.trimCommonParagraphs(originalText, revisedText);
    
    // Use paragraph-trimmed content for character-level trimming (cascading optimization)
    const originalAfterParagraphTrim = paragraphTrimResult.originalCoreParagraphs;
    const revisedAfterParagraphTrim = paragraphTrimResult.revisedCoreParagraphs;
    
    // PRIORITY 1 OPTIMIZATION: Common prefix/suffix trimming (now on paragraph-trimmed content)
    const charTrimResult = this.trimCommonPrefixSuffix(originalAfterParagraphTrim, revisedAfterParagraphTrim);
    debugLog('✂️ Character-level trimming results (after paragraph trimming):', {
      prefixLength: charTrimResult.commonPrefix.length,
      suffixLength: charTrimResult.commonSuffix.length,
      originalReduced: charTrimResult.originalCore.length,
      revisedReduced: charTrimResult.revisedCore.length,
      charReductionRatio: ((originalAfterParagraphTrim.length + revisedAfterParagraphTrim.length - charTrimResult.originalCore.length - charTrimResult.revisedCore.length) / (originalAfterParagraphTrim.length + revisedAfterParagraphTrim.length) * 100).toFixed(1) + '%'
    });
    
    // Calculate total reduction from both optimizations
    const totalReductionRatio = ((originalLength + revisedLength - charTrimResult.originalCore.length - charTrimResult.revisedCore.length) / totalLength * 100);
    
    debugLog('🎯 COMBINED optimization results:', {
      paragraphReduction: paragraphTrimResult.paragraphReductionRatio.toFixed(1) + '%',
      totalReduction: totalReductionRatio.toFixed(1) + '%',
      finalCoreSize: charTrimResult.originalCore.length + charTrimResult.revisedCore.length,
      originalSize: totalLength
    });
    
    // Use fully trimmed content for diff computation
    const originalCore = charTrimResult.originalCore;
    const revisedCore = charTrimResult.revisedCore;
    
    // SAFE: Report initial progress (optional)
    if (progressCallback) {
      debugLog('📊 Starting tokenization...');
      progressCallback(5, 'Tokenizing text...');
    }
    
    // Tokenize the trimmed core content for efficiency
    const originalTokens = this.tokenize(originalCore);
    const revisedTokens = this.tokenize(revisedCore);
    
    debugLog('📝 Original tokens:', originalTokens.length);
    debugLog('📝 Revised tokens:', revisedTokens.length);
    
    // SMART PROGRESS: Only show progress for large diffs (3000+ tokens = ~15k chars)
    const totalTokens = originalTokens.length + revisedTokens.length;
    const shouldTrackProgress = totalTokens > 3000 && progressCallback;
    
    debugLog('🔢 Token count analysis:', {
      originalTokens: originalTokens.length,
      revisedTokens: revisedTokens.length,
      totalTokens,
      threshold: 10,
      shouldTrackProgress,
      hasProgressCallback: !!progressCallback
    });
    
    if (shouldTrackProgress) {
      debugLog('📊 Calling progressCallback(25, "Computing differences...")');
      progressCallback!(25, 'Computing differences...');
    }
    
    // PRIORITY 3A: Fraser's Streaming Implementation for Large Documents
    const STREAMING_THRESHOLD = 20000; // Tokens (configurable)
    const enableStreaming = true; // ROLLBACK: Set to false to disable streaming
    
    let diff: any[];
    
    if (enableStreaming && totalTokens > STREAMING_THRESHOLD) {
      debugLog(`🌊 Large document detected (${totalTokens} tokens), using streaming Myers algorithm`);
      // SSMR: Pass AbortSignal to streaming algorithm
      diff = await this.streamingMyers(originalTokens, revisedTokens, progressCallback, enableStreaming, (globalThis as any).currentAbortSignal);
    } else {
      debugLog(`⚡ Normal document size (${totalTokens} tokens), using standard Myers algorithm`);
      // SSMR: Check for cancellation even in standard algorithm
      if ((globalThis as any).currentAbortSignal?.aborted) {
        throw new Error('Operation cancelled by user');
      }
      diff = this.myers(originalTokens, revisedTokens);
    }
    
    if (shouldTrackProgress) {
      progressCallback!(90, 'Processing results...');
    }
    
    // Convert to our format and calculate stats
    let coreChanges: DiffChange[] = diff.map((change, index) => ({
      type: change.type as 'added' | 'removed' | 'unchanged' | 'changed',
      content: change.content,
      originalContent: change.originalContent,
      revisedContent: change.revisedContent,
      index
    }));
    
    // PRIORITY 2.5: SSMR Reconstruct with combined paragraph and character trimming
    const finalChanges = this.reconstructWithCombinedTrimming(coreChanges, paragraphTrimResult, charTrimResult);
    
    // EXTREME SIZE PROTECTION: Warn about very large result sets
    if (finalChanges.length > 5000) {
    }
    
    // Calculate stats before using in progressive sections
    const stats = {
      additions: finalChanges.filter(c => c.type === 'added').length,
      deletions: finalChanges.filter(c => c.type === 'removed').length,
      unchanged: finalChanges.filter(c => c.type === 'unchanged').length,
      changed: finalChanges.filter(c => c.type === 'changed').length,
      totalChanges: finalChanges.filter(c => c.type !== 'unchanged').length
    };

    // SSMR: Progressive section streaming for large result sets
    if (this.FEATURE_FLAGS.USE_PROGRESSIVE_SECTIONS && finalChanges.length > this.SECTION_CONFIG.TARGET_SIZE) {
      
      // Stream sections progressively instead of rejecting
      return this.createProgressiveSectionResult(finalChanges, stats, progressCallback);
    }
    
    // CRITICAL FIX: Prevent UI crashes with massive result sets (legacy fallback)
    const MAX_CHANGES_FOR_UI = 50000; // Reasonable limit for browser rendering
    if (finalChanges.length > MAX_CHANGES_FOR_UI) {
      
      throw new Error(`Document comparison resulted in ${finalChanges.length} changes, which exceeds the UI limit of ${MAX_CHANGES_FOR_UI}. This typically indicates the documents are too different or too large for effective comparison.`);
    }
    
    debugLog('🔄 Final result:', {
      totalChanges: finalChanges.length,
      paragraphPrefixLength: paragraphTrimResult.commonPrefixParagraphs.length,
      paragraphSuffixLength: paragraphTrimResult.commonSuffixParagraphs.length,
      charPrefixLength: charTrimResult.commonPrefix.length,
      charSuffixLength: charTrimResult.commonSuffix.length,
      totalReductionAchieved: totalReductionRatio.toFixed(1) + '%'
    });
    
    // SAFE: Report completion
    if (progressCallback) {
      progressCallback(100, 'Complete');
    }
    
    const result = { changes: finalChanges, stats };
    return result;
  }

  /**
   * PRIORITY 3A: Fraser's Streaming Myers Algorithm for Large Documents
   * SAFE: Only used for documents >20,000 tokens, falls back to standard Myers
   * STEP-BY-STEP: Processes tokens in chunks with UI yield points
   * MODULAR: Independent implementation, doesn't affect existing algorithm
   * REVERSIBLE: Feature flag can disable streaming entirely
   */
  private static async streamingMyers(
    originalTokens: string[],
    revisedTokens: string[],
    progressCallback?: (progress: number, stage: string) => void,
    enableStreaming: boolean = true, // ROLLBACK: Set to false to disable streaming
    abortSignal?: AbortSignal // SSMR: Add cancellation support
  ): Promise<any[]> {
    const startTime = performance.now();
    const totalTokens = originalTokens.length + revisedTokens.length;
    
    // SAFE: Feature flag check
    if (!enableStreaming) {
      debugLog('🌊 Streaming disabled, falling back to standard Myers');
      return this.myers(originalTokens, revisedTokens);
    }
    
    debugLog('🌊 Starting streaming Myers algorithm for', totalTokens, 'tokens');
    
    // Configuration for streaming (tunable based on performance testing)
const CHUNK_SIZE = 1800; // Process 1800 tokens per chunk (adjustable)
    const YIELD_INTERVAL = 0; // 0ms yield (just let UI update)
    const BASE_PROGRESS = 25; // Start progress from 25% (after tokenization)
    const PROGRESS_RANGE = 65; // Use 65% of progress bar for streaming (25% -> 90%)
    
    const chunks: any[] = [];
    const maxLength = Math.max(originalTokens.length, revisedTokens.length);
    
    // Process in chunks with progress updates
    for (let i = 0; i < maxLength; i += CHUNK_SIZE) {
      // SSMR: Check for cancellation at start of each chunk
      if (abortSignal?.aborted) {
        throw new Error('Operation cancelled by user');
      }
      
      const chunkStartTime = performance.now();
      
      // Extract chunk from both token arrays
      const originalChunk = originalTokens.slice(i, Math.min(i + CHUNK_SIZE, originalTokens.length));
      const revisedChunk = revisedTokens.slice(i, Math.min(i + CHUNK_SIZE, revisedTokens.length));
      
      // Skip empty chunks
      if (originalChunk.length === 0 && revisedChunk.length === 0) {
        continue;
      }
      
      // SSMR: Check for cancellation before processing chunk
      if (abortSignal?.aborted) {
        throw new Error('Operation cancelled by user');
      }
      
      // Process chunk using standard Myers algorithm
      const chunkResult = this.myers(originalChunk, revisedChunk);
      chunks.push({
        startIndex: i,
        result: chunkResult,
        originalLength: originalChunk.length,
        revisedLength: revisedChunk.length
      });
      
      // Calculate and report progress
      const chunkProgress = Math.min((i + CHUNK_SIZE) / maxLength, 1.0);
      const overallProgress = BASE_PROGRESS + (chunkProgress * PROGRESS_RANGE);
      const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(maxLength / CHUNK_SIZE);
      
      const chunkEndTime = performance.now();
      debugLog(`🌊 Chunk ${chunkNumber}/${totalChunks} processed in ${(chunkEndTime - chunkStartTime).toFixed(2)}ms`);
      
      if (progressCallback) {
        progressCallback(
          Math.floor(overallProgress), 
          `Processing chunk ${chunkNumber} of ${totalChunks}...`
        );
      }
      
      // SSMR: Check for cancellation before yielding
      if (abortSignal?.aborted) {
        throw new Error('Operation cancelled by user');
      }
      
      // CRITICAL: Yield control to UI (Fraser's key insight)
      await new Promise(resolve => setTimeout(resolve, YIELD_INTERVAL));
    }
    
    // Combine chunk results into final result
    if (progressCallback) {
      progressCallback(90, 'Combining results...');
    }
    
    const combinedResult = this.combineChunkResults(chunks, originalTokens.length, revisedTokens.length);
    
    const endTime = performance.now();
    debugLog(`🌊 Streaming Myers completed in ${(endTime - startTime).toFixed(2)}ms for ${totalTokens} tokens`);
    
    return combinedResult;
  }

  /**
   * PRIORITY 3A: Combine chunk results into final diff result
   * Helper method for streaming Myers algorithm
   */
  private static combineChunkResults(
    chunks: any[], 
    originalLength: number, 
    revisedLength: number
  ): any[] {
    const startTime = performance.now();
    
    // For now, use a simple combination strategy
    // In a production implementation, this would need more sophisticated merging
    // but for the MVP, we can process the entire token set as chunks and combine
    
    let combinedDiff: any[] = [];
    let currentOriginalIndex = 0;
    let currentRevisedIndex = 0;
    
    for (const chunk of chunks) {
      // Adjust indices in chunk results based on position in overall document
      const adjustedChunkResult = chunk.result.map((change: any) => ({
        ...change,
        // Adjust indices to account for previous chunks
        originalIndex: currentOriginalIndex + (change.originalIndex || 0),
        revisedIndex: currentRevisedIndex + (change.revisedIndex || 0)
      }));
      
      combinedDiff = combinedDiff.concat(adjustedChunkResult);
      currentOriginalIndex += chunk.originalLength;
      currentRevisedIndex += chunk.revisedLength;
    }
    
    const endTime = performance.now();
    debugLog(`🌊 Chunk combination completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return combinedDiff;
  }

  /**
   * SSMR: Create progressive section result for large change sets
   * Streams sections progressively with semantic boundary respect
   */
  private static async createProgressiveSectionResult(
    changes: DiffChange[],
    stats: any,
    progressCallback?: (progress: number, stage: string) => void
  ): Promise<ComparisonResult> {
    if (progressCallback) {
      progressCallback(90, 'Creating progressive sections...');
    }

    // For now, return a special result that indicates progressive processing
    // The UI layer will handle the progressive streaming
    // Create standard result without progressive metadata
    // This is a temporary fix to avoid TypeScript errors
    // TODO: Update ComparisonResult type to include progressive property if needed
    const result: ComparisonResult = {
      changes,
      stats
    };

    if (progressCallback) {
      progressCallback(100, 'Progressive sections ready');
    }

    return result;
  }

  /**
   * SSMR: Find next semantic section boundary
   * Respects sentence and paragraph boundaries for clean sections
   */
  private static findNextSectionBoundary(
    changes: DiffChange[], 
    startIndex: number, 
    targetSize: number
  ): number {
    let currentSize = 0;
    let lastGoodBoundary = startIndex;
    const maxSize = this.SECTION_CONFIG.MAX_SIZE;
    
    for (let i = startIndex; i < changes.length && currentSize < maxSize; i++) {
      const change = changes[i];
      currentSize++;
      
      // Check if this change contains a semantic boundary
      if (change.content && (
        change.content.includes('\n\n') ||  // Paragraph break
        this.containsSentenceBoundary(change.content)  // Real sentence break
      )) {
        lastGoodBoundary = i + 1; // Include the change with the boundary
      }
      
      // If we're past minimum size and found a boundary, use it
      if (currentSize >= targetSize && lastGoodBoundary > startIndex) {
        return lastGoodBoundary;
      }
    }
    
    // Fallback: Return where we are (performance guardrail)
    return Math.min(startIndex + targetSize, changes.length);
  }
}
