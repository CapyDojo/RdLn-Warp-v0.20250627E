/**
 * Cleans up pasted text, particularly from sources like PDFs, by intelligently
 * removing single line breaks within paragraphs while preserving intentional paragraph breaks.
 * 
 * @param text The raw text string to format.
 * @returns The formatted text with unwanted line breaks removed.
 */
export const reconstructParagraphs = (text: string): string => {
  if (!text) {
    return '';
  }

  // Regex to detect various list and clause markers.
  // - ^\d+(\.\d+)*\.\s*: Matches 1., 1.1., 1.2.3. etc.
  // - ^\([a-zA-Z0-9]+\)\s*: Matches (a), (i), (1) etc.
  // - ^[\*\-•]\s+: Matches *, -, or •
  const markerRegex = /^(?:\d+(?:\.\d+)*\.?|\([a-zA-Z0-9]+\)|[\*\-•])\s+/;

  // Regex for indentation (3+ spaces or a tab)
  const indentRegex = /^(?:\s{3,}|\t)/;

  // Case-insensitive list of legal "signpost" keywords
  const signpostKeywords = [
    'WHEREAS',
    'NOW, THEREFORE,',
    'IN WITNESS WHEREOF',
    'FURTHERMORE',
    'PROVIDED THAT',
    'HENCEFORTH',
    'NOTWITHSTANDING',
    'BE IT RESOLVED',
  ];
  const signpostRegex = new RegExp(`^(${signpostKeywords.join('|')})`, 'i');

  const lines = text.split('\n');
  if (lines.length <= 1) {
    return text;
  }

  let reconstructedText = lines[0];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];

    // If the line is blank, it's already a hard break, preserve it.
    if (currentLine.trim() === '') {
        reconstructedText += '\n' + currentLine;
        continue;
    }

    if (
      markerRegex.test(currentLine) ||
      indentRegex.test(currentLine) ||
      signpostRegex.test(currentLine)
    ) {
      reconstructedText += '\n\n' + currentLine;
    } else {
      reconstructedText += ' ' + currentLine.trim();
    }
  }

  return reconstructedText;
};

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
