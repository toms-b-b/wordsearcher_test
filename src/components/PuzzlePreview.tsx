import React, { useEffect, useState, useCallback } from 'react';
import { PuzzleConfig } from '../types';
import { generatePuzzle } from '../utils/puzzleGenerator';
import { generatePDF } from '../utils/pdf/generator';

interface PuzzlePreviewProps {
  puzzle: PuzzleConfig;
}

export function PuzzlePreview({ puzzle }: PuzzlePreviewProps) {
  const [puzzleUrl, setPuzzleUrl] = useState<string>('');
  const [solutionUrl, setSolutionUrl] = useState<string>('');

  const generatePreview = useCallback(async () => {
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
      return undefined;
    }
  }, [puzzle]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    generatePreview().then(cleanupFn => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [generatePreview]);

  if (!puzzleUrl || !solutionUrl) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Generating preview...</p>
      </div>
    );
  }

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