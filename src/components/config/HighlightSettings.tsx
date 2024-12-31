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

  const handlePaddingChange = (key: 'horizontalPadding' | 'verticalPadding', value: number | string) => {
    const displayValue = typeof value === 'string' ? parseInt(value) : value;
    if (!isNaN(displayValue)) {
      // Clamp display value between 1 and 100
      const clampedDisplayValue = Math.min(Math.max(displayValue, 1), 100);
      // Convert display value (1-100) to actual value (0.5-1.5)
      const actualValue = 0.5 + ((clampedDisplayValue - 1) / 99);
      onChange(key, actualValue);
    }
  };

  // Convert actual value (0.01-0.1) to display value (1-100)
  const getThicknessDisplayValue = (actualValue: number): number => {
    return Math.round(((actualValue - 0.01) / 0.09) * 99) + 1;
  };

  // Convert actual value (0.5-1.5) to display value (1-100)
  const getPaddingDisplayValue = (actualValue: number): number => {
    return Math.round(((actualValue - 0.5) / 1) * 99) + 1;
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
              type="range"
              value={getThicknessDisplayValue(highlightStyle.thickness)}
              onChange={(e) => handleThicknessChange(e.target.value)}
              min="1"
              max="100"
              className="flex-1"
            />
            <input
              type="number"
              value={getThicknessDisplayValue(highlightStyle.thickness)}
              onChange={(e) => handleThicknessChange(e.target.value)}
              min="1"
              max="100"
              className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
            />
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600">Horizontal Padding</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="range"
              value={getPaddingDisplayValue(highlightStyle.horizontalPadding)}
              onChange={(e) => handlePaddingChange('horizontalPadding', e.target.value)}
              min="1"
              max="100"
              className="flex-1"
            />
            <input
              type="number"
              value={getPaddingDisplayValue(highlightStyle.horizontalPadding)}
              onChange={(e) => handlePaddingChange('horizontalPadding', e.target.value)}
              min="1"
              max="100"
              className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
            />
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600">Vertical Padding</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="range"
              value={getPaddingDisplayValue(highlightStyle.verticalPadding)}
              onChange={(e) => handlePaddingChange('verticalPadding', e.target.value)}
              min="1"
              max="100"
              className="flex-1"
            />
            <input
              type="number"
              value={getPaddingDisplayValue(highlightStyle.verticalPadding)}
              onChange={(e) => handlePaddingChange('verticalPadding', e.target.value)}
              min="1"
              max="100"
              className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
            />
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}