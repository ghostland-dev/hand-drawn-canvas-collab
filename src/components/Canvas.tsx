
import React, { useRef, useEffect, useState } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import rough from 'roughjs';

const Canvas = () => {
  const {
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
    setIsDrawing,
    addShape,
    selectShape,
    deselectShapes,
    updateShape,
  } = useCanvas();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roughCanvasRef = useRef<any>(null);
  const drawStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const [tempDrawingElement, setTempDrawingElement] = useState<any>(null);
  const [cursorStyle, setCursorStyle] = useState('default');
  
  const freedrawPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Canvas mouse position relative to canvas
  const getCanvasMousePosition = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

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

  // Draw all shapes and selection indicators
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
    shapes.forEach((shape) => {
      switch (shape.type) {
        case 'rectangle':
          const rectOptions = {
            roughness: shape.roughness,
            stroke: shape.strokeColor,
            fill: shape.fillColor !== 'transparent' ? shape.fillColor : undefined,
            strokeWidth: shape.strokeWidth,
          };
          roughCanvasRef.current.rectangle(
            shape.x, shape.y, shape.width, shape.height, rectOptions
          );
          break;
        
        case 'ellipse':
          const ellipseOptions = {
            roughness: shape.roughness,
            stroke: shape.strokeColor,
            fill: shape.fillColor !== 'transparent' ? shape.fillColor : undefined,
            strokeWidth: shape.strokeWidth,
          };
          roughCanvasRef.current.ellipse(
            shape.x + shape.width/2, 
            shape.y + shape.height/2, 
            shape.width, 
            shape.height, 
            ellipseOptions
          );
          break;
        
        case 'diamond':
          const points = [
            { x: shape.x + shape.width / 2, y: shape.y },
            { x: shape.x + shape.width, y: shape.y + shape.height / 2 },
            { x: shape.x + shape.width / 2, y: shape.y + shape.height },
            { x: shape.x, y: shape.y + shape.height / 2 },
          ];
          const diamondOptions = {
            roughness: shape.roughness,
            stroke: shape.strokeColor,
            fill: shape.fillColor !== 'transparent' ? shape.fillColor : undefined,
            strokeWidth: shape.strokeWidth,
          };
          roughCanvasRef.current.polygon(points.map(p => [p.x, p.y]), diamondOptions);
          break;
        
        case 'line':
          if (shape.points && shape.points.length >= 2) {
            const lineOptions = {
              roughness: shape.roughness,
              stroke: shape.strokeColor,
              strokeWidth: shape.strokeWidth,
            };
            roughCanvasRef.current.line(
              shape.points[0].x, 
              shape.points[0].y, 
              shape.points[1].x, 
              shape.points[1].y,
              lineOptions
            );
          }
          break;
        
        case 'arrow':
          if (shape.points && shape.points.length >= 2) {
            const startPoint = shape.points[0];
            const endPoint = shape.points[1];
            
            // Draw the main line
            const arrowOptions = {
              roughness: shape.roughness,
              stroke: shape.strokeColor,
              strokeWidth: shape.strokeWidth,
            };
            
            roughCanvasRef.current.line(
              startPoint.x, 
              startPoint.y, 
              endPoint.x, 
              endPoint.y,
              arrowOptions
            );
            
            // Draw the arrow head
            const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
            const arrowSize = 10 + shape.strokeWidth;
            
            const arrowPoint1 = {
              x: endPoint.x - arrowSize * Math.cos(angle - Math.PI / 6),
              y: endPoint.y - arrowSize * Math.sin(angle - Math.PI / 6)
            };
            
            const arrowPoint2 = {
              x: endPoint.x - arrowSize * Math.cos(angle + Math.PI / 6),
              y: endPoint.y - arrowSize * Math.sin(angle + Math.PI / 6)
            };
            
            roughCanvasRef.current.line(
              endPoint.x, 
              endPoint.y, 
              arrowPoint1.x, 
              arrowPoint1.y,
              arrowOptions
            );
            
            roughCanvasRef.current.line(
              endPoint.x, 
              endPoint.y, 
              arrowPoint2.x, 
              arrowPoint2.y,
              arrowOptions
            );
          }
          break;
        
        case 'text':
          if (shape.text) {
            ctx.font = `${14 * (shape.strokeWidth / 2)}px 'Comic Sans MS', cursive`;
            ctx.fillStyle = shape.strokeColor;
            ctx.fillText(shape.text, shape.x, shape.y + 14);
          }
          break;
        
        case 'freedraw':
          if (shape.points && shape.points.length > 1) {
            const options = {
              roughness: shape.roughness,
              stroke: shape.strokeColor,
              strokeWidth: shape.strokeWidth,
            };
            
            for (let i = 1; i < shape.points.length; i++) {
              roughCanvasRef.current.line(
                shape.points[i-1].x,
                shape.points[i-1].y,
                shape.points[i].x,
                shape.points[i].y,
                options
              );
            }
          }
          break;
      }
      
      // Draw selection indicators for selected shapes
      if (selectedShapeIds.includes(shape.id)) {
        ctx.strokeStyle = '#3b82f6';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.strokeRect(
          shape.x - 5, 
          shape.y - 5, 
          shape.width + 10, 
          shape.height + 10
        );
        ctx.setLineDash([]);
        
        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#3b82f6';
        
        // Corners
        [
          { x: shape.x - handleSize/2, y: shape.y - handleSize/2 },
          { x: shape.x + shape.width - handleSize/2, y: shape.y - handleSize/2 },
          { x: shape.x - handleSize/2, y: shape.y + shape.height - handleSize/2 },
          { x: shape.x + shape.width - handleSize/2, y: shape.y + shape.height - handleSize/2 }
        ].forEach(point => {
          ctx.fillRect(point.x, point.y, handleSize, handleSize);
          ctx.strokeRect(point.x, point.y, handleSize, handleSize);
        });
      }
    });
    
    // Draw temporary shape while drawing
    if (tempDrawingElement && drawStartPosRef.current) {
      const { shapeType, startX, startY, width, height, points } = tempDrawingElement;
      
      switch (shapeType) {
        case 'rectangle':
          roughCanvasRef.current.rectangle(
            startX, startY, width, height, 
            { 
              roughness, 
              stroke: strokeColor,
              fill: fillColor !== 'transparent' ? fillColor : undefined,
              strokeWidth 
            }
          );
          break;
        
        case 'ellipse':
          roughCanvasRef.current.ellipse(
            startX + width/2, startY + height/2, width, height,
            { 
              roughness, 
              stroke: strokeColor,
              fill: fillColor !== 'transparent' ? fillColor : undefined,
              strokeWidth 
            }
          );
          break;
        
        case 'diamond':
          const diamondPoints = [
            { x: startX + width / 2, y: startY },
            { x: startX + width, y: startY + height / 2 },
            { x: startX + width / 2, y: startY + height },
            { x: startX, y: startY + height / 2 },
          ];
          roughCanvasRef.current.polygon(
            diamondPoints.map(p => [p.x, p.y]), 
            { 
              roughness, 
              stroke: strokeColor,
              fill: fillColor !== 'transparent' ? fillColor : undefined,
              strokeWidth 
            }
          );
          break;
        
        case 'line':
          if (points && points.length >= 2) {
            roughCanvasRef.current.line(
              points[0].x, points[0].y, points[1].x, points[1].y,
              { roughness, stroke: strokeColor, strokeWidth }
            );
          }
          break;
        
        case 'arrow':
          if (points && points.length >= 2) {
            const startPoint = points[0];
            const endPoint = points[1];
            
            roughCanvasRef.current.line(
              startPoint.x, startPoint.y, endPoint.x, endPoint.y,
              { roughness, stroke: strokeColor, strokeWidth }
            );
            
            // Draw arrow head
            const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
            const arrowSize = 10 + strokeWidth;
            
            const arrowPoint1 = {
              x: endPoint.x - arrowSize * Math.cos(angle - Math.PI / 6),
              y: endPoint.y - arrowSize * Math.sin(angle - Math.PI / 6)
            };
            
            const arrowPoint2 = {
              x: endPoint.x - arrowSize * Math.cos(angle + Math.PI / 6),
              y: endPoint.y - arrowSize * Math.sin(angle + Math.PI / 6)
            };
            
            roughCanvasRef.current.line(
              endPoint.x, endPoint.y, arrowPoint1.x, arrowPoint1.y,
              { roughness, stroke: strokeColor, strokeWidth }
            );
            
            roughCanvasRef.current.line(
              endPoint.x, endPoint.y, arrowPoint2.x, arrowPoint2.y,
              { roughness, stroke: strokeColor, strokeWidth }
            );
          }
          break;
        
        case 'freedraw':
          if (points && points.length > 1) {
            for (let i = 1; i < points.length; i++) {
              roughCanvasRef.current.line(
                points[i-1].x, points[i-1].y, points[i].x, points[i].y,
                { roughness, stroke: strokeColor, strokeWidth }
              );
            }
          }
          break;
      }
    }
    
    ctx.restore();
  };

  // Redraw canvas when any of these values change
  useEffect(() => {
    drawAllShapes();
  }, [shapes, selectedShapeIds, zoom, pan, tempDrawingElement]);

  // Canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      drawAllShapes();
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

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

export default Canvas;
