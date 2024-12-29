import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PuzzleConfig, CSVPuzzle } from '../types';
import { BASE_DIRECTIONS } from '../types/direction';
import { ConfigPanel } from './ConfigPanel';
import { PuzzlePreview } from './PuzzlePreview';
import { PuzzleSelector } from './PuzzleSelector';
import { Toggle } from './config/Toggle';
import { useFileUpload } from '../hooks/useFileUpload';
import { useZipDownload } from '../hooks/useZipDownload';
import { PAGE_SIZES, FONT_OPTIONS, DEFAULT_GRID_STYLE, DEFAULT_HIGHLIGHT_STYLE, MIN_GRID_SIZE } from '../utils/constants';
import { findLongestWordLength } from '../utils/wordUtils';
import { parseCSV } from '../utils/csvParser';
import { Tooltip } from './common/Tooltip'; // Import the Tooltip component

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
  const { handleDownload } = useZipDownload();

  const handleDownloadClick = () => {
    handleDownload(puzzles);
  };

  const minGridSize = useMemo(() => 
    Math.max(...puzzles.map(p => findLongestWordLength(p.words) + 1)), 
    [puzzles]
  );

  // Handle config changes
  const handleConfigChange = useCallback((newConfigPartial: Partial<PuzzleConfig>) => {
    // First merge the partial config with current config
    const newConfig = {
      ...config,
      ...newConfigPartial
    };
    
    setConfig(newConfig);

    // Force regenerate puzzles immediately after config change
    const updatedPuzzles = puzzles.map(puzzle => ({
      ...puzzle,
      fontSize: newConfig.fontSize,
      wordBankFontSize: newConfig.wordBankFontSize,
      titleFontSize: newConfig.titleFontSize,
      pageSize: newConfig.pageSize,
      directions: newConfig.directions,
      allowBackwards: newConfig.allowBackwards,
      gridSize: Math.max(findLongestWordLength(puzzle.words) + 1, newConfig.gridSize),
      font: newConfig.font,
      gridStyle: newConfig.gridStyle,
      highlightStyle: newConfig.highlightStyle
    }));

    // Update selected puzzle first if it exists
    if (selectedPuzzle) {
      const updatedSelectedPuzzle = updatedPuzzles.find(p => p.id === selectedPuzzle.id);
      if (updatedSelectedPuzzle) {
        setSelectedPuzzle(updatedSelectedPuzzle);
      }
    }

    // Then update puzzles and refresh key
    setPuzzles(updatedPuzzles);
    setRefreshKey(Date.now());
  }, [config, puzzles, selectedPuzzle]);

  // Update selected puzzle when puzzles change
  useEffect(() => {
    if (selectedPuzzle?.id) {
      const updatedPuzzle = puzzles.find(p => p.id === selectedPuzzle.id);
      if (updatedPuzzle && JSON.stringify(updatedPuzzle) !== JSON.stringify(selectedPuzzle)) {
        setSelectedPuzzle(updatedPuzzle);
      }
    }
  }, [puzzles, selectedPuzzle]);

  React.useEffect(() => {
    if (selectedPuzzle?.title) {
      const updatedPuzzle = puzzles.find(p => p.title === selectedPuzzle.title);
      if (updatedPuzzle) {
        setSelectedPuzzle(updatedPuzzle);
      }
    }
  }, [puzzles, selectedPuzzle?.title]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex gap-6 h-screen p-6">
        {/* Left side - Configuration (2/3 width) */}
        <div className="w-2/3">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Word Search Generator</h2>
            <ConfigPanel
              config={config}
              minGridSize={minGridSize}
              setConfig={handleConfigChange}
              handleFileUpload={handleFileUpload}
              handleDownload={handleDownloadClick}
              puzzles={puzzles}
            />
            {(uploadError || uploadErrorHook) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{uploadError || uploadErrorHook}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Preview (1/3 width) */}
        <div className="w-1/3 flex flex-col">
          {puzzles.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-4">
                <div className="flex-grow">
                  <Tooltip content="Select which puzzle to preview and edit from your uploaded CSV file">
                    <div>
                      <PuzzleSelector
                        puzzles={puzzles}
                        selectedPuzzle={selectedPuzzle}
                        setSelectedPuzzle={setSelectedPuzzle}
                        className="flex-grow"
                      />
                    </div>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip content="Show the solution grid with all words highlighted in their respective colors">
                    <div>
                      <Toggle
                        label="Solution"
                        checked={showSolution}
                        onChange={setShowSolution}
                        color="amber"
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
              {selectedPuzzle && (
                <div className="flex-grow bg-white rounded-xl shadow-sm overflow-hidden">
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