import { useState, useCallback, useMemo, useEffect } from 'react';
import { PuzzleConfig, CSVPuzzle } from '../types';
import { ConfigPanel } from './ConfigPanel';
import { PuzzlePreview } from './PuzzlePreview';
import { PuzzleSelector } from './PuzzleSelector';
import { Toggle } from './config/Toggle';
import { useFileUpload } from '../hooks/useFileUpload';
import { useZipDownload } from '../hooks/useZipDownload';
import { 
  DEFAULT_PAGE_SIZE, 
  DEFAULT_FONT, 
  DEFAULT_GRID_SIZE,
  DEFAULT_GRID_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  BASE_DIRECTIONS,
  PAGE_SIZE_DEFAULTS,
  PAGE_SIZES
} from '../utils/default_constants';
import { findLongestWordLength } from '../utils/wordUtils';
import { parseCSV } from '../utils/csvParser';
import { Tooltip } from './common/Tooltip';

const getInitialConfig = (pageSize = DEFAULT_PAGE_SIZE): PuzzleConfig => {
  // Type assertion to ensure we can safely index PAGE_SIZE_DEFAULTS
  const pageSizeDefaults = PAGE_SIZE_DEFAULTS[pageSize.label as keyof typeof PAGE_SIZE_DEFAULTS];
  
  return {
    id: `empty-${Date.now()}`,
    title: 'Sample Puzzle',
    words: ['HELLO', 'WORLD', 'PUZZLE', 'GAME'],
    fontSize: pageSizeDefaults.puzzleFontSize,
    wordBankFontSize: pageSizeDefaults.wordBankFontSize,
    titleFontSize: pageSizeDefaults.titleFontSize,
    pageSize,
    directions: [...BASE_DIRECTIONS],
    allowBackwards: false,
    gridSize: DEFAULT_GRID_SIZE,
    font: DEFAULT_FONT,
    gridStyle: DEFAULT_GRID_STYLE,
    highlightStyle: DEFAULT_HIGHLIGHT_STYLE
  };
};

export function PuzzleGenerator() {
  const [puzzles, setPuzzles] = useState<PuzzleConfig[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleConfig | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [config, setConfig] = useState<PuzzleConfig>(getInitialConfig());
  const [showSolution, setShowSolution] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  
  // Store settings for each page size
  const [pageSettings, setPageSettings] = useState<Record<string, Partial<PuzzleConfig>>>({});

  // Handle page size change with settings memory
  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = PAGE_SIZES.find(size => size.label === e.target.value) || DEFAULT_PAGE_SIZE;
    
    // Create a new config object to trigger a proper re-render
    const newConfig = pageSettings[newPageSize.label] 
      ? {
          ...getInitialConfig(newPageSize),
          ...pageSettings[newPageSize.label],
          pageSize: newPageSize,
          id: config.id,
          title: config.title,
          words: config.words,
          // Force new object creation for nested objects to ensure change detection
          gridStyle: { ...DEFAULT_GRID_STYLE, ...pageSettings[newPageSize.label]?.gridStyle },
          highlightStyle: { ...DEFAULT_HIGHLIGHT_STYLE, ...pageSettings[newPageSize.label]?.highlightStyle }
        }
      : getInitialConfig(newPageSize);

    // Update config and force refresh immediately
    setConfig(newConfig);
    
    // Use a timeout to ensure the config update has been processed
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 0);
  }, [pageSettings, config.id, config.title, config.words]);

  // Store settings whenever they change
  useEffect(() => {
    if (config.pageSize) {
      setPageSettings(prev => ({
        ...prev,
        [config.pageSize.label]: {
          fontSize: config.fontSize,
          wordBankFontSize: config.wordBankFontSize,
          titleFontSize: config.titleFontSize,
          gridSize: config.gridSize,
          font: config.font,
          gridStyle: config.gridStyle,
          highlightStyle: config.highlightStyle,
          directions: config.directions,
          allowBackwards: config.allowBackwards
        }
      }));
    }
  }, [config]);

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

  useEffect(() => {
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
              handlePageSizeChange={handlePageSizeChange}
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
                    refreshKey={refreshKey}
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