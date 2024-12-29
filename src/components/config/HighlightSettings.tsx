import React from 'react';
import { HighlightStyle } from '../../types';

interface HighlightSettingsProps {
  highlightStyle: HighlightStyle;
  onHighlightStyleChange: (key: keyof HighlightStyle, value: string | number) => void;
}

export function HighlightSettings({
  highlightStyle,
  onHighlightStyleChange
}: HighlightSettingsProps) {
  return (
    <div className="bg-gray-50 p-2 rounded">
      <h3 className="text-sm font-medium mb-1">Solution Highlight Style</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-600">Color</label>
          <input
            type="color"
            value={highlightStyle.color}
            onChange={(e) => onHighlightStyleChange('color', e.target.value)}
            className="w-8 h-8 p-0 border rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Line Thickness</label>
          <input
            type="number"
            value={highlightStyle.thickness}
            onChange={(e) => onHighlightStyleChange('thickness', Number(e.target.value))}
            step="0.01"
            min="0.01"
            max="0.1"
            className="w-full text-sm p-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Horizontal Padding</label>
          <input
            type="number"
            value={highlightStyle.horizontalPadding}
            onChange={(e) => onHighlightStyleChange('horizontalPadding', Number(e.target.value))}
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
            onChange={(e) => onHighlightStyleChange('verticalPadding', Number(e.target.value))}
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