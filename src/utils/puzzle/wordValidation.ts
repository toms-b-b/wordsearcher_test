export function validatePuzzleWords(words: string[]): string[] {
  if (!Array.isArray(words)) {
    return [];
  }

  return words
    .map(word => word.trim().toUpperCase())
    .filter(word => {
      // Remove empty strings
      if (!word) return false;

      // Only allow letters
      if (!/^[A-Z]+$/.test(word)) return false;

      // Ensure reasonable word length (2-15 characters)
      if (word.length < 2 || word.length > 15) return false;

      return true;
    });
}