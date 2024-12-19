import { Direction, PuzzleCell } from '../../types';
import { validateDirection, validateWordPlacement } from './validation';

interface PlacementPosition {
  x: number;
  y: number;
}

export function getRandomDirection(allowedDirections: Direction[]): Direction {
  const validDirections = allowedDirections.filter(validateDirection);
  if (validDirections.length === 0) {
    throw new Error('No valid directions provided');
  }
  return validDirections[Math.floor(Math.random() * validDirections.length)];
}

export function getRandomPosition(
  size: number,
  wordLength: number,
  direction: Direction,
  isBackwards: boolean = false
): PlacementPosition {
  let position: PlacementPosition;
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isValid && attempts < maxAttempts) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if (validateWordPlacement(Array(wordLength).fill('A').join(''), size, direction, x, y, isBackwards)) {
      position = { x, y };
      isValid = true;
    }
    
    attempts++;
  }

  if (!isValid) {
    throw new Error('Could not find valid position for word placement');
  }

  return position!;
}

export function canPlaceWord(
  grid: PuzzleCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction,
  isBackwards: boolean = false
): boolean {
  if (!validateWordPlacement(word, grid.length, direction, startX, startY, isBackwards)) {
    return false;
  }

  const directionVectors = {
    horizontal: { x: 1, y: 0 },
    vertical: { x: 0, y: 1 },
    diagonal: { x: 1, y: 1 },
    backwards: { x: -1, y: 0 }
  };
  
  const vector = directionVectors[direction];
  const wordToPlace = isBackwards && direction === 'horizontal' ? word.split('').reverse().join('') : word;
  
  return wordToPlace.split('').every((letter, i) => {
    const x = startX + (i * vector.x);
    const y = startY + (i * vector.y);
    const cell = grid[y]?.[x];
    return cell && (cell.letter === '' || cell.letter === letter.toUpperCase());
  });
}

export function placeWord(
  grid: PuzzleCell[][],
  word: string,
  startX: number,
  startY: number,
  direction: Direction,
  wordIndex: number
): { isBackwards: boolean } {
  const isBackwards = direction === 'backwards';
  const actualDirection = isBackwards ? 'horizontal' : direction;
  
  if (!canPlaceWord(grid, word, startX, startY, actualDirection, isBackwards)) {
    throw new Error(`Cannot place word "${word}" at position (${startX}, ${startY})`);
  }

  const directionVectors = {
    horizontal: { x: 1, y: 0 },
    vertical: { x: 0, y: 1 },
    diagonal: { x: 1, y: 1 },
    backwards: { x: -1, y: 0 }
  };
  
  const vector = directionVectors[actualDirection];
  const wordToPlace = isBackwards ? word.split('').reverse().join('') : word;
  
  wordToPlace.split('').forEach((letter, i) => {
    const x = startX + (i * vector.x);
    const y = startY + (i * vector.y);
    grid[y][x] = {
      letter: letter.toUpperCase(),
      isPartOfWord: true,
      position: { x, y },
      wordIndices: [...(grid[y][x]?.wordIndices || []), wordIndex]
    };
  });

  return { isBackwards };
}