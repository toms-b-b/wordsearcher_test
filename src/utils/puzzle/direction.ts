import { Direction } from '../../types';

interface DirectionVector {
  x: number;
  y: number;
}

const DIRECTION_VECTORS: Record<Direction, (isBackwards: boolean) => DirectionVector> = {
  horizontal: (isBackwards) => ({ x: isBackwards ? -1 : 1, y: 0 }),
  vertical: (isBackwards) => ({ x: 0, y: isBackwards ? -1 : 1 }),
  diagonal: (isBackwards) => ({ x: isBackwards ? -1 : 1, y: isBackwards ? -1 : 1 }),
};

export const getDirectionVector = (direction: Direction, isBackwards: boolean): DirectionVector => {
  const vectorFn = DIRECTION_VECTORS[direction];
  if (!vectorFn) {
    throw new Error(`Invalid direction: ${direction}`);
  }
  
  return vectorFn(isBackwards);
};