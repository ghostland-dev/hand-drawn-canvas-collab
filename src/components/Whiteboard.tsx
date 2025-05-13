
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

  // Display welcome toast once on first load
  useEffect(() => {
    toast({
      title: "Welcome to Whiteboard",
      description: "Press '?' to view keyboard shortcuts",
      duration: 5000,
    });
  }, [toast]);

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
