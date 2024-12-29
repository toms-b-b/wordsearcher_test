import React from 'react';
import { PAGE_SIZES, FONT_OPTIONS } from '../../utils/constants';
import { PageSize, FontOption } from '../../types';

interface PageSettingsProps {
  pageSize: PageSize;
  font: FontOption;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFontChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PageSettings({ 
  pageSize, 
  font, 
  onPageSizeChange, 
  onFontChange 
}: PageSettingsProps) {
  return (
    <div className="bg-gray-50 p-2 rounded">
      <h3 className="text-sm font-medium mb-1">Page Settings</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600">Page Size</label>
          <select
            value={pageSize.label}
            onChange={onPageSizeChange}
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
            value={font.value}
            onChange={onFontChange}
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
  );
}