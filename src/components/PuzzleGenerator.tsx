import React, { useState } from 'react';
import { PuzzleConfig } from '../types';
import { ConfigPanel } from './ConfigPanel';
import { PuzzlePreview } from './PuzzlePreview';
import { PuzzleSelector } from './PuzzleSelector';
import { useFileUpload } from '../hooks/useFileUpload';
import { useZipDownload } from '../hooks/useZipDownload';
import { PAGE_SIZES, FONT_OPTIONS, BASE_DIRECTIONS } from '../utils/constants';
import { findLongestWordLength } from '../utils/wordUtils';

export function PuzzleGenerator() {
  const [puzzles, setPuzzles] = useState<PuzzleConfig[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleConfig | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [config, setConfig] = useState<PuzzleConfig>({
    title: '',
    words: [],
    fontSize: 16,
    wordBankFontSize: 14,
    titleFontSize: 24,
    pageSize: PAGE_SIZES[0],
    directions: [...BASE_DIRECTIONS],
    allowBackwards: false,
    gridSize: 0, // Will be set based on longest word
    font: FONT_OPTIONS[0]
  });

  const { handleFileUpload, error: uploadError } = useFileUpload(config, setPuzzles);
  const { handleDownload, error: downloadError } = useZipDownload();

  const regeneratePuzzles = () => {
    setPuzzles(prev => prev.map(puzzle => {
      // Calculate minimum grid size based on longest word
      const longestWord = findLongestWordLength(puzzle.words);
      const minGridSize = Math.max(longestWord + 1, config.gridSize);

      return {
        ...puzzle,
        fontSize: config.fontSize,
        wordBankFontSize: config.wordBankFontSize,
        titleFontSize: config.titleFontSize,
        pageSize: config.pageSize,
        directions: config.directions,
        allowBackwards: config.allowBackwards,
        gridSize: minGridSize,
        font: config.font
      };
    }));
    setHasChanges(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setHasChanges(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfigPanel
        config={config}
        minGridSize={Math.max(
          ...puzzles.map(p => findLongestWordLength(p.words) + 1)
        )}
        setConfig={setConfig}
        regeneratePuzzles={regeneratePuzzles}
        handleFileUpload={handleFileUpload}
        handleDownload={() => handleDownload(puzzles)}
        puzzles={puzzles}
      />

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-600">{uploadError}</p>
        </div>
      )}

      {downloadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-600">{downloadError}</p>
        </div>
      )}

      {puzzles.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-6">
            <PuzzleSelector
              puzzles={puzzles}
              selectedPuzzle={selectedPuzzle}
              onSelect={setSelectedPuzzle}
            />
            <button
              onClick={handleRefresh}
              className={`px-4 py-2 rounded-md transition-colors ${
                hasChanges 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={!hasChanges}
            >
              Refresh Preview
            </button>
          </div>
          {selectedPuzzle && (
            <PuzzlePreview 
              key={refreshKey} 
              puzzle={selectedPuzzle} 
            />
          )}
        </>
      )}
    </div>
  );
}