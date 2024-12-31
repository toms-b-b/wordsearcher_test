import React from 'react';
import { CheckboxStyle } from '../../types';
import { ColorPicker } from './ColorPicker';
import { Select } from './Select';
import { NumberInput } from './NumberInput';

interface CheckboxSettingsProps {
  checkboxStyle: CheckboxStyle;
  onChange: (newStyle: CheckboxStyle) => void;
}

export function CheckboxSettings({ checkboxStyle, onChange }: CheckboxSettingsProps) {
  const handleChange = <K extends keyof CheckboxStyle>(key: K, value: CheckboxStyle[K]) => {
    onChange({
      ...checkboxStyle,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Checkbox Settings</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Shape</label>
        <Select
          value={checkboxStyle.shape}
          onChange={(value) => handleChange('shape', value as 'rectangle' | 'circle' | 'star')}
          options={[
            { value: 'rectangle', label: 'Rectangle' },
            { value: 'circle', label: 'Circle' },
            { value: 'star', label: 'Star' },
          ]}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Color</label>
        <ColorPicker
          color={checkboxStyle.color}
          onChange={(color) => handleChange('color', color)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Thickness</label>
        <NumberInput
          value={checkboxStyle.thickness}
          onChange={(value) => handleChange('thickness', value)}
          min={0.1}
          max={2}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Size</label>
        <NumberInput
          value={checkboxStyle.size}
          onChange={(value) => handleChange('size', value)}
          min={0.4}
          max={1.5}
          step={0.1}
        />
      </div>
    </div>
  );
}
