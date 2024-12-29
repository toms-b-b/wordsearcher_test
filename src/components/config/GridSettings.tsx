import React from 'react';
import { Direction } from '../../types';
import { BASE_DIRECTIONS, MAX_GRID_SIZE } from '../../utils/constants';

interface GridSettingsProps {
  gridSize: number;
  minGridSize: number;
  allowBackwards: boolean;
  directions: Direction[];
  onGridSizeChange: (value: number) => void;
  onAllowBackwardsChange: (value: boolean) => void;
  onDirectionChange: (direction: Direction, checked: boolean) => void;
}

export function GridSettings({
  gridSize,
  minGridSize,
  allowBackwards,
  directions,
  onGridSizeChange,
  onAllowBackwardsChange,
  onDirectionChange
}: GridSettingsProps) {
  return (
    <div className="bg-gray-50 p-2 rounded">
      <h3 className="text-sm font-medium mb-1">Grid Settings</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-xs text-gray-600">Grid Size</label>
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
          <label className="flex items-center text-xs text-gray-600">
            <input
              type="checkbox"
              checked={allowBackwards}
              onChange={(e) => onAllowBackwardsChange(e.target.checked)}
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
                  checked={directions.includes(direction)}
                  onChange={(e) => onDirectionChange(direction, e.target.checked)}
                  className="mr-1"
                />
                {direction}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}