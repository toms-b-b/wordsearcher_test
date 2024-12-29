import { PageSize, FontOption, GridStyle, HighlightStyle, Direction } from '../types';

export const PAGE_SIZES: PageSize[] = [
  { width: 8.5, height: 11, label: '8.5" x 11"' },  // Changed order to make this default
  { width: 6, height: 9, label: '6" x 9"' }
];

export const FONT_OPTIONS: FontOption[] = [
  { label: 'Helvetica', value: 'helvetica' },
  { label: 'Times', value: 'times' },
  { label: 'Courier', value: 'courier' },
  { label: 'Arial', value: 'arial' }, 
  { label: 'Georgia', value: 'georgia' }, 
  { label: 'Verdana', value: 'verdana' }
];

export const MIN_GRID_SIZE = 10;
export const MAX_GRID_SIZE = 25;

export const BASE_DIRECTIONS: Direction[] = ['horizontal', 'vertical', 'diagonal'];

export const DEFAULT_GRID_STYLE: GridStyle = {
  showOuterBorder: true,
  outerBorderWidth: 0.02,
  showCellBorders: true,
  cellBorderWidth: 0.01,
  letterPadding: 0
};

export const DEFAULT_HIGHLIGHT_STYLE: HighlightStyle = {
  color: '#FFD700',      // Gold color
  thickness: 0.02,       // Line thickness in inches
  horizontalPadding: 1.3, // Horizontal padding ratio
  verticalPadding: 1.3   // Vertical padding ratio
};