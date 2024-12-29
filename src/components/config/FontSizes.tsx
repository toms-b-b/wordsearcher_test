import React from 'react';

interface FontSizesProps {
  titleFontSize: number;
  fontSize: number;
  wordBankFontSize: number;
  onTitleFontSizeChange: (value: number) => void;
  onFontSizeChange: (value: number) => void;
  onWordBankFontSizeChange: (value: number) => void;
}

export function FontSizes({
  titleFontSize,
  fontSize,
  wordBankFontSize,
  onTitleFontSizeChange,
  onFontSizeChange,
  onWordBankFontSizeChange
}: FontSizesProps) {
  return (
    <div className="bg-gray-50 p-2 rounded">
      <h3 className="text-sm font-medium mb-1">Font Sizes</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-600">Title</label>
          <input
            type="number"
            value={titleFontSize}
            onChange={(e) => onTitleFontSizeChange(Number(e.target.value))}
            min={8}
            className="w-full text-sm p-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Puzzle</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            min={8}
            className="w-full text-sm p-1 border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Word Bank</label>
          <input
            type="number"
            value={wordBankFontSize}
            onChange={(e) => onWordBankFontSizeChange(Number(e.target.value))}
            min={8}
            className="w-full text-sm p-1 border rounded"
          />
        </div>
      </div>
    </div>
  );
}