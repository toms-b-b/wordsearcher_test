import { PuzzleConfig } from '../types';

interface PuzzleSelectorProps {
  puzzles: PuzzleConfig[];
  selectedPuzzle: PuzzleConfig | null;
  onSelect: (puzzle: PuzzleConfig) => void;
}

export function PuzzleSelector({ puzzles, selectedPuzzle, onSelect }: PuzzleSelectorProps) {
  // Create a unique identifier for each puzzle based on its index and content
  const getPuzzleId = (puzzle: PuzzleConfig, index: number) => `${puzzle.title}-${index}-${puzzle.words.join(',')}`;

  return (
    <div className="mb-6">
      <label htmlFor="puzzle-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select a puzzle to preview
      </label>
      <select
        id="puzzle-select"
        value={selectedPuzzle ? getPuzzleId(selectedPuzzle, puzzles.findIndex(p => p === selectedPuzzle)) : ''}
        onChange={(e) => {
          const selectedId = e.target.value;
          if (selectedId) {
            const index = parseInt(selectedId.split('-')[1], 10);
            if (!isNaN(index) && index >= 0 && index < puzzles.length) {
              onSelect(puzzles[index]);
            }
          }
        }}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option key="default" value="">Choose a puzzle...</option>
        {puzzles.map((puzzle, index) => {
          const id = getPuzzleId(puzzle, index);
          return (
            <option key={id} value={id}>
              {puzzle.title} ({index + 1})
            </option>
          );
        })}
      </select>
    </div>
  );
}