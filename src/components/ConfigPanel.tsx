import React from 'react';
import { PuzzleConfig, Direction, HighlightStyle } from '../types';
import { FileOperations } from './config/FileOperations';
import { PageSettings } from './config/PageSettings';
import { FontSizes } from './config/FontSizes';
import { GridSettings } from './config/GridSettings';
import { HighlightSettings } from './config/HighlightSettings';
import { PAGE_SIZES, FONT_OPTIONS, DEFAULT_FONT } from '../utils/default_constants';
import { Toggle } from './config/Toggle';
import { Tooltip } from './common/Tooltip';

interface ConfigPanelProps {
  config: PuzzleConfig;
  minGridSize: number;
  setConfig: (config: Partial<PuzzleConfig>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  puzzles: PuzzleConfig[];
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function ConfigPanel({
  config,
  minGridSize,
  setConfig,
  handleFileUpload,
  handleDownload,
  puzzles,
  handlePageSizeChange,
}: ConfigPanelProps) {
  const handleConfigChange = (key: keyof PuzzleConfig, value: any) => {
    setConfig({ [key]: value });
  };

  const handleGridStyleChange = (key: string, value: number | boolean) => {
    setConfig({
      gridStyle: {
        ...config.gridStyle,
        [key]: value,
      },
    });
  };

  const handleHighlightStyleChange = (key: keyof HighlightStyle, value: string | number) => {
    setConfig({
      highlightStyle: {
        ...config.highlightStyle,
        [key]: value,
      },
    });
  };

  const handleDirectionChange = (direction: Direction, checked: boolean) => {
    const newDirections = checked
      ? [...config.directions, direction]
      : config.directions.filter(d => d !== direction);
    handleConfigChange('directions', newDirections);
  };

  const handleBorderWidthChange = (key: 'outerBorderWidth' | 'cellBorderWidth', value: number | string) => {
    const displayValue = typeof value === 'string' ? parseInt(value) : value;
    if (!isNaN(displayValue)) {
      // Clamp display value between 1 and 100
      const clampedDisplayValue = Math.min(Math.max(displayValue, 1), 100);
      // Convert display value (1-100) to actual value (0.01-0.1)
      const actualValue = 0.01 + ((clampedDisplayValue - 1) / 99) * 0.09;
      handleGridStyleChange(key, actualValue);
    }
  };

  const getDisplayValue = (actualValue: number): number => {
    return Math.round(((actualValue - 0.01) / 0.09) * 99) + 1;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* File Operations - spans full width */}
      <div className="col-span-3 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">File Operations</h3>
        <FileOperations
          handleFileUpload={handleFileUpload}
          handleDownload={handleDownload}
          hasPuzzles={puzzles.length > 0}
        />
      </div>

      {/* Left Column: Page Settings and Grid Style */}
      <div className="space-y-4">
        <div>
          <PageSettings
            pageSize={config.pageSize}
            font={config.font}
            onPageSizeChange={handlePageSizeChange}
            onFontChange={(e) => handleConfigChange('font', FONT_OPTIONS.find(f => f.value === e.target.value) || DEFAULT_FONT)}
          />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Grid Style</h3>
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <Tooltip content="Show or hide the outer border of the puzzle grid">
                  <div>
                    <Toggle
                      label="Show Outer Border"
                      checked={config.gridStyle.showOuterBorder}
                      onChange={(checked) => handleGridStyleChange('showOuterBorder', checked)}
                      color="purple"
                    />
                  </div>
                </Tooltip>
                {config.gridStyle.showOuterBorder && (
                  <div className="ml-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600">Thickness</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={getDisplayValue(config.gridStyle.outerBorderWidth)}
                          onChange={(e) => handleBorderWidthChange('outerBorderWidth', e.target.value)}
                          min="1"
                          max="100"
                          className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
                        />
                        <span className="text-xs text-gray-500">/ 100</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={getDisplayValue(config.gridStyle.outerBorderWidth)}
                      onChange={(e) => handleBorderWidthChange('outerBorderWidth', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                )}
              </div>

              <div>
                <Tooltip content="Show or hide the borders between cells">
                  <div>
                    <Toggle
                      label="Show Cell Borders"
                      checked={config.gridStyle.showCellBorders}
                      onChange={(checked) => handleGridStyleChange('showCellBorders', checked)}
                      color="purple"
                    />
                  </div>
                </Tooltip>
                {config.gridStyle.showCellBorders && (
                  <div className="ml-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600">Thickness</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={getDisplayValue(config.gridStyle.cellBorderWidth)}
                          onChange={(e) => handleBorderWidthChange('cellBorderWidth', e.target.value)}
                          min="1"
                          max="100"
                          className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
                        />
                        <span className="text-xs text-gray-500">/ 100</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={getDisplayValue(config.gridStyle.cellBorderWidth)}
                      onChange={(e) => handleBorderWidthChange('cellBorderWidth', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Font Sizes and Highlight Settings */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Font Sizes</h3>
          <FontSizes
            titleFontSize={config.titleFontSize}
            fontSize={config.fontSize}
            wordBankFontSize={config.wordBankFontSize}
            onTitleFontSizeChange={(value) => handleConfigChange('titleFontSize', value)}
            onFontSizeChange={(value) => handleConfigChange('fontSize', value)}
            onWordBankFontSizeChange={(value) => handleConfigChange('wordBankFontSize', value)}
          />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Highlight Settings</h3>
          <HighlightSettings
            highlightStyle={config.highlightStyle}
            onChange={handleHighlightStyleChange}
          />
        </div>
      </div>

      {/* Right Column: Grid Settings */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Grid Settings</h3>
        <GridSettings
          gridSize={config.gridSize}
          minGridSize={minGridSize}
          allowBackwards={config.allowBackwards}
          directions={config.directions}
          gridStyle={config.gridStyle}
          onGridSizeChange={(value) => handleConfigChange('gridSize', value)}
          onAllowBackwardsChange={(value) => handleConfigChange('allowBackwards', value)}
          onDirectionChange={handleDirectionChange}
          onGridStyleChange={handleGridStyleChange}
        />
      </div>
    </div>
  );
}