import React, { useState, useCallback, useMemo } from 'react';
import { PuzzleConfig, CSVPuzzle } from '../types';
import { BASE_DIRECTIONS } from '../types/direction';
import { ConfigPanel } from './ConfigPanel';
import { PuzzlePreview } from './PuzzlePreview';
import { PuzzleSelector } from './PuzzleSelector';
import { useFileUpload } from '../hooks/useFileUpload';
import { useZipDownload } from '../hooks/useZipDownload';
import { PAGE_SIZES, FONT_OPTIONS, DEFAULT_GRID_STYLE, DEFAULT_HIGHLIGHT_STYLE, MIN_GRID_SIZE } from '../utils/constants';
import { findLongestWordLength } from '../utils/wordUtils';
import { parseCSV } from '../utils/csvParser';

const initialConfig: PuzzleConfig = {
  id: `empty-${Date.now()}`,
  title: 'Sample Puzzle',
  words: ['HELLO', 'WORLD', 'PUZZLE', 'GAME'],
  fontSize: 16,
  wordBankFontSize: 14,
  titleFontSize: 24,
  pageSize: PAGE_SIZES[0],
  directions: [...BASE_DIRECTIONS],
  allowBackwards: false,
  gridSize: MIN_GRID_SIZE,
  font: FONT_OPTIONS[0],
  gridStyle: DEFAULT_GRID_STYLE,
  highlightStyle: DEFAULT_HIGHLIGHT_STYLE
};

export function PuzzleGenerator() {
  const [puzzles, setPuzzles] = useState<PuzzleConfig[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [config, setConfig] = useState<PuzzleConfig>(initialConfig);
  const [showSolution, setShowSolution] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const csvData = reader.result as string;
          const parsedPuzzles = parseCSV(csvData);
          const newPuzzles = parsedPuzzles.map((puzzle: CSVPuzzle, index: number) => ({
            ...config,
            id: `puzzle-${Date.now()}-${index}`,
            title: puzzle.title,
            words: puzzle.words,
            gridSize: Math.max(findLongestWordLength(puzzle.words) + 1, config.gridSize)
          }));

          setPuzzles(newPuzzles);
          if (newPuzzles.length > 0) {
            setSelectedPuzzle(newPuzzles[0]);
          }
          setUploadError('');
        } catch (error) {
          console.error('Error parsing CSV:', error);
          setUploadError('Error parsing CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  }, [config]);

  const { error: uploadErrorHook } = useFileUpload(config, setPuzzles);
  const { handleDownload, error: downloadError } = useZipDownload();

  const minGridSize = useMemo(() => 
    Math.max(...puzzles.map(p => findLongestWordLength(p.words) + 1)), 
    [puzzles]
  );

  const regeneratePuzzles = () => {
    setPuzzles(prevPuzzles => prevPuzzles.map(puzzle => ({
      ...puzzle,
      fontSize: config.fontSize,
      wordBankFontSize: config.wordBankFontSize,
      titleFontSize: config.titleFontSize,
      pageSize: config.pageSize,
      directions: config.directions,
      allowBackwards: config.allowBackwards,
      gridSize: Math.max(findLongestWordLength(puzzle.words) + 1, config.gridSize),
      font: config.font,
      gridStyle: config.gridStyle,
      highlightStyle: config.highlightStyle
    })));
    setHasChanges(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setHasChanges(false);
  }, []);

  React.useEffect(() => {
    if (selectedPuzzle?.title) {
      const updatedPuzzle = puzzles.find(p => p.title === selectedPuzzle.title);
      if (updatedPuzzle) {
        setSelectedPuzzle(updatedPuzzle);
      }
    }
  }, [puzzles, selectedPuzzle?.title]);

  return (
    <div className="container mx-auto px-4 py-4 h-screen flex flex-col">
      <div className="flex gap-4 h-full">
        {/* Left side - Configuration */}
        <div className="w-1/2 bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
          <ConfigPanel
            config={config}
            minGridSize={minGridSize}
            setConfig={setConfig}
            regeneratePuzzles={regeneratePuzzles}
            handleFileUpload={handleFileUpload}
            handleDownload={() => handleDownload(puzzles)}
            puzzles={puzzles}
          />

          {(uploadError || uploadErrorHook) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
              <p className="text-red-600 text-sm">{uploadError || uploadErrorHook}</p>
            </div>
          )}

          {downloadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
              <p className="text-red-600 text-sm">{downloadError}</p>
            </div>
          )}
        </div>

        {/* Right side - Preview */}
        <div className="w-1/2 flex flex-col">
          {puzzles.length > 0 && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-2 mb-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-grow">
                  <PuzzleSelector
                    puzzles={puzzles}
                    selectedPuzzle={selectedPuzzle}
                    setSelectedPuzzle={setSelectedPuzzle}
                  />
                  <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-2 text-xs font-medium text-gray-700">
                      Show Solution
                    </span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      checked={showSolution}
                      onChange={(e) => setShowSolution(e.target.checked)}
                    />
                  </label>
                </div>
                {hasChanges && (
                  <button
                    onClick={handleRefresh}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 whitespace-nowrap"
                  >
                    Refresh Preview
                  </button>
                )}
              </div>
              {selectedPuzzle && (
                <div className="flex-grow bg-white rounded-lg shadow-sm overflow-hidden">
                  <PuzzlePreview
                    key={refreshKey}
                    puzzle={selectedPuzzle}
                    showSolution={showSolution}
                    className="h-full"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}