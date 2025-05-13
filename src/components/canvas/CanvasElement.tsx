
import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { useCanvas } from '@/contexts/CanvasContext';
import ShapeRenderer from './ShapeRenderer';
import TemporaryShapeRenderer from './TemporaryShapeRenderer';
import useDrawingHandlers from '@/hooks/useDrawingHandlers';

const CanvasElement = () => {
  const {
    shapes,
    selectedShapeIds,
    activeAction,
    zoom,
    pan,
  } = useCanvas();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvasRef = useRef<any>(null);
  const [cursorStyle, setCursorStyle] = useState('default');
  
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDrawingHandlers(canvasRef, roughCanvasRef);

  // Initialize RoughJS
  useEffect(() => {
    if (canvasRef.current) {
      roughCanvasRef.current = rough.canvas(canvasRef.current);
    }
  }, []);

  // Update cursor based on active tool
  useEffect(() => {
    switch (activeAction) {
      case 'select':
        setCursorStyle('default');
        break;
      case 'freedraw':
        setCursorStyle('crosshair');
        break;
      default:
        setCursorStyle('crosshair');
    }
  }, [activeAction]);

  // Canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Trigger redraw after resize
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);
        
        ShapeRenderer({ 
          shapes, 
          selectedShapeIds, 
          roughCanvasRef: roughCanvasRef.current, 
          ctx 
        });
        
        ctx.restore();
      }
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [shapes, selectedShapeIds, zoom, pan]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 bg-canvas dark:bg-canvas-dark"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: cursorStyle }}
    />
  );
};

export default CanvasElement;
