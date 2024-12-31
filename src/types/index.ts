import { Direction } from './direction';

export type { Direction };
export * from './direction';

export interface PlacedWord {
  word: string;
  startX: number;
  startY: number;
  direction: Direction;
  index: number;
  isBackwards: boolean;
}

export interface PuzzleCell {
  letter: string;
  isPartOfWord: boolean;
  position: {
    x: number;
    y: number;
  };
  wordIndices?: number[];
  isBackwards?: boolean;
  wordDirection?: Direction;
  originalIndex?: number;
}

export interface PageSize {
  width: number;
  height: number;
  label: string;
  highlightThickness: number; // Added highlight thickness specific to page size
}

export interface FontOption {
  label: string;
  value: string;
}

export interface GridStyle {
  showOuterBorder: boolean;
  outerBorderWidth: number;
  showCellBorders: boolean;
  cellBorderWidth: number;
  letterPadding: number;
}

export interface HighlightStyle {
  color: string;
  thickness: number;
  horizontalPadding: number;
  verticalPadding: number;
}

export type CheckboxShape = 'circle' | 'rectangle' | 'star';

export interface CheckboxStyle {
  shape: CheckboxShape;
  thickness: number;
  color: string;
  size: number;
}

export interface PuzzleConfig {
  id: string;
  title: string;
  words: string[];
  fontSize: number;
  wordBankFontSize: number;
  titleFontSize: number;
  pageSize: PageSize;
  directions: Direction[];
  allowBackwards: boolean;
  gridSize: number;
  font: FontOption;
  gridStyle: GridStyle;
  highlightStyle: HighlightStyle;
  checkboxStyle: CheckboxStyle;
}

export interface CSVPuzzle {
  title: string;
  words: string[];
}