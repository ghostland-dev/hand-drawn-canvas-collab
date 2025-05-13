
import { Button } from '@/components/ui/button';
import { useCanvas } from '@/contexts/CanvasContext';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const NavigationControls = () => {
  const {
    zoom,
    setZoom,
    pan,
    setPan
  } = useCanvas();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.1));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-md flex gap-1 border border-gray-200 dark:border-gray-700">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-9 w-9 rounded-md hover:bg-muted"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Zoom In (Ctrl+Plus)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-9 w-9 rounded-md hover:bg-muted"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Zoom Out (Ctrl+Minus)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-9 w-9 rounded-md hover:bg-muted"
          >
            <Move className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Reset View (Ctrl+0)</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center px-2 text-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

export default NavigationControls;
