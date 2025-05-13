
import { useEffect } from 'react';
import { useCanvas, ActionType } from '@/contexts/CanvasContext';
import { useToast } from '@/hooks/use-toast';

export const useKeyboardShortcuts = () => {
  const {
    setActiveAction,
    deleteSelectedShapes,
    undo,
    redo,
    setZoom,
    zoom,
    setPan,
    pan
  } = useCanvas();
  
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Common keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              redo();
              toast({ title: "Redo", description: "Action restored" });
            } else {
              e.preventDefault();
              undo();
              toast({ title: "Undo", description: "Action reverted" });
            }
            break;
          
          case '+':
          case '=':
            e.preventDefault();
            setZoom(Math.min(zoom * 1.2, 5));
            break;
          
          case '-':
            e.preventDefault();
            setZoom(Math.max(zoom / 1.2, 0.1));
            break;
          
          case '0':
            e.preventDefault();
            setZoom(1);
            setPan({ x: 0, y: 0 });
            toast({ title: "View Reset", description: "Zoom and pan reset to default" });
            break;
            
          default:
            break;
        }
        return;
      }
      
      // Tool selection shortcuts (single key)
      let newTool: ActionType | null = null;
      
      switch (e.key.toLowerCase()) {
        case 'v':
          newTool = 'select';
          break;
        case 'r':
          newTool = 'rectangle';
          break;
        case 'e':
          newTool = 'ellipse';
          break;
        case 'd':
          newTool = 'diamond';
          break;
        case 'a':
          newTool = 'arrow';
          break;
        case 'l':
          newTool = 'line';
          break;
        case 't':
          newTool = 'text';
          break;
        case 'p':
          newTool = 'freedraw';
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteSelectedShapes();
          break;
        default:
          break;
      }
      
      if (newTool) {
        e.preventDefault();
        setActiveAction(newTool);
        toast({
          title: "Tool Selected",
          description: `${newTool.charAt(0).toUpperCase() + newTool.slice(1)} tool activated`,
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActiveAction, deleteSelectedShapes, undo, redo, zoom, setZoom, setPan, toast]);
};

export default useKeyboardShortcuts;
