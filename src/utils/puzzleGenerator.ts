import { PuzzleConfig, PuzzleCell, PlacedWord } from '../types';
import { initializeGrid, fillEmptySpaces } from './puzzle/grid';
import { getRandomDirection, getRandomPosition } from './puzzle/placement';
import { canPlaceWord, placeWord } from './puzzle/wordPlacement';
import { validatePuzzleWords } from './puzzle/wordValidation';
import { PuzzleError } from './error';

export function generatePuzzle(config: PuzzleConfig): {
  grid: PuzzleCell[][],
  placedWords: PlacedWord[]
} {
  try {
    const size = config.gridSize;
    const grid = initializeGrid(size);
    
    // Validate and prepare words
    const validWords = validatePuzzleWords(config.words);
    if (validWords.length === 0) {
      throw new PuzzleError('No valid words provided for puzzle generation');
    }
    
    // Sort words by length (longest first) for better placement
    const words = validWords.sort((a, b) => b.length - a.length);
    const placedWords: PlacedWord[] = [];
    const maxAttempts = 100;

    // Try to place each word
    for (const [wordIndex, word] of words.entries()) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < maxAttempts) {
        // Only use selected directions
        const { direction, isBackwards } = getRandomDirection(config.directions, config.allowBackwards);
        const { x, y } = getRandomPosition(size, word.length, direction, isBackwards);
        
        if (canPlaceWord(grid, word, x, y, direction, isBackwards)) {
          placeWord(grid, word, x, y, direction, isBackwards, wordIndex);
          placedWords.push({
            word,
            startX: x,
            startY: y,
            direction,
            index: wordIndex,
            isBackwards
          });
          placed = true;
        }
        
        attempts++;
      }

      if (!placed) {
        throw new PuzzleError(`Could not place word "${word}" after ${maxAttempts} attempts. Try increasing grid size or reducing word count.`);
      }
    }

    fillEmptySpaces(grid);
    return { grid, placedWords };
  } catch (error) {
    if (error instanceof PuzzleError) {
      throw error;
    }
    throw new PuzzleError('Failed to generate puzzle: ' + (error as Error).message);
  }
}