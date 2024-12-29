import { useEffect, useState, useCallback, useMemo } from 'react';
import { PuzzleConfig } from '../types';
import { generatePuzzle } from '../utils/puzzleGenerator';
import { generatePDF } from '../utils/pdf/generator';

interface PuzzlePreviewProps {
  puzzle: PuzzleConfig;
  showSolution: boolean;
  className?: string;
}

export function PuzzlePreview({ 
  puzzle, 
  showSolution,
  className = '' 
}: PuzzlePreviewProps) {
  const [puzzleUrl, setPuzzleUrl] = useState<string>('');
  const [solutionUrl, setSolutionUrl] = useState<string>('');

  // Memoize the puzzle to detect actual changes
  const memoizedPuzzle = useMemo(() => puzzle, [JSON.stringify(puzzle)]);

  const generatePreview = useCallback(async () => {
    try {
      const { grid, placedWords } = generatePuzzle(memoizedPuzzle);
      
      // Generate puzzle PDF
      const puzzlePDF = generatePDF(memoizedPuzzle, grid, placedWords, false);
      const puzzleBlob = new Blob([puzzlePDF.output('blob')], { type: 'application/pdf' });
      const newPuzzleUrl = URL.createObjectURL(puzzleBlob);
      
      // Generate solution PDF
      const solutionPDF = generatePDF(memoizedPuzzle, grid, placedWords, true);
      const solutionBlob = new Blob([solutionPDF.output('blob')], { type: 'application/pdf' });
      const newSolutionUrl = URL.createObjectURL(solutionBlob);
      
      // Clean up old URLs before setting new ones
      if (puzzleUrl) URL.revokeObjectURL(puzzleUrl);
      if (solutionUrl) URL.revokeObjectURL(solutionUrl);
      
      setPuzzleUrl(newPuzzleUrl);
      setSolutionUrl(newSolutionUrl);
    } catch (error) {
      console.error('Error generating puzzle preview:', error);
      setPuzzleUrl('');
      setSolutionUrl('');
    }
  }, [memoizedPuzzle]);

  // Generate preview when puzzle changes
  useEffect(() => {
    generatePreview();
    
    return () => {
      if (puzzleUrl) URL.revokeObjectURL(puzzleUrl);
      if (solutionUrl) URL.revokeObjectURL(solutionUrl);
    };
  }, [memoizedPuzzle, generatePreview]);

  if (!puzzleUrl || !solutionUrl) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Generating preview...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-grow bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        <embed
          src={`${showSolution ? solutionUrl : puzzleUrl}#zoom=50&view=Fit`}
          type="application/pdf"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}