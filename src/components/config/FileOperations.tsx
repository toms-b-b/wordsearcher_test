import React, { useRef } from 'react';

interface FileOperationsProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  hasPuzzles: boolean;
}

export function FileOperations({ handleFileUpload, handleDownload, hasPuzzles }: FileOperationsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Upload CSV
      </button>
      <button
        onClick={handleDownload}
        className="flex-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
        disabled={!hasPuzzles}
      >
        Download All
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />
    </div>
  );
}