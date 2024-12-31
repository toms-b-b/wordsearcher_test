interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ value, onChange, min, max, step = 1 }: NumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
      />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-20 text-xs p-1 border rounded focus:ring-1 focus:ring-purple-300"
      />
    </div>
  );
}
