
import { createContext, useContext, ReactNode, useState, useRef, useCallback } from 'react';

// Types for our drawing elements
export type ShapeType = 'rectangle' | 'ellipse' | 'diamond' | 'arrow' | 'line' | 'text' | 'freedraw';
export type ActionType = 'select' | ShapeType;

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  rotation: number;
  roughness: number;
  points?: { x: number; y: number }[]; // For freedraw and lines
  text?: string; // For text elements
}

interface CanvasContextType {
  shapes: Shape[];
  selectedShapeIds: string[];
  activeAction: ActionType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  roughness: number;
  zoom: number;
  pan: { x: number; y: number };
  isDrawing: boolean;
  
  // Actions
  setActiveAction: (action: ActionType) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setRoughness: (roughness: number) => void;
  addShape: (shape: Omit<Shape, "id">) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  selectShape: (id: string, multiSelect?: boolean) => void;
  deselectShapes: () => void;
  deleteSelectedShapes: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  undo: () => void;
  redo: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
}

export const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<ActionType>('select');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('transparent');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [roughness, setRoughness] = useState(1); // 0-2 range for roughness
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  // History for undo/redo
  const historyRef = useRef<Array<Shape[]>>([]);
  const historyPositionRef = useRef<number>(-1);

  // Add a shape to the canvas
  const addShape = useCallback((shapeData: Omit<Shape, "id">) => {
    const newShape: Shape = {
      ...shapeData,
      id: crypto.randomUUID(),
    };
    
    setShapes(prevShapes => {
      const newShapes = [...prevShapes, newShape];
      
      // Add to history for undo/redo
      const newHistory = historyRef.current.slice(0, historyPositionRef.current + 1);
      newHistory.push([...newShapes]);
      historyRef.current = newHistory;
      historyPositionRef.current = newHistory.length - 1;
      
      return newShapes;
    });
  }, []);

  // Update an existing shape
  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    setShapes(prevShapes => {
      const newShapes = prevShapes.map(shape => 
        shape.id === id ? { ...shape, ...updates } : shape
      );
      
      // Add to history for undo/redo
      const newHistory = historyRef.current.slice(0, historyPositionRef.current + 1);
      newHistory.push([...newShapes]);
      historyRef.current = newHistory;
      historyPositionRef.current = newHistory.length - 1;
      
      return newShapes;
    });
  }, []);

  // Select a shape
  const selectShape = useCallback((id: string, multiSelect = false) => {
    setSelectedShapeIds(prev => {
      if (multiSelect) {
        return prev.includes(id) 
          ? prev.filter(shapeId => shapeId !== id)
          : [...prev, id];
      } else {
        return [id];
      }
    });
  }, []);

  // Deselect all shapes
  const deselectShapes = useCallback(() => {
    setSelectedShapeIds([]);
  }, []);

  // Delete selected shapes
  const deleteSelectedShapes = useCallback(() => {
    setShapes(prevShapes => {
      const newShapes = prevShapes.filter(shape => !selectedShapeIds.includes(shape.id));
      
      // Add to history for undo/redo
      const newHistory = historyRef.current.slice(0, historyPositionRef.current + 1);
      newHistory.push([...newShapes]);
      historyRef.current = newHistory;
      historyPositionRef.current = newHistory.length - 1;
      
      return newShapes;
    });
    setSelectedShapeIds([]);
  }, [selectedShapeIds]);

  // Undo
  const undo = useCallback(() => {
    if (historyPositionRef.current > 0) {
      historyPositionRef.current -= 1;
      setShapes([...historyRef.current[historyPositionRef.current]]);
    }
  }, []);

  // Redo
  const redo = useCallback(() => {
    if (historyPositionRef.current < historyRef.current.length - 1) {
      historyPositionRef.current += 1;
      setShapes([...historyRef.current[historyPositionRef.current]]);
    }
  }, []);

  const value = {
    shapes,
    selectedShapeIds,
    activeAction,
    strokeColor,
    fillColor,
    strokeWidth,
    roughness,
    zoom,
    pan,
    isDrawing,
    
    // Actions
    setActiveAction,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    setRoughness,
    addShape,
    updateShape,
    selectShape,
    deselectShapes,
    deleteSelectedShapes,
    setZoom,
    setPan,
    setIsDrawing,
    undo,
    redo,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
