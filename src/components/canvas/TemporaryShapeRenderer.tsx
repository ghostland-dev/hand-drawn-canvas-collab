
import React from 'react';

interface TemporaryShapeRendererProps {
  tempDrawingElement: any;
  roughCanvasRef: any;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  roughness: number;
}

const TemporaryShapeRenderer = ({ 
  tempDrawingElement, 
  roughCanvasRef, 
  strokeColor,
  fillColor,
  strokeWidth,
  roughness 
}: TemporaryShapeRendererProps) => {
  if (!tempDrawingElement) return null;
  
  const { shapeType, startX, startY, width, height, points } = tempDrawingElement;
  
  switch (shapeType) {
    case 'rectangle':
      roughCanvasRef.rectangle(
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
      roughCanvasRef.ellipse(
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
      roughCanvasRef.polygon(
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
        roughCanvasRef.line(
          points[0].x, points[0].y, points[1].x, points[1].y,
          { roughness, stroke: strokeColor, strokeWidth }
        );
      }
      break;
    
    case 'arrow':
      if (points && points.length >= 2) {
        const startPoint = points[0];
        const endPoint = points[1];
        
        roughCanvasRef.line(
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
        
        roughCanvasRef.line(
          endPoint.x, endPoint.y, arrowPoint1.x, arrowPoint1.y,
          { roughness, stroke: strokeColor, strokeWidth }
        );
        
        roughCanvasRef.line(
          endPoint.x, endPoint.y, arrowPoint2.x, arrowPoint2.y,
          { roughness, stroke: strokeColor, strokeWidth }
        );
      }
      break;
    
    case 'freedraw':
      if (points && points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          roughCanvasRef.line(
            points[i-1].x, points[i-1].y, points[i].x, points[i].y,
            { roughness, stroke: strokeColor, strokeWidth }
          );
        }
      }
      break;
  }

  return null;
};

export default TemporaryShapeRenderer;
