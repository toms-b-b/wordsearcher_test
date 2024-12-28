import { Direction } from '../../types';

export const getRandomPosition = (
  gridSize: number,
  wordLength: number,
  direction: Direction,
  isBackwards: boolean
): { x: number; y: number } => {
  let x: number, y: number;

  // Calculate available space considering word length and direction
  const availableSpace = gridSize - wordLength;

  switch (direction) {
    case 'horizontal':
      if (isBackwards) {
        // For backwards horizontal, start from rightmost possible position
        x = gridSize - 1;
        y = Math.floor(Math.random() * gridSize);
      } else {
        x = Math.floor(Math.random() * (availableSpace + 1));
        y = Math.floor(Math.random() * gridSize);
      }
      break;

    case 'vertical':
      if (isBackwards) {
        // For backwards vertical, start from bottom-most possible position
        x = Math.floor(Math.random() * gridSize);
        y = gridSize - 1;
      } else {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * (availableSpace + 1));
      }
      break;

    case 'diagonal':
      if (isBackwards) {
        // For backwards diagonal, start from bottom-right possible position
        x = gridSize - 1;
        y = gridSize - 1;
      } else {
        x = Math.floor(Math.random() * (availableSpace + 1));
        y = Math.floor(Math.random() * (availableSpace + 1));
      }
      break;

    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  // Adjust position to ensure the word fits within the grid
  if (isBackwards) {
    switch (direction) {
      case 'horizontal':
        x = Math.max(wordLength - 1, Math.min(x, gridSize - 1));
        break;
      case 'vertical':
        y = Math.max(wordLength - 1, Math.min(y, gridSize - 1));
        break;
      case 'diagonal':
        x = Math.max(wordLength - 1, Math.min(x, gridSize - 1));
        y = Math.max(wordLength - 1, Math.min(y, gridSize - 1));
        break;
    }
  }

  return { x, y };
};