import React from 'react';
import { PuzzleConfig, Direction, HighlightStyle } from '../types';
import { FileOperations } from './config/FileOperations';
import { PageSettings } from './config/PageSettings';
import { FontSizes } from './config/FontSizes';
import { GridSettings } from './config/GridSettings';
import { HighlightSettings } from './config/HighlightSettings';
import { PAGE_SIZES, FONT_OPTIONS } from '../utils/constants';

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

  const handleHighlightStyleChange = (key: keyof HighlightStyle, value: string | number) => {
    handleConfigChange('highlightStyle', {
      ...config.highlightStyle,
      [key]: value
    });
  };

  const handleDirectionChange = (direction: Direction, checked: boolean) => {
    const newDirections = checked
      ? [...config.directions, direction]
      : config.directions.filter(d => d !== direction);

    if (newDirections.length > 0) {
      handleConfigChange('directions', newDirections);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = PAGE_SIZES.find(s => s.label === e.target.value);
    if (size) {
      handleConfigChange('pageSize', size);
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = FONT_OPTIONS.find(f => f.value === e.target.value);
    if (font) {
      handleConfigChange('font', font);
    }
  };

  return (
    <div className="space-y-3">
      <FileOperations
        handleFileUpload={handleFileUpload}
        handleDownload={handleDownload}
        hasPuzzles={puzzles.length > 0}
      />

      <div className="space-y-3">
        <PageSettings
          pageSize={config.pageSize}
          font={config.font}
          onPageSizeChange={handlePageSizeChange}
          onFontChange={handleFontChange}
        />

        <FontSizes
          titleFontSize={config.titleFontSize}
          fontSize={config.fontSize}
          wordBankFontSize={config.wordBankFontSize}
          onTitleFontSizeChange={(value) => handleConfigChange('titleFontSize', value)}
          onFontSizeChange={(value) => handleConfigChange('fontSize', value)}
          onWordBankFontSizeChange={(value) => handleConfigChange('wordBankFontSize', value)}
        />

        <GridSettings
          gridSize={config.gridSize}
          minGridSize={minGridSize}
          allowBackwards={config.allowBackwards}
          directions={config.directions}
          onGridSizeChange={(value) => handleConfigChange('gridSize', value)}
          onAllowBackwardsChange={(value) => handleConfigChange('allowBackwards', value)}
          onDirectionChange={handleDirectionChange}
        />

        <HighlightSettings
          highlightStyle={config.highlightStyle}
          onHighlightStyleChange={handleHighlightStyleChange}
        />
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