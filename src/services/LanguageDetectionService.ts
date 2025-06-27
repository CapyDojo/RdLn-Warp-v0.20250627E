/**
 * Language Detection Service
 * 
 * Handles automatic detection of languages in OCR images based on
 * script analysis, word patterns, and statistical methods.
 */

import { OCRLanguage } from '../types/ocr-types';
import { OCRCacheManager } from './OCRCacheManager';

export class LanguageDetectionService {
  
  /**
   * Detects languages in the provided image file
   */
  public static async detectLanguage(imageFile: File | Blob): Promise<OCRLanguage[]> {
    console.log('ðŸ” Starting language detection...');
    
    // Check cache first
    const cachedResult = await OCRCacheManager.checkLanguageCache(imageFile);
    if (cachedResult) {
      return cachedResult;
    }
    
    try {
      // Use multi-language detection worker for comprehensive language support
      const worker = await OCRCacheManager.initializeDetectionWorker();
      
      console.log('ðŸ“– Running detection OCR with full language support...');
      const detectionStart = Date.now();
      
      // Perform OCR with all supported languages
      const { data } = await worker.recognize(imageFile);
      
      const detectionTime = Date.now() - detectionStart;
      console.log(`â±ï¸ Detection OCR completed in ${detectionTime}ms`);
      
      // Extract text for analysis
      const text = data.text;
      console.log('ðŸ” Analyzing text for language detection:', text.substring(0, 200) + '...');
      
      const detectedLanguages = this.analyzeTextForLanguages(text);
      
      console.log('ðŸŽ¯ Final detected languages:', detectedLanguages);
      
      // Store result in cache
      await OCRCacheManager.storeLanguageCache(imageFile, detectedLanguages);
      
      return detectedLanguages;
    } catch (error) {
      console.warn('Language detection failed, defaulting to English:', error);
      const fallbackLanguages = ['eng'] as OCRLanguage[];
      
      // Store fallback result in cache to avoid repeated failures
      await OCRCacheManager.storeLanguageCache(imageFile, fallbackLanguages);
      
      return fallbackLanguages;
    }
  }

  /**
   * Analyzes text content to determine probable languages
   */
  private static analyzeTextForLanguages(text: string): OCRLanguage[] {
    const detectedLanguages: OCRLanguage[] = [];
    
    // Enhanced text-based language detection
    // Check for non-Latin scripts first (these are easier to identify)
    if (this.containsChinese(text)) {
      if (this.isTraditionalChinese(text)) {
        detectedLanguages.push('chi_tra');
      } else {
        detectedLanguages.push('chi_sim');
      }
      console.log('âœ… Chinese script detected');
    }
    
    if (this.containsJapanese(text)) {
      detectedLanguages.push('jpn');
      console.log('âœ… Japanese script detected');
    }
    
    if (this.containsKorean(text)) {
      detectedLanguages.push('kor');
      console.log('âœ… Korean script detected');
    }
    
    if (this.containsArabic(text)) {
      detectedLanguages.push('ara');
      console.log('âœ… Arabic script detected');
    }
    
    if (this.containsCyrillic(text)) {
      detectedLanguages.push('rus');
      console.log('âœ… Cyrillic/Russian script detected');
    }
    
    // If no non-Latin script detected, check for Latin-based languages
    if (detectedLanguages.length === 0) {
      // Check for Spanish first (has unique characters)
      if (this.containsSpanish(text)) {
        detectedLanguages.push('spa');
        console.log('âœ… Spanish detected based on unique characters and patterns');
      }
      
      // Check for French
      if (this.containsFrench(text)) {
        detectedLanguages.push('fra');
        console.log('âœ… French detected based on unique characters and patterns');
      }
      
      // Check for German
      if (this.containsGerman(text)) {
        detectedLanguages.push('deu');
        console.log('âœ… German detected based on unique characters and patterns');
      }
      
      // If no specific Latin language detected, default to English
      if (detectedLanguages.length === 0) {
        detectedLanguages.push('eng');
        console.log('ðŸ“ Defaulting to English - no specific language patterns detected');
      }
    }
    
    // Always include English as fallback for mixed documents (unless it's already primary)
    if (!detectedLanguages.includes('eng') && detectedLanguages.length > 0) {
      detectedLanguages.push('eng');
    }
    
    return detectedLanguages;
  }

  /**
   * Checks if text contains Chinese characters
   */
  private static containsChinese(text: string): boolean {
    return /[\u4e00-\u9fff]/.test(text);
  }

  /**
   * Determines if Chinese text is Traditional vs Simplified
   */
  private static isTraditionalChinese(text: string): boolean {
    // Common traditional Chinese characters not used in simplified
    const traditionalChars = /[ç¹é«”ä¸­æ–‡å°ç£é¦™æ¸¯æ¾³é–€]/;
    return traditionalChars.test(text);
  }

  /**
   * Checks if text contains Japanese characters
   */
  private static containsJapanese(text: string): boolean {
    // Hiragana, Katakana, and Japanese-specific Kanji
    return /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
  }

  /**
   * Checks if text contains Korean characters
   */
  private static containsKorean(text: string): boolean {
    // Hangul syllables
    return /[\uac00-\ud7af]/.test(text);
  }

  /**
   * Checks if text contains Arabic characters
   */
  private static containsArabic(text: string): boolean {
    // Arabic script
    return /[\u0600-\u06ff]/.test(text);
  }

  /**
   * Checks if text contains Cyrillic characters
   */
  private static containsCyrillic(text: string): boolean {
    // Cyrillic script
    return /[\u0400-\u04ff]/.test(text);
  }

  /**
   * Enhanced Spanish detection
   */
  private static containsSpanish(text: string): boolean {
    // Spanish-specific characters
    const spanishChars = /[Ã±Ã¡Ã©Ã­Ã³ÃºÃ¼Ã‘ÃÃ‰ÃÃ“ÃšÃœÂ¿Â¡]/;
    if (spanishChars.test(text)) {
      console.log('ðŸ” Spanish characters found:', text.match(spanishChars));
      return true;
    }
    
    // Common Spanish words and patterns
    const spanishWords = /\b(el|la|los|las|de|del|en|con|por|para|que|es|son|estÃ¡|estÃ¡n|tiene|tienen|hace|hacen|muy|mÃ¡s|tambiÃ©n|pero|como|cuando|donde|porque|aunque|desde|hasta|entre|sobre|bajo|durante|despuÃ©s|antes|mientras|segÃºn|sin|contra|hacia|mediante|salvo|excepto|incluso|ademÃ¡s|sino|sÃ³lo|solo|cada|todo|toda|todos|todas|otro|otra|otros|otras|mismo|misma|mismos|mismas|cual|cuales|quien|quienes|cuyo|cuya|cuyos|cuyas)\b/gi;
    
    const spanishMatches = text.match(spanishWords);
    if (spanishMatches && spanishMatches.length >= 3) {
      console.log('ðŸ” Spanish words found:', spanishMatches.slice(0, 5));
      return true;
    }
    
    // Spanish-specific punctuation patterns
    const spanishPunctuation = /[Â¿Â¡]/;
    if (spanishPunctuation.test(text)) {
      console.log('ðŸ” Spanish punctuation found');
      return true;
    }
    
    return false;
  }

  /**
   * Enhanced French detection
   */
  private static containsFrench(text: string): boolean {
    // French-specific characters
    const frenchChars = /[Ã Ã¢Ã¤Ã§Ã©Ã¨ÃªÃ«Ã¯Ã®Ã´Ã¶Ã¹Ã»Ã¼Ã¿Ã¦Å“Ã€Ã‚Ã„Ã‡Ã‰ÃˆÃŠÃ‹ÃÃŽÃ”Ã–Ã™Ã›ÃœÅ¸Ã†Å’]/;
    if (frenchChars.test(text)) {
      console.log('ðŸ” French characters found:', text.match(frenchChars));
      return true;
    }
    
    // Common French words and patterns
    const frenchWords = /\b(le|la|les|de|du|des|un|une|et|est|sont|avec|dans|pour|par|sur|sous|entre|vers|chez|sans|contre|pendant|aprÃ¨s|avant|depuis|jusqu|jusque|selon|malgrÃ©|sauf|hormis|outre|parmi|moyennant|concernant|touchant|suivant|durant|lors|dÃ¨s|via|envers|devers|que|qui|dont|oÃ¹|quand|comment|pourquoi|combien|lequel|laquelle|lesquels|lesquelles|auquel|auxquels|duquel|desquels|ce|cette|ces|cet|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs)\b/gi;
    
    const frenchMatches = text.match(frenchWords);
    if (frenchMatches && frenchMatches.length >= 3) {
      console.log('ðŸ” French words found:', frenchMatches.slice(0, 5));
      return true;
    }
    
    // French-specific contractions and patterns
    const frenchPatterns = /\b(c'est|d'un|d'une|l'|qu'|n'|s'|t'|j'|m')\b/gi;
    if (frenchPatterns.test(text)) {
      console.log('ðŸ” French patterns found');
      return true;
    }
    
    return false;
  }

  /**
   * Enhanced German detection
   */
  private static containsGerman(text: string): boolean {
    // German-specific characters
    const germanChars = /[Ã¤Ã¶Ã¼ÃŸÃ„Ã–Ãœ]/;
    if (germanChars.test(text)) {
      console.log('ðŸ” German characters found:', text.match(germanChars));
      return true;
    }
    
    // Common German words and patterns
    const germanWords = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|und|oder|aber|doch|jedoch|sondern|denn|weil|da|wenn|als|wie|wo|wohin|woher|wann|warum|weshalb|wieso|weswegen|wodurch|womit|wofÃ¼r|wogegen|worÃ¼ber|worauf|worin|wozu|von|zu|mit|nach|bei|in|an|auf|Ã¼ber|unter|vor|hinter|neben|zwischen|durch|fÃ¼r|gegen|ohne|um|wÃ¤hrend|wegen|trotz|statt|anstatt|auÃŸer|bis|seit|ab|aus|binnen|dank|entlang|entsprechend|gemÃ¤ÃŸ|laut|mangels|mittels|nebst|samt|seitens|ungeachtet|unweit|zufolge|zugunsten|zulasten|zwecks|ist|sind|war|waren|hat|haben|hatte|hatten|wird|werden|wurde|wurden|kann|kÃ¶nnen|konnte|konnten|soll|sollen|sollte|sollten|will|wollen|wollte|wollten|mag|mÃ¶gen|mochte|mochten|darf|dÃ¼rfen|durfte|durften|muss|mÃ¼ssen|musste|mussten)\b/gi;
    
    const germanMatches = text.match(germanWords);
    if (germanMatches && germanMatches.length >= 3) {
      console.log('ðŸ” German words found:', germanMatches.slice(0, 5));
      return true;
    }
    
    // German compound words (characteristic long words)
    const germanCompounds = /\b\w{12,}\b/g;
    const longWords = text.match(germanCompounds);
    if (longWords && longWords.length >= 2) {
      console.log('ðŸ” German compound words found:', longWords.slice(0, 3));
      return true;
    }
    
    return false;
  }
}
