
import { useEffect, useState } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import StyleControls from './StyleControls';
import NavigationControls from './NavigationControls';
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';
import { useCanvas } from '@/contexts/CanvasContext';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Whiteboard = () => {
  const { toast } = useToast();
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  useKeyboardShortcuts();
  
  const {
    activeAction,
    setZoom,
    setPan,
    setActiveAction,
  } = useCanvas();

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

  // Handle keyboard shortcut for help dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?') {
        setShowShortcutsDialog(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Display welcome toast once on first load
  useEffect(() => {
    toast({
      title: "Welcome to Whiteboard",
      description: "Press '?' to view keyboard shortcuts",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas />
      <Toolbar />
      <StyleControls />
      <NavigationControls />
      
      <Button 
        size="icon"
        variant="outline"
        className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 shadow-md"
        onClick={() => setShowShortcutsDialog(true)}
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      
      <KeyboardShortcutsDialog 
        isOpen={showShortcutsDialog}
        onClose={() => setShowShortcutsDialog(false)}
      />
    </div>
  );
};

export default Whiteboard;
