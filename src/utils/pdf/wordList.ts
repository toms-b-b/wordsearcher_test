import { jsPDF } from 'jspdf';
import { PDFDimensions } from './dimensions';
import { CheckboxStyle } from '../../types';

function drawCheckbox(
  doc: jsPDF,
  x: number,
  y: number,
  style: CheckboxStyle
): void {
  doc.setLineWidth(style.thickness / 72); // Convert to points
  const colorRGB = hexToRgb(style.color);
  doc.setDrawColor(colorRGB.r, colorRGB.g, colorRGB.b);

  const size = style.size / 72; // Convert to inches
  
  switch (style.shape) {
    case 'circle':
      doc.circle(x + size/2, y - size/2, size/2, 'S');
      break;
    case 'star':
      drawStar(doc, x, y - size, size);
      break;
    case 'rectangle':
    default:
      doc.rect(x, y - size, size, size);
      break;
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function drawStar(doc: jsPDF, x: number, y: number, size: number): void {
  const points = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  const cx = x + size/2;
  const cy = y + size/2;

  const pathData = [];
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points;
    const px = cx + radius * Math.sin(angle);
    const py = cy + radius * Math.cos(angle);
    pathData.push({ type: i === 0 ? 'M' : 'L', x: px, y: py });
  }
  pathData.push({ type: 'Z' });
  
  doc.path(pathData);
}

export function drawWordList(
  doc: jsPDF,
  words: string[],
  fontSize: number,
  dimensions: PDFDimensions,
  font: string,
  checkboxStyle: CheckboxStyle = {
    shape: 'rectangle',
    thickness: 0.5,
    color: '#000000',
    size: 0.8
  }
): void {
  try {
    doc.setFont(font);
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0);

    // Calculate optimal number of columns based on available width and word length
    const maxWordWidth = Math.max(...words.map(word => 
      doc.getTextWidth(word.toUpperCase())));
    const checkboxSize = checkboxStyle.size / 72; // Convert to inches
    const checkboxPadding = fontSize / 72 * 0.3;
    const wordWithCheckboxWidth = maxWordWidth + checkboxSize + checkboxPadding + (fontSize / 72);

    // Calculate number of columns that can fit
    const availableWidth = dimensions.pageWidth - (2 * dimensions.marginInches);
    const maxPossibleColumns = Math.floor(availableWidth / wordWithCheckboxWidth);
    const numColumns = Math.min(5, Math.max(1, maxPossibleColumns));
    
    const wordsPerColumn = Math.ceil(words.length / numColumns);
    const columnWidth = availableWidth / numColumns;
    const lineHeight = fontSize / 72 * 1.5; // Increased line height for better spacing

    // Center the word bank
    const startX = dimensions.marginInches;

    words.forEach((word, index) => {
      const column = Math.floor(index / wordsPerColumn);
      const row = index % wordsPerColumn;
      
      const x = startX + (column * columnWidth);
      const y = dimensions.wordsStartY + (row * lineHeight);
      
      // Check if word will fit on page
      if (y + lineHeight > dimensions.pageHeight - dimensions.marginInches) {
        return;
      }
      
      // Draw checkbox with custom style
      drawCheckbox(doc, x, y, checkboxStyle);
      
      // Draw word after checkbox
      doc.text(
        word.toUpperCase(),
        x + checkboxSize + checkboxPadding,
        y
      );
    });
  } catch (error) {
    console.error('Error drawing word list:', error);
    throw new Error('Failed to draw word list');
  }
}