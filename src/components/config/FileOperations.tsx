import React, { useRef } from 'react';
import { Tooltip } from '../common/Tooltip';

interface FileOperationsProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  hasPuzzles: boolean;
}

export function FileOperations({ handleFileUpload, handleDownload, hasPuzzles }: FileOperationsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-4">
      <Tooltip content="Upload a CSV file containing Titles and words for your puzzles. Each Puzzle consists of two rows - 1. Title ; 2. All the words divided by comma.">
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Upload CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
        </div>
      </Tooltip>

      <Tooltip content="Download all puzzles as a ZIP file containing PDF files">
        <div>
          <button
            onClick={handleDownload}
            disabled={!hasPuzzles}
            className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Download All
          </button>
        </div>
      </Tooltip>
    </div>
  );
}