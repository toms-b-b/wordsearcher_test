import { PuzzleCell } from '../../types';

export const initializeGrid = (size: number): PuzzleCell[][] => {
  return Array(size).fill(null).map((_, y) =>
    Array(size).fill(null).map((_, x) => ({
      letter: '',
      isPartOfWord: false,
      position: { x, y },
      wordIndices: [],
      isBackwards: false
    }))
  );
};

export const fillEmptySpaces = (grid: PuzzleCell[][]): void => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  grid.forEach(row => {
    row.forEach(cell => {
      if (!cell.letter) {
        cell.letter = letters[Math.floor(Math.random() * letters.length)];
      }
    });
  });
};