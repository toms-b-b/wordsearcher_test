interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: 'purple' | 'blue' | 'green' | 'amber';
}

export function Toggle({ label, checked, onChange, color = 'purple' }: ToggleProps) {
  const colorClasses = {
    purple: 'peer-checked:bg-purple-600',
    blue: 'peer-checked:bg-blue-600',
    green: 'peer-checked:bg-green-600',
    amber: 'peer-checked:bg-amber-500'
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-9 h-5 bg-gray-200 rounded-full peer ${colorClasses[color]} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full`}></div>
      </div>
      <span className="ml-2 text-sm font-medium text-gray-700">
        {label}
      </span>
    </label>
  );
}