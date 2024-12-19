import { jsPDF } from 'jspdf';
import { Direction } from '../../types';
import { WordCoordinates, calculateWordCoordinates } from './coordinates';

const LINE_WIDTH = 0.02; // inches
const OVAL_RATIO = 1.2; // ratio of cell size for oval height
const STEPS = 36; // number of steps to approximate the oval

interface Point {
  x: number;
  y: number;
}

function generateOvalPoints(
  coords: WordCoordinates,
  cellSize: number
): Point[] {
  const points: Point[] = [];
  const center = {
    x: (coords.startX + coords.endX) / 2,
    y: (coords.startY + coords.endY) / 2
  };

  // Calculate width and height
  const width = Math.sqrt(
    Math.pow(coords.endX - coords.startX, 2) +
    Math.pow(coords.endY - coords.startY, 2)
  ) + (cellSize * 0.2);
  const height = cellSize * OVAL_RATIO;

  // Calculate rotation angle
  const angle = Math.atan2(
    coords.endY - coords.startY,
    coords.endX - coords.startX
  );
  
  for (let i = 0; i <= STEPS; i += 1) {
    const t = (i / STEPS) * 2 * Math.PI;
    const x = (width / 2) * Math.cos(t);
    const y = (height / 2) * Math.sin(t);
    
    // Apply rotation
    const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
    const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
    
    points.push({
      x: center.x + rotatedX,
      y: center.y + rotatedY
    });
  }
  
  return points;
}

function drawOval(doc: jsPDF, points: Point[]): void {
  if (points.length < 2) return;

  doc.setDrawColor(0);
  doc.setLineWidth(LINE_WIDTH);
  doc.setLineCap('round');
  doc.setLineJoin('round');

  const segments = points.slice(1).map((point, index) => {
    const prev = points[index];
    return [point.x - prev.x, point.y - prev.y];
  });

  doc.lines(segments, points[0].x, points[0].y);
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

  const points = generateOvalPoints(coords, cellSize);
  drawOval(doc, points);
}