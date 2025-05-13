
import { useEffect } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';

interface UseGesturesOptions {
  activeAction: string;
  setActiveAction: (action: any) => void;
}

const useGestures = ({ activeAction, setActiveAction }: UseGesturesOptions) => {
  const { setZoom, setPan } = useCanvas();

  useEffect(() => {
    // Handle middle mouse button for panning
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) { // Middle mouse button
        e.preventDefault();
        
        // Temporarily switch to select tool for panning
        const prevTool = activeAction;
        setActiveAction('select');
        
        const startX = e.clientX;
        const startY = e.clientY;
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
          setPan((prev) => ({
            x: prev.x + moveEvent.clientX - startX,
            y: prev.y + moveEvent.clientY - startY,
          }));
        };
        
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          
          // Restore previous tool
          setActiveAction(prevTool);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };
    
    // Handle wheel for zooming
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        
        const delta = e.deltaY;
        const direction = delta > 0 ? -1 : 1;
        const factor = 0.1;
        
        setZoom((prev) => {
          const newZoom = prev * (1 + factor * direction);
          return Math.min(Math.max(0.1, newZoom), 5);
        });
      }
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [activeAction, setActiveAction, setZoom, setPan]);

  return null; // This hook only handles effects
};

export default useGestures;
