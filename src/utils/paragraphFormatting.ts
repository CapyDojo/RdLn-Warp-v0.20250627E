/**
 * (Version B) Cleans up pasted text using a conservative 'Don't Join If...' model.
 * This approach respects all initial line breaks and only joins a line with the next
 * if there are no strong indicators that the next line starts a new paragraph.
 * 
 * @param text The raw text string to format.
 * @returns The formatted text with unwanted line breaks removed.
 */
export function formatPastedText(text: string): string {
  if (!text) {
    return '';
  }

  const lines = text.replace(/\r\n|\r/g, '\n').split('\n');
  if (lines.length <= 1) {
    return text;
  }

  // Define all heuristics for what marks the start of a new paragraph.
  const markerRegex = /^(?:\d+(?:\.\d+)*\.?|\([a-zA-Z0-9]+\)|[\*\-•])\s+/;
  const indentRegex = /^(?:\s{3,}|\t)/;
  const definitionRegex = /^[A-Z][A-Za-z\s]*\s(?:means|has the meaning)/;
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

  const isParagraphStart = (line: string): boolean => {
    return (
      markerRegex.test(line) ||
      indentRegex.test(line) ||
      signpostRegex.test(line) ||
      definitionRegex.test(line)
    );
  };

  const reconstructedLines: string[] = [];
  let currentParagraph = lines[0];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const previousLine = lines[i - 1];

    // Check for hard breaks based on current/previous line endings or next line starts.
    if (
      previousLine.trim().endsWith('.') ||
      previousLine.trim().endsWith(':') ||
      previousLine.trim().endsWith(';') ||
      isParagraphStart(currentLine)
    ) {
      reconstructedLines.push(currentParagraph);
      currentParagraph = currentLine;
    } else {
      // This is a soft break, so join the lines.
      currentParagraph += ' ' + currentLine.trim();
    }
  }
  // Add the last paragraph
  reconstructedLines.push(currentParagraph);

  return reconstructedLines.join('\n\n').replace(/\n\n\s*\n\n/g, '\n\n'); // Clean up excess newlines
}

// The old reconstructParagraphs function is now superseded by the new formatPastedText logic.
// We can leave it here, commented out, or remove it.
// For clarity in our A/B test, let's make it an empty function.
export const reconstructParagraphs = (text: string): string => {
  // This function is part of the old model. In the 'B' version,
  // this functionality is integrated directly into formatPastedText.
  // To avoid confusion, this button will now just run the new formatter.
  return formatPastedText(text);
};
