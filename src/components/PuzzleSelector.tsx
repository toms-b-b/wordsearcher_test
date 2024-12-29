import { PuzzleConfig } from '../types';

interface PuzzleSelectorProps {
  puzzles: PuzzleConfig[];
  selectedPuzzle: PuzzleConfig | null;
  setSelectedPuzzle: (puzzle: PuzzleConfig) => void;
  className?: string;
}

export function PuzzleSelector({ puzzles, selectedPuzzle, setSelectedPuzzle, className }: PuzzleSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <label htmlFor="puzzle-select" className="text-xs font-medium text-gray-700">
        Puzzle:
      </label>
      <select
        id="puzzle-select"
        value={selectedPuzzle?.id || ''}
        onChange={(e) => {
          const puzzle = puzzles.find(p => p.id === e.target.value);
          if (puzzle) {
            setSelectedPuzzle(puzzle);
          }
        }}
        className="text-sm p-1 border rounded min-w-[200px]"
      >
        <option value="">Choose a puzzle...</option>
        {puzzles.map((puzzle, index) => (
          <option key={puzzle.id} value={puzzle.id}>
            {puzzle.title || `Puzzle ${index + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
}