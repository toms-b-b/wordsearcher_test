import { Direction } from '../../types';

interface DirectionVector {
  x: number;
  y: number;
}

export const getDirectionVector = (direction: Direction, isBackwards: boolean): DirectionVector => {
  // For backwards placement, we reverse the direction vector
  const vector = (() => {
    switch (direction) {
      case 'horizontal':
        return { x: isBackwards ? -1 : 1, y: 0 };
      case 'vertical':
        return { x: 0, y: isBackwards ? -1 : 1 };
      case 'diagonal':
        return { 
          x: isBackwards ? -1 : 1, 
          y: isBackwards ? 1 : -1 // Fix: Corrected y-coordinate for diagonal direction
        };
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  })();

  console.log(`Direction vector for ${direction} (backwards: ${isBackwards}):`, vector);
  return vector;
};

export const getRandomDirection = (
  availableDirections: Direction[],
  allowBackwards: boolean
): { direction: Direction; isBackwards: boolean } => {
  console.log('Getting random direction with:', {
    availableDirections,
    allowBackwards
  });

  const direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  const isBackwards = allowBackwards && Math.random() < 0.5;

  console.log('Selected direction:', {
    direction,
    isBackwards,
    probability: allowBackwards ? '50%' : '0%'
  });

  return { direction, isBackwards };
};