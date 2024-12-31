import { PageSize, FontOption, Direction, GridStyle, HighlightStyle } from '../types';

// Global Default Settings
export const DEFAULT_PAGE_SIZE: PageSize = {
  label: "Letter (8.5\" x 11\")",
  width: 8.5,
  height: 11,
  highlightThickness: 2.5
};
export const DEFAULT_FONT: FontOption = { label: 'Helvetica', value: 'helvetica' };
export const DEFAULT_GRID_SIZE = 15;
export const DEFAULT_OUTER_BORDER_WIDTH = 0.0545;
export const DEFAULT_CELL_BORDER_WIDTH = 0.01;
export const DEFAULT_HIGHLIGHT_COLOR = '#ff483b';
export const DEFAULT_HIGHLIGHT_BORDER_WIDTH = 0.05;
export const DEFAULT_HORIZONTAL_PADDING = 0.79; // inches
export const DEFAULT_VERTICAL_PADDING = 0.79; // inches
export const DEFAULT_WORD_PLACEMENT: Direction[] = ['horizontal', 'vertical', 'diagonal'];

// Page Size Specific Settings
export const PAGE_SIZE_DEFAULTS = {
  'Letter (8.5" x 11")': {
    titleFontSize: 30,
    puzzleFontSize: 14,
    wordBankFontSize: 16,
    checkboxSize: 0.8
  },
  'Novel (6" x 9")': {
    titleFontSize: 24,
    puzzleFontSize: 12,
    wordBankFontSize: 14,
    checkboxSize: 0.6
  },
} as const;

// Grid Style Defaults
export const DEFAULT_GRID_STYLE: GridStyle = {
  showOuterBorder: true,
  outerBorderWidth: DEFAULT_OUTER_BORDER_WIDTH,
  showCellBorders: true,
  cellBorderWidth: DEFAULT_CELL_BORDER_WIDTH,
  letterPadding: 2,
};

// Highlight Style Defaults
export const DEFAULT_HIGHLIGHT_STYLE: HighlightStyle = {
  color: DEFAULT_HIGHLIGHT_COLOR,
  thickness: DEFAULT_HIGHLIGHT_BORDER_WIDTH,
  horizontalPadding: DEFAULT_HORIZONTAL_PADDING,
  verticalPadding: DEFAULT_VERTICAL_PADDING
};

// Checkbox Style Defaults
export const DEFAULT_CHECKBOX_STYLE = {
  shape: 'rectangle' as const,
  thickness: 0.5,
  color: '#000000',
  size: 0.8
} as const;

// Constraint Constants
export const MIN_GRID_SIZE = 10;
export const MAX_GRID_SIZE = 25;

// Font Options
export const FONT_OPTIONS: FontOption[] = [
  { label: 'Helvetica', value: 'helvetica' },
  { label: 'Times', value: 'times' },
  { label: 'Courier', value: 'courier' },
  { label: 'Arial', value: 'arial' },
  { label: 'Georgia', value: 'georgia' },
  { label: 'Verdana', value: 'verdana' },
];

// Page Size Options
export const PAGE_SIZES: PageSize[] = [
  DEFAULT_PAGE_SIZE,
  {
    label: "Novel (6\" x 9\")",
    width: 6,
    height: 9,
    highlightThickness: 1.5
  }
];

// Direction Options
export const BASE_DIRECTIONS: Direction[] = ['horizontal', 'vertical', 'diagonal'];
