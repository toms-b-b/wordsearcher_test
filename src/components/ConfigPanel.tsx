import React from 'react';
import { PuzzleConfig, Direction, HighlightStyle, CheckboxStyle, GridStyle } from '../types';
import { FileOperations } from './config/FileOperations';
import { PageSettings } from './config/PageSettings';
import { FontSizes } from './config/FontSizes';
import { GridSettings } from './config/GridSettings';
import { HighlightSettings } from './config/HighlightSettings';
import { CheckboxSettings } from './config/CheckboxSettings';
import { PAGE_SIZES, FONT_OPTIONS, DEFAULT_FONT } from '../utils/default_constants';
import { Accordion } from './common/Accordion';

interface ConfigPanelProps {
  config: PuzzleConfig;
  minGridSize: number;
  puzzles: PuzzleConfig[];
  setConfig: (config: Partial<PuzzleConfig>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
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

  const handleCheckboxStyleChange = (newStyle: CheckboxStyle) => {
    handleConfigChange('checkboxStyle', newStyle);
  };

  const handleGridStyleChange = (newStyle: GridStyle) => {
    handleConfigChange('gridStyle', newStyle);
  };

  const handleHighlightStyleChange = (newStyle: HighlightStyle) => {
    handleConfigChange('highlightStyle', newStyle);
  };

  const handleDirectionChange = (direction: Direction, checked: boolean) => {
    const newDirections = checked
      ? [...config.directions, direction]
      : config.directions.filter(d => d !== direction);
    handleConfigChange('directions', newDirections);
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

      {/* Left Column */}
      <div className="space-y-4">
        {/* Page Settings */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Page Settings</h3>
          <PageSettings
            pageSize={config.pageSize}
            font={config.font}
            onPageSizeChange={handlePageSizeChange}
            onFontChange={(e) => handleConfigChange('font', FONT_OPTIONS.find(f => f.value === e.target.value) || DEFAULT_FONT)}
          />
        </div>

        {/* Font Sizes */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
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
      </div>

      {/* Middle Column */}
      <div className="space-y-4">
        {/* Grid Settings */}
        <Accordion title="Grid Settings" defaultOpen={true}>
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
        </Accordion>

        {/* Checkbox Settings */}
        <Accordion title="Checkbox Settings" defaultOpen={true}>
          <CheckboxSettings
            checkboxStyle={config.checkboxStyle}
            onChange={handleCheckboxStyleChange}
          />
        </Accordion>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Highlight Settings */}
        <Accordion title="Highlight Settings" defaultOpen={true}>
          <HighlightSettings
            highlightStyle={config.highlightStyle}
            onChange={handleHighlightStyleChange}
          />
        </Accordion>
      </div>
    </div>
  );
}