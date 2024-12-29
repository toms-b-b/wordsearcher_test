import React from 'react';
import { HighlightStyle } from '../../types';
import { Tooltip } from '../common/Tooltip';

interface HighlightSettingsProps {
  highlightStyle: HighlightStyle;
  onChange: (key: keyof HighlightStyle, value: string | number) => void;
}

export function HighlightSettings({ highlightStyle, onChange }: HighlightSettingsProps) {
  const handleThicknessChange = (value: number | string) => {
    const displayValue = typeof value === 'string' ? parseInt(value) : value;
    if (!isNaN(displayValue)) {
      // Clamp display value between 1 and 100
      const clampedDisplayValue = Math.min(Math.max(displayValue, 1), 100);
      // Convert display value (1-100) to actual value (0.01-0.1)
      const actualValue = 0.01 + ((clampedDisplayValue - 1) / 99) * 0.09;
      onChange('thickness', actualValue);
    }
  };

  // Convert actual value (0.01-0.1) to display value (1-100)
  const getDisplayValue = (actualValue: number): number => {
    return Math.round(((actualValue - 0.01) / 0.09) * 99) + 1;
  };

  return (
    <div className="bg-gray-50 p-2 rounded">
      <h3 className="text-sm font-medium mb-1">Solution Highlight Style</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-600">Color</label>
          <input
            type="color"
            value={highlightStyle.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-8 h-8 p-0 border rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Line Thickness</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              value={getDisplayValue(highlightStyle.thickness)}
              onChange={(e) => handleThicknessChange(e.target.value)}
              min="1"
              max="100"
              className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
            />
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={getDisplayValue(highlightStyle.thickness)}
            onChange={(e) => handleThicknessChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Horizontal Padding</label>
          <input
            type="number"
            value={highlightStyle.horizontalPadding}
            onChange={(e) => onChange('horizontalPadding', Number(e.target.value))}
            step="0.1"
            min="0.8"
            max="2"
            className="w-full text-sm p-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Vertical Padding</label>
          <input
            type="number"
            value={highlightStyle.verticalPadding}
            onChange={(e) => onChange('verticalPadding', Number(e.target.value))}
            step="0.1"
            min="0.8"
            max="2"
            className="w-full text-sm p-1 border rounded"
          />
        </div>
      </div>
    </div>
  );
}