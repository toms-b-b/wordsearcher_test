import { Direction, GridStyle } from '../../types';
import { BASE_DIRECTIONS, MAX_GRID_SIZE } from '../../utils/default_constants';
import { Toggle } from './Toggle';
import { Tooltip } from '../common/Tooltip';

interface GridSettingsProps {
  gridSize: number;
  minGridSize: number;
  allowBackwards: boolean;
  directions: Direction[];
  gridStyle: GridStyle;
  onGridSizeChange: (value: number) => void;
  onAllowBackwardsChange: (value: boolean) => void;
  onDirectionChange: (direction: Direction, checked: boolean) => void;
  onGridStyleChange: (newStyle: GridStyle) => void;
}

export function GridSettings({
  gridSize,
  minGridSize,
  allowBackwards,
  directions = BASE_DIRECTIONS,
  gridStyle,
  onGridSizeChange,
  onAllowBackwardsChange,
  onDirectionChange,
  onGridStyleChange,
}: GridSettingsProps) {
  const directionColors: Record<Direction, 'purple' | 'blue' | 'green' | 'amber'> = {
    horizontal: 'blue',
    vertical: 'green',
    diagonal: 'amber'
  };

  const handleGridStyleChange = (key: keyof GridStyle, value: number | boolean) => {
    onGridStyleChange({
      ...gridStyle,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Tooltip content="Size of the puzzle grid. Larger grids will have more space for words and make the puzzle more challenging.">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 cursor-help">
            Grid Size
          </h3>
        </Tooltip>
        <input
          type="number"
          value={gridSize}
          onChange={(e) => onGridSizeChange(Number(e.target.value))}
          min={minGridSize}
          max={MAX_GRID_SIZE}
          className="w-full text-sm p-1.5 border rounded-md focus:ring-1 focus:ring-purple-300 focus:border-purple-300"
        />
      </div>

      <div>
        <Tooltip content="Configure how words can be placed in the puzzle grid.">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 cursor-help">
            Word Placement
          </h3>
        </Tooltip>
        <div className="space-y-3">
          <Tooltip content="Allow words to be written backwards in the puzzle, making it more challenging.">
            <div>
              <Toggle
                label="Allow Backward Words"
                checked={allowBackwards}
                onChange={onAllowBackwardsChange}
                color="purple"
              />
            </div>
          </Tooltip>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Word Directions
            </label>
            <div className="space-y-2">
              {BASE_DIRECTIONS.map((direction) => (
                <Tooltip 
                  key={direction}
                  content={`Allow words to be placed ${direction}ly in the puzzle`}
                  position="right"
                >
                  <div>
                    <Toggle
                      key={direction}
                      label={direction.charAt(0).toUpperCase() + direction.slice(1).toLowerCase()}
                      checked={directions.includes(direction)}
                      onChange={(checked) => onDirectionChange(direction, checked)}
                      color={directionColors[direction]}
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Grid Style</h3>
        <div className="space-y-3">
          <Tooltip content="Show or hide the outer border of the puzzle grid">
            <div>
              <Toggle
                label="Show Outer Border"
                checked={gridStyle.showOuterBorder}
                onChange={(checked) => handleGridStyleChange('showOuterBorder', checked)}
                color="purple"
              />
            </div>
          </Tooltip>

          <Tooltip content="Show or hide the borders between cells">
            <div>
              <Toggle
                label="Show Cell Borders"
                checked={gridStyle.showCellBorders}
                onChange={(checked) => handleGridStyleChange('showCellBorders', checked)}
                color="purple"
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}