import { Direction } from '../../types';

export function validateDirection(direction: Direction): boolean {
  return ['horizontal', 'vertical', 'diagonal', 'backwards'].includes(direction);
}

export function validateWordPlacement(
  word: string,
  gridSize: number,
  direction: Direction,
  x: number,
  y: number,
  isBackwards: boolean = false
): boolean {
  if (x < 0 || y < 0 || y >= gridSize) return false;
  
  switch (direction) {
    case 'horizontal':
      return isBackwards ? x >= word.length - 1 : x + word.length <= gridSize;
    case 'vertical':
      return y + word.length <= gridSize;
    case 'diagonal':
      return x + word.length <= gridSize && y + word.length <= gridSize;
    case 'backwards':
      return x >= word.length - 1;
    default:
      return false;
  }
}

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