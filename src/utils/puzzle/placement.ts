import { Direction } from '../../types';
import { validateDirection } from './validation';

interface PlacementPosition {
  x: number;
  y: number;
}

const getPositionForDirection = (
  size: number,
  wordLength: number,
  isBackwards: boolean
): PlacementPosition => {
  const availableSpace = size - wordLength;
  const randomPosition = Math.floor(Math.random() * availableSpace);
  
  return isBackwards 
    ? { x: randomPosition + wordLength, y: Math.floor(Math.random() * size) }
    : { x: randomPosition, y: Math.floor(Math.random() * size) };
};

const getVerticalPosition = (
  size: number,
  wordLength: number,
  isBackwards: boolean
): PlacementPosition => {
  const availableSpace = size - wordLength;
  const randomPosition = Math.floor(Math.random() * availableSpace);
  
  return isBackwards
    ? { x: Math.floor(Math.random() * size), y: randomPosition + wordLength }
    : { x: Math.floor(Math.random() * size), y: randomPosition };
};

const getDiagonalPosition = (
  size: number,
  wordLength: number,
  isBackwards: boolean
): PlacementPosition => {
  const availableSpace = size - wordLength;
  const randomX = Math.floor(Math.random() * availableSpace);
  const randomY = Math.floor(Math.random() * availableSpace);
  
  return isBackwards
    ? { x: randomX + wordLength, y: randomY + wordLength }
    : { x: randomX, y: randomY };
};

export const getRandomDirection = (
  allowedDirections: Direction[],
  allowBackwards: boolean
): { direction: Direction; isBackwards: boolean } => {
  const validDirections = allowedDirections.filter(validateDirection);
  if (!validDirections.length) {
    throw new Error('No valid directions provided');
  }

  const direction = validDirections[Math.floor(Math.random() * validDirections.length)];
  const isBackwards = allowBackwards && Math.random() < 0.5;

  return { direction, isBackwards };
};

export const getRandomPosition = (
  size: number,
  wordLength: number,
  direction: Direction,
  isBackwards: boolean
): PlacementPosition => {
  const positionMap = {
    horizontal: () => getPositionForDirection(size, wordLength, isBackwards),
    vertical: () => getVerticalPosition(size, wordLength, isBackwards),
    diagonal: () => getDiagonalPosition(size, wordLength, isBackwards),
  };

  const getPosition = positionMap[direction];
  if (!getPosition) {
    throw new Error(`Invalid direction: ${direction}`);
  }

  return getPosition();
};