import React, { useEffect, useRef } from 'react';
import { PuzzleCell, PlacedWord, Direction } from '../types';

interface PuzzleGridProps {
  grid: PuzzleCell[][];
  fontSize: number;
  font: string;
  placedWords?: PlacedWord[];
  showSolution?: boolean;
}

function drawWordHighlight(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  wordLength: number,
  cellSize: number,
  direction: Direction
) {
  const PADDING = cellSize * 0.5; // Padding around the word
  const CORNER_RADIUS = cellSize * 0.5; // Radius for rounded corners
  
  // Calculate dimensions based on direction
  let width = cellSize;
  let height = cellSize;
  
  switch (direction) {
    case 'horizontal':
      width = wordLength * cellSize;
      height = cellSize;
      break;
    case 'vertical':
      width = cellSize;
      height = wordLength * cellSize;
      break;
    case 'diagonal':
      width = wordLength * cellSize;
      height = wordLength * cellSize;
      break;
  }

  // Add padding to dimensions
  width += PADDING * 2;
  height += PADDING * 2;
  
  // Adjust start position to account for padding
  startX -= PADDING;
  startY -= PADDING;

  // Draw rounded rectangle
  ctx.beginPath();
  ctx.moveTo(startX + CORNER_RADIUS, startY);
  ctx.lineTo(startX + width - CORNER_RADIUS, startY);
  ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + CORNER_RADIUS);
  ctx.lineTo(startX + width, startY + height - CORNER_RADIUS);
  ctx.quadraticCurveTo(startX + width, startY + height, startX + width - CORNER_RADIUS, startY + height);
  ctx.lineTo(startX + CORNER_RADIUS, startY + height);
  ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - CORNER_RADIUS);
  ctx.lineTo(startX, startY + CORNER_RADIUS);
  ctx.quadraticCurveTo(startX, startY, startX + CORNER_RADIUS, startY);
  ctx.closePath();
  ctx.stroke();
}

export function PuzzleGrid({ 
  grid, 
  fontSize, 
  font,
  placedWords,
  showSolution 
}: PuzzleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const cellSize = container.clientWidth / grid.length;
    const padding = cellSize * 0.1; // 10% padding
    
    // Set canvas size to match container with extra padding
    canvas.width = container.clientWidth + padding * 2;
    canvas.height = container.clientWidth + padding * 2; // Square grid
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up text styling
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw grid and letters
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellX = x * cellSize + padding;
        const cellY = y * cellSize + padding;

        // Draw cell border
        ctx.strokeStyle = '#CBD5E1'; // Tailwind gray-300
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);

        // Draw letter
        ctx.fillStyle = '#000000';
        ctx.fillText(
          cell.letter,
          cellX + cellSize / 2,
          cellY + cellSize / 2
        );
      });
    });

    // Draw word highlights if showing solution
    if (showSolution && placedWords) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      placedWords.forEach(word => {
        const startX = word.startX * cellSize + padding;
        const startY = word.startY * cellSize + padding;
        
        drawWordHighlight(
          ctx,
          startX,
          startY,
          word.word.length,
          cellSize,
          word.direction
        );
      });
    }
  }, [grid, fontSize, font, placedWords, showSolution]);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ transform: 'translate(-5%, -5%) scale(1.1)' }}
      />
      <div className="grid gap-1 relative z-10 pointer-events-none" style={{
        gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`
      }}>
        {grid.map((row, y) =>
          row.map((_, x) => (
            <div key={`${x}-${y}`} className="aspect-square" />
          ))
        )}
      </div>
    </div>
  );
}