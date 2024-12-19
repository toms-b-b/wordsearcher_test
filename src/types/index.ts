export interface PlacedWord {
  word: string;
  startX: number;
  startY: number;
  direction: Direction;
  index: number;
  isBackwards?: boolean;
}