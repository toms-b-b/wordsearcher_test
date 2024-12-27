import React from 'react';
import { PuzzleConfig } from '../types';

interface PuzzleSelectorProps {
  puzzles: PuzzleConfig[];
  selectedPuzzle: PuzzleConfig | null;
  onSelect: (puzzle: PuzzleConfig) => void;
}

export function PuzzleSelector({ puzzles, selectedPuzzle, onSelect }: PuzzleSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="puzzle-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select a puzzle to preview
      </label>
      <select
        id="puzzle-select"
        value={selectedPuzzle?.title || ''}
        onChange={(e) => {
          const puzzle = puzzles.find(p => p.title === e.target.value);
          if (puzzle) onSelect(puzzle);
        }}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option key="default" value="">Choose a puzzle...</option>
        {puzzles.map((puzzle, index) => (
          <option key={`${puzzle.title}-${index}`} value={puzzle.title}>
            {puzzle.title}
          </option>
        ))}
      </select>
    </div>
  );
}