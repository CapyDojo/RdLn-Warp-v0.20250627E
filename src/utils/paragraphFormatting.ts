/**
 * Cleans up pasted text, particularly from sources like PDFs, by intelligently
 * removing single line breaks within paragraphs while preserving intentional paragraph breaks.
 * 
 * @param text The raw text string to format.
 * @returns The formatted text with unwanted line breaks removed.
 */
export function formatPastedText(text: string): string {
  if (!text) {
    return '';
  }

  // 1. Normalize all line endings to a single newline character.
  let processedText = text.replace(/\r\n|\r/g, '\n');

  // 2. Mark Hard Breaks: Find all lines that start with a list marker or numbered heading and protect them with a placeholder.
  // This is the most reliable signal for a structural break in the document.
  processedText = processedText.replace(/(\n)(?=\s*(\(\w+\)|\d+\s*\w+))/g, '%%HARD_BREAK%%');

  // 3. Clean Soft Breaks: Now that hard breaks are protected, replace all remaining single newlines with a space.
  // This safely joins lines within paragraphs and in the title block.
  processedText = processedText.replace(/\n/g, ' ');

  // 4. Restore Hard Breaks: Replace the placeholder with a proper newline character.
  processedText = processedText.replace(/%%HARD_BREAK%%/g, '\n');

  return processedText.trim();
}
