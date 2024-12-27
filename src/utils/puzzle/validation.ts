import { Direction } from '../../types';
import { getDirectionVector } from './direction';

export function validateDirection(direction: Direction): boolean {
  return ['horizontal', 'vertical', 'diagonal'].includes(direction);
}

export function validateWordPlacement(
  word: string,
  gridSize: number,
  direction: Direction,
  startX: number,
  startY: number,
  isBackwards: boolean
): boolean {
  if (startX < 0 || startY < 0 || startX >= gridSize || startY >= gridSize) {
    return false;
  }

  const vector = getDirectionVector(direction, isBackwards);
  const wordLength = word.length;
  
  // Calculate end position
  const endX = startX + (vector.x * (wordLength - 1));
  const endY = startY + (vector.y * (wordLength - 1));
  
  return endX >= 0 && endX < gridSize && endY >= 0 && endY < gridSize;
}