
import { useEffect, RefObject } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import ShapeRenderer from '@/components/canvas/ShapeRenderer';
import TemporaryShapeRenderer from '@/components/canvas/TemporaryShapeRenderer';

const useCanvasDrawing = (
  canvasRef: RefObject<HTMLCanvasElement>, 
  roughCanvasRef: RefObject<any>,
  tempDrawingElement: any
) => {
  const {
    shapes,
    selectedShapeIds,
    strokeColor,
    fillColor,
    strokeWidth,
    roughness,
    zoom,
    pan,
  } = useCanvas();

  // Redraw canvas when any of these values change
  useEffect(() => {
    const drawAllShapes = () => {
      if (!canvasRef.current || !roughCanvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();
      
      // Apply pan and zoom
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);
      
      // Draw all shapes
      ShapeRenderer({ 
        shapes, 
        selectedShapeIds, 
        roughCanvasRef: roughCanvasRef.current, 
        ctx 
      });
      
      // Draw temporary shape while drawing
      if (tempDrawingElement) {
        TemporaryShapeRenderer({
          tempDrawingElement,
          roughCanvasRef: roughCanvasRef.current,
          strokeColor,
          fillColor,
          strokeWidth,
          roughness
        });
      }
      
      ctx.restore();
    };
    
    drawAllShapes();
  }, [
    shapes, 
    selectedShapeIds, 
    zoom, 
    pan, 
    tempDrawingElement, 
    canvasRef, 
    roughCanvasRef,
    strokeColor,
    fillColor,
    strokeWidth,
    roughness
  ]);
};

export default useCanvasDrawing;
