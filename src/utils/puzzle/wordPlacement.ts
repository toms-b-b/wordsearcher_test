import { Direction, PuzzleCell } from '../../types';
import { getDirectionVector } from './direction';

const getWordPosition = (
  startX: number,
  startY: number,
  index: number,
  vector: { x: number; y: number }
): { x: number; y: number } => ({
  x: startX + (index * vector.x),
  y: startY + (index * vector.y)
});

export const canPlaceWord = (
  grid: PuzzleCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction,
  isBackwards: boolean
): boolean => {
  const vector = getDirectionVector(direction, isBackwards);
  const letters = isBackwards ? word.split('').reverse() : word.split('');
  
  return letters.every((letter, i) => {
    const { x, y } = getWordPosition(startX, startY, i, vector);
    
    // Check bounds
    if (x < 0 || x >= grid.length || y < 0 || y >= grid.length) {
      return false;
    }
    
    const cell = grid[y][x];
    return cell.letter === '' || cell.letter === letter.toUpperCase();
  });
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
  const letters = isBackwards ? word.split('').reverse() : word.split('');
  
  letters.forEach((letter, i) => {
    const { x, y } = getWordPosition(startX, startY, i, vector);
    const currentCell = grid[y][x];
    
    grid[y][x] = {
      letter: letter.toUpperCase(),
      isPartOfWord: true,
      position: { x, y },
      wordIndices: [...(currentCell.wordIndices || []), wordIndex],
    };
  });
};