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
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  puzzles: PuzzleConfig[];
}

export function ConfigPanel({
  config,
  minGridSize,
  setConfig,
  handleFileUpload,
  handleDownload,
  puzzles,
}: ConfigPanelProps) {
  const handleConfigChange = (key: keyof PuzzleConfig, value: any) => {
    const newConfig = {
      ...config,
      [key]: value
    };
    setConfig(newConfig);
  };

  const handleHighlightStyleChange = (key: keyof HighlightStyle, value: string | number) => {
    const newConfig = {
      ...config,
      highlightStyle: {
        ...config.highlightStyle,
        [key]: value
      }
    };
    setConfig(newConfig);
  };

  const handleDirectionChange = (direction: Direction, checked: boolean) => {
    const newDirections = checked
      ? [...config.directions, direction]
      : config.directions.filter(d => d !== direction);

    if (newDirections.length > 0) {
      const newConfig = {
        ...config,
        directions: newDirections
      };
      setConfig(newConfig);
    }
  };

  const handleGridStyleChange = (key: string, value: number | boolean) => {
    const newConfig = {
      ...config,
      gridStyle: {
        ...config.gridStyle,
        [key]: value
      }
    };
    setConfig(newConfig);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = PAGE_SIZES.find(s => s.label === e.target.value);
    if (size) {
      const newConfig = {
        ...config,
        pageSize: size
      };
      setConfig(newConfig);
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = FONT_OPTIONS.find(f => f.value === e.target.value);
    if (font) {
      const newConfig = {
        ...config,
        font: font
      };
      setConfig(newConfig);
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
          gridStyle={config.gridStyle}
          onGridSizeChange={(value) => handleConfigChange('gridSize', value)}
          onAllowBackwardsChange={(value) => handleConfigChange('allowBackwards', value)}
          onDirectionChange={handleDirectionChange}
          onGridStyleChange={handleGridStyleChange}
        />

        <HighlightSettings
          highlightStyle={config.highlightStyle}
          onHighlightStyleChange={handleHighlightStyleChange}
        />
      </div>

      <button
        onClick={() => setConfig(config)}
        className="w-full px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        disabled={puzzles.length === 0}
      >
        Regenerate All
      </button>
    </div>
  );
}