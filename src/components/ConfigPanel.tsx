import React, { useRef } from 'react';
import { PuzzleConfig, Direction, GridStyle, HighlightStyle } from '../types';
import { PAGE_SIZES, FONT_OPTIONS, BASE_DIRECTIONS, MAX_GRID_SIZE } from '../utils/constants';

interface ConfigPanelProps {
  config: PuzzleConfig;
  minGridSize: number;
  setConfig: (config: PuzzleConfig) => void;
  regeneratePuzzles: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  puzzles: PuzzleConfig[];
}

export function ConfigPanel({
  config,
  minGridSize,
  setConfig,
  regeneratePuzzles,
  handleFileUpload,
  handleDownload,
  puzzles,
}: ConfigPanelProps) {
  const handleConfigChange = (key: keyof PuzzleConfig, value: any) => {
    setConfig({
      ...config,
      [key]: value
    });
    regeneratePuzzles();
  };

  const handleDirectionChange = (direction: Direction, checked: boolean) => {
    const newDirections = checked
      ? [...config.directions, direction]
      : config.directions.filter(d => d !== direction);

    if (newDirections.length > 0) {
      handleConfigChange('directions', newDirections);
    }
  };

  const handleGridStyleChange = (key: keyof GridStyle, value: number | boolean) => {
    handleConfigChange('gridStyle', {
      ...config.gridStyle,
      [key]: value
    });
  };

  const handleHighlightStyleChange = (key: keyof HighlightStyle, value: string | number) => {
    handleConfigChange('highlightStyle', {
      ...config.highlightStyle,
      [key]: value
    });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = PAGE_SIZES.find((s) => s.label === e.target.value);
    if (size) {
      setConfig({
        ...config,
        pageSize: size
      });
      regeneratePuzzles();
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = FONT_OPTIONS.find((f) => f.value === e.target.value);
    if (font) {
      setConfig({
        ...config,
        font: font
      });
      regeneratePuzzles();
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* File Operations */}
      <div className="flex gap-2">
        <button
          onClick={handleUploadClick}
          className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Upload CSV
        </button>
        <button
          onClick={() => handleDownload()}
          className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={puzzles.length === 0}
        >
          Download All
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv"
          className="hidden"
        />
      </div>

      {/* Settings Groups */}
      <div className="space-y-3">
        {/* Page Settings */}
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-sm font-medium mb-1">Page Settings</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600">Page Size</label>
              <select
                value={config.pageSize.label}
                onChange={handlePageSizeChange}
                className="w-full text-sm p-1 border rounded"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size.label} value={size.label}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600">Font</label>
              <select
                value={config.font.value}
                onChange={handleFontChange}
                className="w-full text-sm p-1 border rounded"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Font Sizes */}
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-sm font-medium mb-1">Font Sizes</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-600">Title</label>
              <input
                type="number"
                value={config.titleFontSize}
                onChange={(e) => handleConfigChange('titleFontSize', Number(e.target.value))}
                className="w-full text-sm p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Puzzle</label>
              <input
                type="number"
                value={config.fontSize}
                onChange={(e) => handleConfigChange('fontSize', Number(e.target.value))}
                className="w-full text-sm p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Word Bank</label>
              <input
                type="number"
                value={config.wordBankFontSize}
                onChange={(e) => handleConfigChange('wordBankFontSize', Number(e.target.value))}
                className="w-full text-sm p-1 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Grid Settings */}
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-sm font-medium mb-1">Grid Settings</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600">Grid Size</label>
              <input
                type="number"
                value={config.gridSize}
                onChange={(e) => handleConfigChange('gridSize', Number(e.target.value))}
                min={minGridSize}
                max={MAX_GRID_SIZE}
                className="w-full text-sm p-1 border rounded"
              />
            </div>
            <div>
              <label className="flex items-center text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={config.allowBackwards}
                  onChange={(e) => handleConfigChange('allowBackwards', e.target.checked)}
                  className="mr-1"
                />
                Allow Backwards Words
              </label>
            </div>
            <div>
              <label className="block text-xs text-gray-600">Word Directions</label>
              <div className="flex gap-2">
                {BASE_DIRECTIONS.map((direction) => (
                  <label key={direction} className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={config.directions.includes(direction)}
                      onChange={(e) => handleDirectionChange(direction, e.target.checked)}
                      className="mr-1"
                    />
                    {direction}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid Style */}
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-sm font-medium mb-1">Grid Style</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Outer Border</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.gridStyle.showOuterBorder}
                  onChange={(e) => handleGridStyleChange('showOuterBorder', e.target.checked)}
                />
                <input
                  type="number"
                  value={config.gridStyle.outerBorderWidth}
                  onChange={(e) => handleGridStyleChange('outerBorderWidth', Number(e.target.value))}
                  step="0.01"
                  min="0"
                  className="w-16 text-sm p-1 border rounded"
                  disabled={!config.gridStyle.showOuterBorder}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Cell Borders</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.gridStyle.showCellBorders}
                  onChange={(e) => handleGridStyleChange('showCellBorders', e.target.checked)}
                />
                <input
                  type="number"
                  value={config.gridStyle.cellBorderWidth}
                  onChange={(e) => handleGridStyleChange('cellBorderWidth', Number(e.target.value))}
                  step="0.01"
                  min="0"
                  className="w-16 text-sm p-1 border rounded"
                  disabled={!config.gridStyle.showCellBorders}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Style */}
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-sm font-medium mb-1">Highlight Style</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Color</label>
              <input
                type="color"
                value={config.highlightStyle.color}
                onChange={(e) => handleHighlightStyleChange('color', e.target.value)}
                className="w-8 h-8 p-0 border rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Thickness</label>
              <input
                type="number"
                value={config.highlightStyle.thickness}
                onChange={(e) => handleHighlightStyleChange('thickness', Number(e.target.value))}
                step="0.01"
                min="0"
                className="w-16 text-sm p-1 border rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600">Padding</label>
              <input
                type="number"
                value={config.highlightStyle.padding}
                onChange={(e) => handleHighlightStyleChange('padding', Number(e.target.value))}
                step="0.01"
                min="0"
                className="w-16 text-sm p-1 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={regeneratePuzzles}
        className="w-full px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        disabled={puzzles.length === 0}
      >
        Regenerate All
      </button>
    </div>
  );
}