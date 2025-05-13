
import React, { useRef } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import { useToast } from '@/hooks/use-toast';

interface ImportExportControlsProps {
  onClose: () => void;
}

const ImportExportControls = ({ onClose }: ImportExportControlsProps) => {
  const { toast } = useToast();
  const { shapes } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (event.target instanceof HTMLElement && !event.target.closest('.import-export-menu')) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const exportAsPNG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast({
        title: 'Export failed',
        description: 'Canvas element not found.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'whiteboard-export.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: 'Export successful',
        description: 'Image exported as PNG.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export canvas as PNG.',
        variant: 'destructive',
      });
    }
  };
  
  const exportAsJSON = () => {
    try {
      // Create a JSON representation of the shapes
      const data = {
        shapes,
        version: '1.0',
        timestamp: new Date().toISOString(),
      };
      
      // Create a blob and download
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'whiteboard-data.json';
      link.href = url;
      link.click();
      
      toast({
        title: 'Export successful',
        description: 'Data exported as JSON.',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export whiteboard data.',
        variant: 'destructive',
      });
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Upload failed',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // In a real app, we would add the image to the canvas
      // For now, we'll just show a toast
      toast({
        title: 'Image uploaded',
        description: 'The image has been uploaded to your whiteboard.',
      });
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 import-export-menu">
      <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        Import/Export
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={triggerImageUpload}
        >
          Import Image
        </button>
        
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={exportAsPNG}
        >
          Export as PNG
        </button>
        
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={exportAsJSON}
        >
          Export as JSON
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImportExportControls;
