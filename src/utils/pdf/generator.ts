import { jsPDF } from 'jspdf';
import { PuzzleConfig, PuzzleCell, PlacedWord } from '../../types';
import { calculatePDFDimensions } from './dimensions';
import { drawGrid, drawSolutionHighlights } from './gridDrawer';
import { drawWordList } from './wordList';

export function generatePDF(
  puzzle: PuzzleConfig,
  grid: PuzzleCell[][],
  placedWords: PlacedWord[],
  showSolution: boolean
): jsPDF {
  if (!puzzle || !grid || !placedWords) {
    throw new Error('Missing required parameters for PDF generation');
  }

  try {
    // Create PDF with correct page size and orientation
    const doc = new jsPDF({
      unit: 'in',
      format: [puzzle.pageSize.width, puzzle.pageSize.height],
      orientation: 'portrait'
    });

    // Calculate dimensions
    const dimensions = calculatePDFDimensions(doc, puzzle, grid.length);

    // Add title
    doc.setFont(puzzle.font.value);
    doc.setFontSize(puzzle.titleFontSize);

    // Calculate the center of the page for title
    const centerX = puzzle.pageSize.width / 2;

    // Add centered title
    doc.text(
      [
        puzzle.title,
        showSolution ? 'Solution' : ''
      ].filter(Boolean),
      centerX,
      dimensions.titleStartY,
      { align: 'center' }
    );

    // Draw the grid
    drawGrid(doc, grid, puzzle.fontSize, dimensions, puzzle.font.value, puzzle.gridStyle);

    // Add solution highlights if needed
    if (showSolution) {
      drawSolutionHighlights(doc, placedWords, dimensions, puzzle.highlightStyle);
    }

    // Add word list
    drawWordList(
      doc,
      placedWords.map(p => p.word),
      puzzle.wordBankFontSize,
      dimensions,
      puzzle.font.value,
      puzzle.checkboxStyle
    );

    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}