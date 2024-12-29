import { jsPDF } from 'jspdf';
import { Direction, HighlightStyle } from '../../types';
import { WordCoordinates, calculateWordCoordinates } from './coordinates';

// These values are now controlled by the highlight style
const CORNER_RADIUS = 0.1;
const STEPS = 16;

interface Point {
  x: number;
  y: number;
}

function generateRoundedRectPoints(
  coords: WordCoordinates,
  cellSize: number,
  highlightStyle: HighlightStyle
): Point[] {
  const points: Point[] = [];
  
  // Calculate the width with extra padding on both ends
  const baseWidth = Math.sqrt(
    Math.pow(coords.endX - coords.startX, 2) +
    Math.pow(coords.endY - coords.startY, 2)
  );
  
  // Use horizontal padding for width
  const width = baseWidth + (cellSize * highlightStyle.horizontalPadding);
  
  // Use vertical padding for height
  const height = cellSize * highlightStyle.verticalPadding;
  
  // Calculate angle and center
  const dx = coords.endX - coords.startX;
  const dy = coords.endY - coords.startY;
  const angle = Math.atan2(dy, dx);
  
  const center = {
    x: (coords.startX + coords.endX) / 2,
    y: (coords.startY + coords.endY) / 2
  };

  // Ensure corner radius doesn't exceed half of the smaller dimension
  const maxRadius = Math.min(width, height) / 2;
  const adjustedRadius = Math.min(CORNER_RADIUS, maxRadius);
  
  // Generate the rounded rectangle path
  const basePoints: Point[] = [];
  
  // Helper function to add corner points
  const addCorner = (centerX: number, centerY: number, startAngle: number) => {
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * (Math.PI / 2);
      basePoints.push({
        x: centerX + (adjustedRadius * Math.cos(startAngle + t)),
        y: centerY + (adjustedRadius * Math.sin(startAngle + t))
      });
    }
  };

  // Generate points for rounded rectangle
  basePoints.push({ x: -width/2 + adjustedRadius, y: -height/2 });
  basePoints.push({ x: width/2 - adjustedRadius, y: -height/2 });
  addCorner(width/2 - adjustedRadius, -height/2 + adjustedRadius, -Math.PI/2);
  basePoints.push({ x: width/2, y: height/2 - adjustedRadius });
  addCorner(width/2 - adjustedRadius, height/2 - adjustedRadius, 0);
  basePoints.push({ x: -width/2 + adjustedRadius, y: height/2 });
  addCorner(-width/2 + adjustedRadius, height/2 - adjustedRadius, Math.PI/2);
  basePoints.push({ x: -width/2, y: -height/2 + adjustedRadius });
  addCorner(-width/2 + adjustedRadius, -height/2 + adjustedRadius, Math.PI);

  // Transform points
  return basePoints.map(point => ({
    x: center.x + (point.x * Math.cos(angle) - point.y * Math.sin(angle)),
    y: center.y + (point.x * Math.sin(angle) + point.y * Math.cos(angle))
  }));
}

function drawRoundedRect(doc: jsPDF, points: Point[], highlightStyle: HighlightStyle): void {
  if (points.length < 2) return;

  // Parse the highlight color from hex to RGB
  const hex = highlightStyle.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  doc.setDrawColor(r, g, b);
  doc.setLineWidth(highlightStyle.thickness); // Use thickness from highlight style
  doc.setLineCap('round');
  doc.setLineJoin('round');

  // Draw the path
  doc.lines(
    points.slice(1).map((point, index) => {
      const prev = points[index];
      return [point.x - prev.x, point.y - prev.y];
    }),
    points[0].x,
    points[0].y,
    [1, 1],
    'S',
    true
  );
}

export function drawWordHighlight(
  doc: jsPDF,
  startX: number,
  startY: number,
  wordLength: number,
  cellSize: number,
  direction: Direction,
  isBackwards: boolean = false,
  highlightStyle: HighlightStyle
): void {
  const coords = calculateWordCoordinates(
    startX,
    startY,
    wordLength,
    direction,
    isBackwards,
    cellSize
  );

  const points = generateRoundedRectPoints(coords, cellSize, highlightStyle);
  drawRoundedRect(doc, points, highlightStyle);
}