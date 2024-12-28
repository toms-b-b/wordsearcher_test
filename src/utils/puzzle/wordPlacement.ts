import { Direction, PuzzleCell } from '../../types';
import { getDirectionVector } from './direction';

const getWordPosition = (
  startX: number,
  startY: number,
  index: number,
  vector: { x: number; y: number },
  isBackwards: boolean
): { x: number; y: number } => {
  // For backwards words, we need to move in the opposite direction from the start
  const position = {
    x: startX + (index * vector.x),
    y: startY + (index * vector.y)
  };
  return position;
};

export const canPlaceWord = (
  grid: PuzzleCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction,
  isBackwards: boolean
): boolean => {
  const vector = getDirectionVector(direction, isBackwards);
  // Don't reverse the word, just check positions
  const letters = word.split('');
  
  const canPlace = letters.every((letter, i) => {
    const { x, y } = getWordPosition(startX, startY, i, vector, isBackwards);
    
    // Check bounds
    if (x < 0 || x >= grid.length || y < 0 || y >= grid.length) {
      return false;
    }
    
    const cell = grid[y][x];
    const canPlaceHere = cell.letter === '' || cell.letter === letter.toUpperCase();
    return canPlaceHere;
  });

  return canPlace;
};

export const placeWord = (
  grid: PuzzleCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction,
  isBackwards: boolean,
  wordIndex: number
): void => {
  if (!canPlaceWord(grid, word, startX, startY, direction, isBackwards)) {
    throw new Error(`Cannot place word "${word}" at position (${startX}, ${startY})`);
  }

  const vector = getDirectionVector(direction, isBackwards);
  // Use original word and let the vector handle the direction
  const letters = word.split('');
  
  letters.forEach((letter, i) => {
    const { x, y } = getWordPosition(startX, startY, i, vector, isBackwards);
    const currentCell = grid[y][x];
    
    grid[y][x] = {
      letter: letter.toUpperCase(),
      isPartOfWord: true,
      position: { x, y },
      wordIndices: [...(currentCell.wordIndices || []), wordIndex],
      isBackwards,
      wordDirection: direction,
      originalIndex: i
    };
  });
};