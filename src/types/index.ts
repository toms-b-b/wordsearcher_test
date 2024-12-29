export type Direction = 'horizontal' | 'vertical' | 'diagonal';

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
  originalIndex?: number; // Index of the letter in the original word
}

export interface PageSize {
  width: number;
  height: number;
  label: string;
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
  padding: number;
}

export interface PuzzleConfig {
  id: string;  // Unique identifier for each puzzle
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
}

export interface CSVPuzzle {
  title: string;
  words: string[];
}