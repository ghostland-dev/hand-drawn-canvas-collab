
import React from 'react';
import { Shape } from '@/contexts/CanvasContext';

interface ShapeRendererProps {
  shapes: Shape[];
  selectedShapeIds: string[];
  roughCanvasRef: any;
  ctx: CanvasRenderingContext2D;
}

const ShapeRenderer = ({ shapes, selectedShapeIds, roughCanvasRef, ctx }: ShapeRendererProps) => {
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
        roughCanvasRef.rectangle(
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
        roughCanvasRef.ellipse(
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
        roughCanvasRef.polygon(points.map(p => [p.x, p.y]), diamondOptions);
        break;
      
      case 'line':
        if (shape.points && shape.points.length >= 2) {
          const lineOptions = {
            roughness: shape.roughness,
            stroke: shape.strokeColor,
            strokeWidth: shape.strokeWidth,
          };
          roughCanvasRef.line(
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
          
          roughCanvasRef.line(
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
          
          roughCanvasRef.line(
            endPoint.x, 
            endPoint.y, 
            arrowPoint1.x, 
            arrowPoint1.y,
            arrowOptions
          );
          
          roughCanvasRef.line(
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
            roughCanvasRef.line(
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

  return null; // This is a rendering utility, not a React component that renders DOM elements
};

export default ShapeRenderer;
