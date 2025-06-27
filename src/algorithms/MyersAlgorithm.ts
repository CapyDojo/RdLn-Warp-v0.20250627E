import { DiffChange, ComparisonResult } from '../types';

export class MyersAlgorithm {
  private static tokenize(text: string): string[] {
    // Enhanced tokenization that preserves meaningful units and handles abbreviations
    const tokens: string[] = [];
    let i = 0;
    
    while (i < text.length) {
      const char = text[i];
      
      // Skip whitespace but preserve it as tokens
      if (/\s/.test(char)) {
        let whitespace = '';
        while (i < text.length && /\s/.test(text[i])) {
          whitespace += text[i];
          i++;
        }
        tokens.push(whitespace);
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
    
    return tokens.filter(token => token.length > 0);
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
      console.log(`📝 Single capital "${currentToken}" + period + capital "${nextChar}" - including period`);
      return true;
    }
    
    // Case 2: Multi-part abbreviation in progress (like "J.P" when we encounter the final period)
    // This handles the final period in "J.P." to complete the abbreviation
    const multiPartPattern = /^[A-Z](\.[A-Z])+$/;
    if (multiPartPattern.test(currentToken)) {
      console.log(`📝 Multi-part abbreviation "${currentToken}" + final period - including period`);
      return true;
    }
    
    // Case 3: Check if current token + period forms a complete known abbreviation
    const tokenWithPeriod = currentToken + '.';
    if (this.isCompleteAbbreviation(tokenWithPeriod)) {
      console.log(`📝 Complete abbreviation "${tokenWithPeriod}" - including period`);
      return true;
    }
    
    // Case 4: Single capital letter at end of sequence (like final initial)
    if (currentToken.length === 1 && /[A-Z]/.test(currentToken)) {
      // Look ahead to see if there's space then capital (like "J. Smith")
      if (nextChar === ' ' && /[A-Z]/.test(charAfterNext)) {
        console.log(`📝 Single capital "${currentToken}" + period + space + capital - including period`);
        return true;
      }
      // Or if it's at the end of a word boundary
      if (!nextChar || /\s/.test(nextChar)) {
        console.log(`📝 Single capital "${currentToken}" at word boundary - including period`);
        return true;
      }
    }
    
    // Case 5: Multi-letter abbreviations (2-4 letters)
    if (currentToken.length >= 2 && currentToken.length <= 4 && /^[A-Z]+$/i.test(currentToken)) {
      console.log(`📝 Multi-letter abbreviation "${currentToken}" - including period`);
      return true;
    }
    
    console.log(`📝 Token "${currentToken}" + period - NOT including period`);
    return false;
  }

  /**
   * NEW: Check if a complete string (including period) is a known abbreviation
   */
  private static isCompleteAbbreviation(tokenWithPeriod: string): boolean {
    // Common abbreviations WITH periods for exact matching
    const knownAbbreviations = [
      'Inc.', 'Corp.', 'LLC.', 'Ltd.', 'Co.', 'LP.', 'LLP.', 'PC.', 'PA.', 'PLLC.',
      'plc.', 'GmbH.', 'AG.', 'SA.', 'SAS.', 'SARL.', 'BV.', 'NV.',
      'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Sr.', 'Jr.',
      'St.', 'Ave.', 'Blvd.', 'Rd.', 'Dr.', 'Ln.', 'Ct.', 'Pl.',
      'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.',
      'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.',
      'etc.', 'vs.', 'ie.', 'eg.', 'cf.', 'al.', 'et.'
    ];
    
    return knownAbbreviations.some(abbr => 
      abbr.toLowerCase() === tokenWithPeriod.toLowerCase()
    );
  }

  /**
   * SIMPLIFIED: Legacy function kept for compatibility but simplified
   */
  private static isAbbreviation(currentToken: string, fullText: string, periodIndex: number): boolean {
    // This function is now primarily used by the new shouldAppendPeriodToWord function
    // Keep it simple and delegate to the new logic
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
          console.log('🔍 Raw changes before processing:', rawChanges);
          const processedChanges = this.preciseChunking(rawChanges);
          console.log('📦 Changes after precise processing:', processedChanges);
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
    console.log('🎯 Starting precise chunking with character preservation');
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
        console.log(`🔍 Collected precise segment from index ${i} to ${segment.endIndex - 1}:`, segment.tokens);
        
        // Check if this segment should become a substitution
        const substitutionResult = this.evaluateSubstitution(segment.tokens);
        
        if (substitutionResult.isSubstitution) {
          console.log(`✅ Creating substitution: "${substitutionResult.removedContent}" -> "${substitutionResult.addedContent}"`);
          processed.push({
            type: 'changed',
            content: '',
            originalContent: substitutionResult.removedContent,
            revisedContent: substitutionResult.addedContent
          });
        } else {
          // Process tokens individually with intelligent grouping
          console.log(`📝 Processing segment tokens individually`);
          this.processTokensIndividually(segment.tokens, processed);
        }
        
        i = segment.endIndex;
        continue;
      }
      
      // Default case: add the token as-is
      processed.push(current);
      i++;
    }
    
    console.log('🏁 Precise chunking complete. Result:', processed.length, 'items');
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
    
    console.log(`🔍 Starting precise segment collection from index ${i}`);
    
    // First, collect all consecutive added/removed tokens
    while (i < changes.length && (changes[i].type === 'added' || changes[i].type === 'removed')) {
      tokens.push(changes[i]);
      console.log(`  ➕ Added ${changes[i].type}: "${changes[i].content}"`);
      i++;
    }
    
    // Look for unchanged tokens that are truly internal to the change
    while (i < changes.length && changes[i].type === 'unchanged') {
      const unchangedToken = changes[i];
      
      // Only consider whitespace or connective punctuation as potential internal tokens
      if (!this.isWhitespaceOnly(unchangedToken.content) && 
          !this.isConnectivePunctuation(unchangedToken.content)) {
        console.log(`  🛑 Stopping at significant unchanged token: "${unchangedToken.content}"`);
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
        console.log(`  ⬜ Added internal unchanged: "${unchangedToken.content}"`);
        i++;
        
        // Continue collecting more added/removed tokens
        while (i < changes.length && (changes[i].type === 'added' || changes[i].type === 'removed')) {
          tokens.push(changes[i]);
          console.log(`  ➕ Added ${changes[i].type}: "${changes[i].content}"`);
          i++;
        }
      } else {
        console.log(`  🛑 Stopping at boundary unchanged token: "${unchangedToken.content}"`);
        break;
      }
    }
    
    console.log(`📦 Collected precise segment with ${tokens.length} tokens`);
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
    
    console.log(`🧠 Evaluating substitution:`);
    console.log(`  📤 Removed: "${removedContent}"`);
    console.log(`  📥 Added: "${addedContent}"`);
    
    // Check if this should be a substitution
    const isSubstitution = removedContent && addedContent && 
                          this.shouldTreatAsSubstitution(removedContent, addedContent);
    
    console.log(`  🎯 Decision: ${isSubstitution ? 'SUBSTITUTE' : 'SEPARATE'}`);
    
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
        console.log(`📦 Grouping ${group.length} consecutive ${current.type} tokens`);
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
   * ENHANCED: Sentence boundary detection with better abbreviation handling
   */
  private static containsSentenceBoundary(content: string): boolean {
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

  public static compare(originalText: string, revisedText: string): ComparisonResult {
    const originalTokens = this.tokenize(originalText);
    const revisedTokens = this.tokenize(revisedText);
    
    console.log('📝 Original tokens:', originalTokens);
    console.log('📝 Revised tokens:', revisedTokens);
    
    const diff = this.myers(originalTokens, revisedTokens);
    
    // Convert to our format and calculate stats
    const changes: DiffChange[] = diff.map((change, index) => ({
      type: change.type as 'added' | 'removed' | 'unchanged' | 'changed',
      content: change.content,
      originalContent: change.originalContent,
      revisedContent: change.revisedContent,
      index
    }));
    
    const stats = {
      additions: changes.filter(c => c.type === 'added').length,
      deletions: changes.filter(c => c.type === 'removed').length,
      unchanged: changes.filter(c => c.type === 'unchanged').length,
      changed: changes.filter(c => c.type === 'changed').length,
      totalChanges: changes.filter(c => c.type !== 'unchanged').length
    };
    
    return { changes, stats };
  }
}