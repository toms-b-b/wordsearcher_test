import { jsPDF } from 'jspdf';
import { PuzzleCell, PlacedWord, GridStyle, HighlightStyle } from '../../types';
import { PDFDimensions } from './dimensions';
import { drawWordHighlight } from './highlighting';

export function drawGrid(
  doc: jsPDF,
  grid: PuzzleCell[][],
  fontSize: number,
  dimensions: PDFDimensions,
  font: string,
  gridStyle: GridStyle,
): void {
  try {
    doc.setFont(font);
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);
    
    const gridStartX = dimensions.marginInches;
    const gridEndX = gridStartX + (grid[0].length * dimensions.cellSize);
    const gridEndY = dimensions.gridStartY + (grid.length * dimensions.cellSize);

    // Draw outer border if enabled
    if (gridStyle.showOuterBorder) {
      doc.setLineWidth(gridStyle.outerBorderWidth);
      doc.rect(
        gridStartX,
        dimensions.gridStartY,
        grid[0].length * dimensions.cellSize,
        grid.length * dimensions.cellSize
      );
    }

    // Set line width for cell borders
    if (gridStyle.showCellBorders) {
      doc.setLineWidth(gridStyle.cellBorderWidth);
    }
    
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellX = dimensions.marginInches + (x * dimensions.cellSize);
        const cellY = dimensions.gridStartY + (y * dimensions.cellSize);

        // Draw cell border if enabled
        if (gridStyle.showCellBorders) {
          doc.rect(cellX, cellY, dimensions.cellSize, dimensions.cellSize);
        }

        // Center letter in cell with padding
        const textWidth = doc.getStringUnitWidth(cell.letter) * fontSize / doc.internal.scaleFactor;
        const effectiveCellSize = dimensions.cellSize - (2 * gridStyle.letterPadding);
        const xOffset = (effectiveCellSize - textWidth) / 2 + gridStyle.letterPadding;
        const yOffset = (effectiveCellSize + fontSize / 72) / 2 + gridStyle.letterPadding;

        doc.text(
          cell.letter,
          cellX + xOffset,
          cellY + yOffset,
        );
      });
    });
  } catch (error) {
    console.error('Error drawing grid:', error);
    throw new Error('Failed to draw puzzle grid');
  }
}

export function drawSolutionHighlights(
  doc: jsPDF,
  placedWords: PlacedWord[],
  dimensions: PDFDimensions,
  highlightStyle: HighlightStyle
): void {
  try {
    placedWords.forEach((placedWord) => {
      const startX = dimensions.marginInches + (placedWord.startX * dimensions.cellSize);
      const startY = dimensions.gridStartY + (placedWord.startY * dimensions.cellSize);

      drawWordHighlight(
        doc,
        startX,
        startY,
        placedWord.word.length,
        dimensions.cellSize,
        placedWord.direction,
        placedWord.isBackwards,
        highlightStyle
      );
    });
  } catch (error) {
    console.error('Error drawing solution highlights:', error);
    throw new Error('Failed to draw solution highlights');
  }
}