import { Direction } from '../../types';
import { validateDirection } from './validation';

interface PlacementPosition {
  x: number;
  y: number;
}

// Calculate valid starting position based on direction and word length
export const getRandomPosition = (
  size: number,
  wordLength: number,
  direction: Direction,
  isBackwards: boolean
): PlacementPosition => {
  if (!validateDirection(direction)) {
    throw new Error(`Invalid direction: ${direction}`);
  }

  const availableSpace = size - wordLength;
  
  switch (direction) {
    case 'horizontal':
      if (isBackwards) {
        // For backwards horizontal, start from right side
        return {
          x: size - 1,  // Start from rightmost position
          y: Math.floor(Math.random() * size)
        };
      }
      return {
        x: Math.floor(Math.random() * availableSpace),
        y: Math.floor(Math.random() * size)
      };

    case 'vertical':
      if (isBackwards) {
        // For backwards vertical, start from bottom
        return {
          x: Math.floor(Math.random() * size),
          y: size - 1  // Start from bottom position
        };
      }
      return {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * availableSpace)
      };

    case 'diagonal':
      if (isBackwards) {
        // For backwards diagonal, start from bottom-right
        return {
          x: size - 1,
          y: size - 1
        };
      }
      return {
        x: Math.floor(Math.random() * availableSpace),
        y: Math.floor(Math.random() * availableSpace)
      };

    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
};