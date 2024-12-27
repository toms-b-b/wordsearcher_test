import { Direction } from '../../types';

interface DirectionVector {
  x: number;
  y: number;
}

// Simplified and corrected direction vectors
export const getDirectionVector = (direction: Direction, isBackwards: boolean): DirectionVector => {
  switch (direction) {
    case 'horizontal':
      return { x: isBackwards ? -1 : 1, y: 0 };
    case 'vertical':
      return { x: 0, y: isBackwards ? -1 : 1 };
    case 'diagonal':
      return { 
        x: isBackwards ? -1 : 1, 
        y: isBackwards ? -1 : 1 
      };
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
};