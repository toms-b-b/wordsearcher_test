import { Direction } from '../../types';

interface PlacementPosition {
  x: number;
  y: number;
}

export const getRandomPosition = (
  size: number,
  wordLength: number,
  direction: Direction,
  isBackwards: boolean
): PlacementPosition => {
  const availableSpace = size - wordLength;
  
  switch (direction) {
    case 'horizontal':
      return {
        x: isBackwards ? size - 1 : Math.floor(Math.random() * (availableSpace + 1)),
        y: Math.floor(Math.random() * size)
      };

    case 'vertical':
      return {
        x: Math.floor(Math.random() * size),
        y: isBackwards ? size - 1 : Math.floor(Math.random() * (availableSpace + 1))
      };

    case 'diagonal':
      if (isBackwards) {
        return {
          x: size - 1,
          y: size - 1
        };
      }
      return {
        x: Math.floor(Math.random() * (availableSpace + 1)),
        y: Math.floor(Math.random() * (availableSpace + 1))
      };

    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
};