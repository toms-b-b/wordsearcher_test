import { jsPDF } from 'jspdf';
import { PuzzleConfig } from '../../types';

export interface PDFDimensions {
  pageWidth: number;
  pageHeight: number;
  marginInches: number;
  maxGridWidth: number;
  cellSize: number;
  gridStartY: number;
  wordsStartY: number;
  titleStartY: number;
}

export function calculatePDFDimensions(
  _doc: jsPDF,
  puzzle: PuzzleConfig,
  gridSize: number
): PDFDimensions {
  // Fixed margin in inches
  const marginInches = 0.75;
  
  // Get page dimensions
  const pageWidth = puzzle.pageSize.width;
  const pageHeight = puzzle.pageSize.height;
  
  // Calculate available space for grid
  const maxGridWidth = pageWidth - (2 * marginInches);
  
  // Calculate cell size based on grid size
  const cellSize = maxGridWidth / gridSize;
  
  // Calculate vertical spacing
  const gridStartY = marginInches + 1.5; // Start grid 1.5 inches from top
  const titleStartY = marginInches + ((gridStartY - marginInches) / 2); // Center title between top margin and grid
  const gridHeightInches = gridSize * cellSize;
  const wordsStartY = gridStartY + gridHeightInches + 0.5; // 0.5 inch gap after grid

  return {
    pageWidth,
    pageHeight,
    marginInches,
    maxGridWidth,
    cellSize,
    gridStartY,
    wordsStartY,
    titleStartY
  };
}