import { Direction, PuzzleCell } from '../../types';
import { getDirectionVector } from './direction';
import { validateWordPlacement } from './validation';

const getWordPosition = (
  startX: number,
  startY: number,
  index: number,
  vector: { x: number; y: number }
): { x: number; y: number } => ({
  x: startX + (index * vector.x),
  y: startY + (index * vector.y),
});

export const canPlaceWord = (
  grid: PuzzleCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction,
  isBackwards: boolean
): boolean => {
  if (!validateWordPlacement(word, grid.length, direction, startX, startY, isBackwards)) {
    return false;
  }

  const vector = getDirectionVector(direction, isBackwards);
  const letters = isBackwards ? word.split('').reverse() : word.split('');
  
  return letters.every((letter, i) => {
    const { x, y } = getWordPosition(startX, startY, i, vector);
    const cell = grid[y]?.[x];
    
    // Check if the cell exists and either is empty or has the same letter
    return cell && (cell.letter === '' || cell.letter === letter.toUpperCase());
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
      wordIndices: [...(currentCell?.wordIndices || []), wordIndex],
    };
  });
};