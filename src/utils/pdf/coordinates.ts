import { Direction } from '../../types';

export interface WordCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function calculateWordCoordinates(
  startX: number,
  startY: number,
  wordLength: number,
  direction: Direction,
  isBackwards: boolean,
  cellSize: number
): WordCoordinates {
  // Adjust startX to account for cell center
  const adjustedStartX = startX + (cellSize / 2);
  const adjustedStartY = startY + (cellSize / 2);
  
  let endX: number, endY: number;

  switch (direction) {
    case 'horizontal':
      if (isBackwards) {
        endX = adjustedStartX - ((wordLength - 1) * cellSize);
        endY = adjustedStartY;
      } else {
        endX = adjustedStartX + ((wordLength - 1) * cellSize);
        endY = adjustedStartY;
      }
      break;
    case 'vertical':
      endX = adjustedStartX;
      endY = adjustedStartY + ((wordLength - 1) * cellSize);
      break;
    case 'diagonal':
      if (isBackwards) {
        endX = adjustedStartX - ((wordLength - 1) * cellSize);
        endY = adjustedStartY + ((wordLength - 1) * cellSize);
      } else {
        endX = adjustedStartX + ((wordLength - 1) * cellSize);
        endY = adjustedStartY + ((wordLength - 1) * cellSize);
      }
      break;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  return { 
    startX: adjustedStartX, 
    startY: adjustedStartY, 
    endX, 
    endY 
  };
}