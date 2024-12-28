import { jsPDF } from 'jspdf';
import { Direction } from '../../types';
import { WordCoordinates, calculateWordCoordinates } from './coordinates';

const LINE_WIDTH = 0.02;
const PADDING_RATIO = 1.3; // Added padding ratio for word length
const HEIGHT_RATIO = 1.3; // Reduced height ratio (was 1.5)
const CORNER_RADIUS = 0.1;
const STEPS = 16;

interface Point {
  x: number;
  y: number;
}

function generateRoundedRectPoints(
  coords: WordCoordinates,
  cellSize: number
): Point[] {
  const points: Point[] = [];
  
  // Calculate the width with extra padding on both ends
  const baseWidth = Math.sqrt(
    Math.pow(coords.endX - coords.startX, 2) +
    Math.pow(coords.endY - coords.startY, 2)
  );
  const width = baseWidth + (cellSize * PADDING_RATIO); // Add padding proportional to cell size
  
  // Reduced height relative to cell size
  const height = cellSize * HEIGHT_RATIO;
  
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

  // Top edge
  basePoints.push({ x: -width/2 + adjustedRadius, y: -height/2 });
  basePoints.push({ x: width/2 - adjustedRadius, y: -height/2 });
  
  // Top right corner
  addCorner(width/2 - adjustedRadius, -height/2 + adjustedRadius, -Math.PI/2);
  
  // Right edge
  basePoints.push({ x: width/2, y: height/2 - adjustedRadius });
  
  // Bottom right corner
  addCorner(width/2 - adjustedRadius, height/2 - adjustedRadius, 0);
  
  // Bottom edge
  basePoints.push({ x: -width/2 + adjustedRadius, y: height/2 });
  
  // Bottom left corner
  addCorner(-width/2 + adjustedRadius, height/2 - adjustedRadius, Math.PI/2);
  
  // Left edge
  basePoints.push({ x: -width/2, y: -height/2 + adjustedRadius });
  
  // Top left corner
  addCorner(-width/2 + adjustedRadius, -height/2 + adjustedRadius, Math.PI);

  // Transform points
  basePoints.forEach(point => {
    const rotatedX = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    const rotatedY = point.x * Math.sin(angle) + point.y * Math.cos(angle);
    
    points.push({
      x: center.x + rotatedX,
      y: center.y + rotatedY
    });
  });
  
  return points;
}

function drawRoundedRect(doc: jsPDF, points: Point[]): void {
  if (points.length < 2) return;

  doc.setDrawColor(0);
  doc.setLineWidth(LINE_WIDTH);
  doc.setLineCap('round');
  doc.setLineJoin('round');

  // Start a new path
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
  isBackwards: boolean = false
): void {
  const coords = calculateWordCoordinates(
    startX,
    startY,
    wordLength,
    direction,
    isBackwards,
    cellSize
  );

  const points = generateRoundedRectPoints(coords, cellSize);
  drawRoundedRect(doc, points);
}