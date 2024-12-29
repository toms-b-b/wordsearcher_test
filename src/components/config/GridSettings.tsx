import React from 'react';
import { Direction } from '../../types';
import { BASE_DIRECTIONS, MAX_GRID_SIZE } from '../../utils/constants';
import { Toggle } from './Toggle';

interface GridSettingsProps {
  gridSize: number;
  minGridSize: number;
  allowBackwards: boolean;
  directions: Direction[];
  gridStyle: {
    showOuterBorder: boolean;
    outerBorderWidth: number;
    showCellBorders: boolean;
    cellBorderWidth: number;
    letterPadding: number;
  };
  onGridSizeChange: (value: number) => void;
  onAllowBackwardsChange: (value: boolean) => void;
  onDirectionChange: (direction: Direction, checked: boolean) => void;
  onGridStyleChange: (key: string, value: number | boolean) => void;
}

export function GridSettings({
  gridSize,
  minGridSize,
  allowBackwards,
  directions,
  gridStyle,
  onGridSizeChange,
  onAllowBackwardsChange,
  onDirectionChange,
  onGridStyleChange
}: GridSettingsProps) {
  return (
    <div className="bg-gray-50 p-2 rounded space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-1">Grid Size</h3>
        <input
          type="number"
          value={gridSize}
          onChange={(e) => onGridSizeChange(Number(e.target.value))}
          min={minGridSize}
          max={MAX_GRID_SIZE}
          className="w-full text-sm p-1 border rounded"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1">Word Placement</h3>
        <div className="space-y-2">
          <Toggle
            label="Allow Backwards Words"
            checked={allowBackwards}
            onChange={onAllowBackwardsChange}
          />
          <div className="space-y-1">
            <label className="block text-xs text-gray-600">Word Directions</label>
            <div className="flex gap-2">
              {BASE_DIRECTIONS.map((direction) => (
                <Toggle
                  key={direction}
                  label={direction}
                  checked={directions.includes(direction)}
                  onChange={(checked) => onDirectionChange(direction, checked)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1">Grid Style</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <Toggle
              label="Show Outer Border"
              checked={gridStyle.showOuterBorder}
              onChange={(checked) => onGridStyleChange('showOuterBorder', checked)}
            />
            {gridStyle.showOuterBorder && (
              <div>
                <label className="block text-xs text-gray-600">Outer Border Thickness</label>
                <input
                  type="number"
                  value={gridStyle.outerBorderWidth}
                  onChange={(e) => onGridStyleChange('outerBorderWidth', Number(e.target.value))}
                  step="0.01"
                  min="0.01"
                  max="0.1"
                  className="w-full text-sm p-1 border rounded"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Toggle
              label="Show Cell Borders"
              checked={gridStyle.showCellBorders}
              onChange={(checked) => onGridStyleChange('showCellBorders', checked)}
            />
            {gridStyle.showCellBorders && (
              <div>
                <label className="block text-xs text-gray-600">Cell Border Thickness</label>
                <input
                  type="number"
                  value={gridStyle.cellBorderWidth}
                  onChange={(e) => onGridStyleChange('cellBorderWidth', Number(e.target.value))}
                  step="0.01"
                  min="0.01"
                  max="0.1"
                  className="w-full text-sm p-1 border rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-600">Letter Padding</label>
            <input
              type="number"
              value={gridStyle.letterPadding}
              onChange={(e) => onGridStyleChange('letterPadding', Number(e.target.value))}
              step="0.01"
              min="0"
              max="0.1"
              className="w-full text-sm p-1 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}