
import React from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Minus,
  Type,
  Pencil,
  MousePointer,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';

interface ToolButtonProps {
  active: boolean;
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
}

const ToolButton = ({ active, onClick, tooltip, children }: ToolButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={active ? "default" : "ghost"}
        size="icon"
        onClick={onClick}
        className={`h-10 w-10 rounded-md ${
          active ? 'bg-tool-selected text-white' : 'text-tool hover:bg-muted'
        }`}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export const Toolbar = () => {
  const {
    activeAction,
    setActiveAction,
    undo,
    redo,
    deleteSelectedShapes,
    selectedShapeIds,
  } = useCanvas();

  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-md flex flex-col gap-1 border border-gray-200 dark:border-gray-700">
      <ToolButton
        active={activeAction === 'select'}
        onClick={() => setActiveAction('select')}
        tooltip="Selection (V)"
      >
        <MousePointer className="h-5 w-5" />
      </ToolButton>
      
      <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-1" />
      
      <ToolButton
        active={activeAction === 'rectangle'}
        onClick={() => setActiveAction('rectangle')}
        tooltip="Rectangle (R)"
      >
        <Square className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={activeAction === 'ellipse'}
        onClick={() => setActiveAction('ellipse')}
        tooltip="Ellipse (E)"
      >
        <Circle className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={activeAction === 'diamond'}
        onClick={() => setActiveAction('diamond')}
        tooltip="Diamond (D)"
      >
        <Diamond className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={activeAction === 'arrow'}
        onClick={() => setActiveAction('arrow')}
        tooltip="Arrow (A)"
      >
        <ArrowRight className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={activeAction === 'line'}
        onClick={() => setActiveAction('line')}
        tooltip="Line (L)"
      >
        <Minus className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={activeAction === 'text'}
        onClick={() => setActiveAction('text')}
        tooltip="Text (T)"
      >
        <Type className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={activeAction === 'freedraw'}
        onClick={() => setActiveAction('freedraw')}
        tooltip="Draw (P)"
      >
        <Pencil className="h-5 w-5" />
      </ToolButton>

      <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2 my-1" />

      <ToolButton
        active={false}
        onClick={undo}
        tooltip="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={false}
        onClick={redo}
        tooltip="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-5 w-5" />
      </ToolButton>

      <ToolButton
        active={false}
        onClick={deleteSelectedShapes}
        tooltip="Delete (Del)"
      >
        <Trash2 className={`h-5 w-5 ${selectedShapeIds.length === 0 ? 'opacity-50' : ''}`} />
      </ToolButton>
    </div>
  );
};

export default Toolbar;
