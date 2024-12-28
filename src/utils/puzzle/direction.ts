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
        // For diagonal words, we want to maintain the same diagonal direction
        // and only reverse the entire vector when backwards
        const baseVector = { x: 1, y: 1 }; // Always go down-right
        return {
          x: isBackwards ? -baseVector.x : baseVector.x,
          y: isBackwards ? -baseVector.y : baseVector.y
        };
      default:
        throw new Error(`Invalid direction: ${direction}`);
    }
  })();

  return vector;
};

export const getRandomDirection = (
  availableDirections: Direction[],
  allowBackwards: boolean
): { direction: Direction; isBackwards: boolean } => {
  const direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  const isBackwards = allowBackwards && Math.random() < 0.5;

  return { direction, isBackwards };
};