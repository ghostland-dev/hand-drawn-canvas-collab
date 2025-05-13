
import { useState, useRef, RefObject } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';

const useDrawingHandlers = (canvasRef: RefObject<HTMLCanvasElement>, roughCanvasRef: RefObject<any>) => {
  const {
    shapes,
    selectedShapeIds,
    activeAction,
    strokeColor,
    fillColor,
    strokeWidth,
    roughness,
    isDrawing,
    setIsDrawing,
    addShape,
    selectShape,
    deselectShapes,
    updateShape,
  } = useCanvas();

  const drawStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const [tempDrawingElement, setTempDrawingElement] = useState<any>(null);
  const freedrawPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Canvas mouse position relative to canvas
  const getCanvasMousePosition = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const { pan, zoom } = useCanvas();
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button

    const startPos = getCanvasMousePosition(e);
    drawStartPosRef.current = startPos;
    
    if (activeAction === 'select') {
      // Check if clicked on a shape to select it
      let shapeFound = false;
      
      // Loop through shapes in reverse (to select top-most first)
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (
          startPos.x >= shape.x && 
          startPos.x <= shape.x + shape.width && 
          startPos.y >= shape.y && 
          startPos.y <= shape.y + shape.height
        ) {
          selectShape(shape.id, e.shiftKey);
          shapeFound = true;
          break;
        }
      }
      
      if (!shapeFound && !e.shiftKey) {
        deselectShapes();
      }
      
      // Start drag if a shape is selected
      if (selectedShapeIds.length > 0) {
        setIsDrawing(true);
      }
    } else if (activeAction === 'text') {
      // For text tool, create a text input at the click position
      const text = prompt('Enter text:');
      
      if (text) {
        addShape({
          type: 'text',
          x: startPos.x,
          y: startPos.y,
          width: text.length * 8, // Rough estimate
          height: 20,
          strokeColor,
          fillColor,
          strokeWidth,
          roughness,
          rotation: 0,
          text,
        });
      }
    } else if (activeAction === 'freedraw') {
      setIsDrawing(true);
      freedrawPointsRef.current = [startPos];
      
      setTempDrawingElement({
        shapeType: 'freedraw',
        points: [startPos],
      });
    } else {
      // For other shape tools, start drawing
      setIsDrawing(true);
      
      if (activeAction === 'line' || activeAction === 'arrow') {
        setTempDrawingElement({
          shapeType: activeAction,
          points: [startPos, { ...startPos }] // Start with two identical points
        });
      } else {
        setTempDrawingElement({
          shapeType: activeAction,
          startX: startPos.x,
          startY: startPos.y,
          width: 0,
          height: 0,
        });
      }
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const currentPos = getCanvasMousePosition(e);
    
    if (!isDrawing || !drawStartPosRef.current) return;
    
    if (activeAction === 'select') {
      // If shapes are selected, move them
      if (selectedShapeIds.length > 0) {
        const dx = currentPos.x - drawStartPosRef.current.x;
        const dy = currentPos.y - drawStartPosRef.current.y;
        
        // Update each selected shape
        selectedShapeIds.forEach(id => {
          const shape = shapes.find(s => s.id === id);
          if (shape) {
            updateShape(id, {
              x: shape.x + dx,
              y: shape.y + dy,
            });
          }
        });
        
        // Update the start position for the next move
        drawStartPosRef.current = currentPos;
      }
    } else if (activeAction === 'freedraw') {
      // Add new point to the path
      freedrawPointsRef.current.push(currentPos);
      setTempDrawingElement({
        shapeType: 'freedraw',
        points: [...freedrawPointsRef.current],
      });
    } else {
      // Update the temporary shape dimensions
      const startPos = drawStartPosRef.current;
      
      if (activeAction === 'line' || activeAction === 'arrow') {
        setTempDrawingElement(prev => ({
          ...prev,
          points: [startPos, currentPos]
        }));
      } else {
        const width = currentPos.x - startPos.x;
        const height = currentPos.y - startPos.y;
        
        setTempDrawingElement(prev => ({
          ...prev,
          width,
          height,
        }));
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDrawing || !drawStartPosRef.current) {
      // Reset even if we weren't drawing
      setIsDrawing(false);
      drawStartPosRef.current = null;
      setTempDrawingElement(null);
      return;
    }
    
    if (activeAction === 'select') {
      // End drag operation
      setIsDrawing(false);
      drawStartPosRef.current = null;
      return;
    }
    
    if (!tempDrawingElement) return;
    
    // Create the final shape
    if (activeAction === 'freedraw') {
      if (freedrawPointsRef.current.length > 1) {
        addShape({
          type: 'freedraw',
          x: Math.min(...freedrawPointsRef.current.map(p => p.x)),
          y: Math.min(...freedrawPointsRef.current.map(p => p.y)),
          width: Math.max(...freedrawPointsRef.current.map(p => p.x)) - Math.min(...freedrawPointsRef.current.map(p => p.x)),
          height: Math.max(...freedrawPointsRef.current.map(p => p.y)) - Math.min(...freedrawPointsRef.current.map(p => p.y)),
          strokeColor,
          fillColor,
          strokeWidth,
          roughness,
          rotation: 0,
          points: [...freedrawPointsRef.current],
        });
      }
    } else if (activeAction === 'line' || activeAction === 'arrow') {
      const { points } = tempDrawingElement;
      
      if (points && points.length >= 2 && 
          (points[0].x !== points[1].x || points[0].y !== points[1].y)) {
        // Only add if the points are different
        const minX = Math.min(points[0].x, points[1].x);
        const minY = Math.min(points[0].y, points[1].y);
        const maxX = Math.max(points[0].x, points[1].x);
        const maxY = Math.max(points[0].y, points[1].y);
        
        addShape({
          type: activeAction,
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          strokeColor,
          fillColor,
          strokeWidth,
          roughness,
          rotation: 0,
          points: [
            { x: points[0].x, y: points[0].y },
            { x: points[1].x, y: points[1].y }
          ],
        });
      }
    } else {
      const { startX, startY, width, height } = tempDrawingElement;
      
      // Only add if the shape has some size
      if (Math.abs(width) > 2 && Math.abs(height) > 2) {
        // Ensure positive width/height by adjusting starting point if needed
        const x = width < 0 ? startX + width : startX;
        const y = height < 0 ? startY + height : startY;
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);
        
        addShape({
          type: activeAction as any, // Fix for ShapeType error
          x,
          y,
          width: absWidth,
          height: absHeight,
          strokeColor,
          fillColor,
          strokeWidth,
          roughness,
          rotation: 0,
        });
      }
    }
    
    // Reset drawing state
    setIsDrawing(false);
    drawStartPosRef.current = null;
    setTempDrawingElement(null);
    freedrawPointsRef.current = [];
  };

  return {
    tempDrawingElement,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};

export default useDrawingHandlers;
