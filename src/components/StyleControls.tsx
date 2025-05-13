
import { useCanvas } from '@/contexts/CanvasContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const COLORS = [
  '#000000', '#343a40', '#495057', '#868e96',
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff',
];

export const StyleControls = () => {
  const {
    strokeColor,
    fillColor,
    strokeWidth,
    roughness,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    setRoughness,
  } = useCanvas();

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md flex items-center gap-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Label className="text-xs">Stroke</Label>
        <Popover>
          <PopoverTrigger>
            <div
              className="w-6 h-6 rounded-md border border-gray-300 cursor-pointer"
              style={{ backgroundColor: strokeColor }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid grid-cols-6 gap-1 p-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-md hover:scale-110 transition-transform ${
                    color === strokeColor ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setStrokeColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs">Fill</Label>
        <Popover>
          <PopoverTrigger>
            <div
              className={`w-6 h-6 rounded-md border border-gray-300 cursor-pointer ${
                fillColor === 'transparent' ? 'bg-transparent relative' : ''
              }`}
              style={{ backgroundColor: fillColor }}
            >
              {fillColor === 'transparent' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[1px] h-full bg-red-500 absolute transform rotate-45" />
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid grid-cols-6 gap-1 p-1">
              <button
                key="transparent"
                className={`w-6 h-6 rounded-md border border-gray-300 hover:scale-110 transition-transform ${
                  fillColor === 'transparent' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setFillColor('transparent')}
              >
                <div className="w-full h-full relative">
                  <div className="w-[1px] h-full bg-red-500 absolute top-0 left-1/2 transform rotate-45" />
                </div>
              </button>
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-md hover:scale-110 transition-transform ${
                    color === fillColor ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFillColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-0.5 w-24">
        <Label className="text-xs">Width</Label>
        <Slider
          value={[strokeWidth]} 
          min={1} 
          max={10} 
          step={1}
          onValueChange={(value) => setStrokeWidth(value[0])}
          className="h-4"
        />
      </div>

      <div className="flex flex-col gap-0.5 w-24">
        <Label className="text-xs">Roughness</Label>
        <Slider
          value={[roughness]} 
          min={0} 
          max={2} 
          step={0.1}
          onValueChange={(value) => setRoughness(value[0])}
          className="h-4"
        />
      </div>
    </div>
  );
};

export default StyleControls;
