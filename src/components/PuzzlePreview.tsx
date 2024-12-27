import React, { useEffect, useState } from 'react';
import { PuzzleConfig } from '../types';
import { generatePuzzle } from '../utils/puzzleGenerator';
import { generatePDF } from '../utils/pdf/generator';

interface PuzzlePreviewProps {
  puzzle: PuzzleConfig;
}

export function PuzzlePreview({ puzzle }: PuzzlePreviewProps) {
  const [puzzleUrl, setPuzzleUrl] = useState<string>('');
  const [solutionUrl, setSolutionUrl] = useState<string>('');

  useEffect(() => {
    try {
      const { grid, placedWords } = generatePuzzle(puzzle);
      
      // Generate puzzle PDF
      const puzzlePDF = generatePDF(puzzle, grid, placedWords, false);
      const puzzleBlob = new Blob([puzzlePDF.output('blob')], { type: 'application/pdf' });
      const puzzleObjectUrl = URL.createObjectURL(puzzleBlob);
      
      // Generate solution PDF
      const solutionPDF = generatePDF(puzzle, grid, placedWords, true);
      const solutionBlob = new Blob([solutionPDF.output('blob')], { type: 'application/pdf' });
      const solutionObjectUrl = URL.createObjectURL(solutionBlob);
      
      setPuzzleUrl(puzzleObjectUrl);
      setSolutionUrl(solutionObjectUrl);

      return () => {
        URL.revokeObjectURL(puzzleObjectUrl);
        URL.revokeObjectURL(solutionObjectUrl);
      };
    } catch (error) {
      console.error('Error generating puzzle preview:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-700">{puzzle.title} - Error</h2>
          <p className="text-red-600">
            Failed to generate puzzle preview: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      );
    }
  }, [puzzle]);

  return (
    <div className="space-y-8">
      {/* Puzzle Preview */}
      <div className="border rounded-lg shadow-lg overflow-hidden">
        <embed
          src={puzzleUrl}
          type="application/pdf"
          className="w-full"
          style={{ height: '11in' }}
        />
      </div>

      {/* Solution Preview */}
      <div className="border rounded-lg shadow-lg overflow-hidden">
        <embed
          src={solutionUrl}
          type="application/pdf"
          className="w-full"
          style={{ height: '11in' }}
        />
      </div>
    </div>
  );
}