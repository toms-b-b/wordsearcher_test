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
  direction: Direction,
  isBackwards: boolean
) {
  const OVAL_RATIO = 1.5;
  const steps = 36;
  
  // Calculate end coordinates based on direction and word length
  let endX = startX;
  let endY = startY;
  
  switch (direction) {
    case 'horizontal':
      endX += (isBackwards ? -wordLength : wordLength) * cellSize;
      break;
    case 'vertical':
      endY += (isBackwards ? -wordLength : wordLength) * cellSize;
      break;
    case 'diagonal':
      endX += (isBackwards ? -wordLength : wordLength) * cellSize;
      endY += (isBackwards ? -wordLength : wordLength) * cellSize;
      break;
  }

  // Calculate center and dimensions
  const centerX = (startX + endX) / 2;
  const centerY = (startY + endY) / 2;
  const width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) + (cellSize * 0.5);
  const height = cellSize * OVAL_RATIO;
  
  // Calculate rotation angle
  const angle = Math.atan2(endY - startY, endX - startX);

  // Draw oval
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const x = (width / 2) * Math.cos(t);
    const y = (height / 2) * Math.sin(t);
    
    const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
    const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
    
    if (i === 0) {
      ctx.moveTo(centerX + rotatedX, centerY + rotatedY);
    } else {
      ctx.lineTo(centerX + rotatedX, centerY + rotatedY);
    }
  }
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
          word.direction,
          word.isBackwards
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