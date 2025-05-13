
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsDialog = ({ isOpen, onClose }: KeyboardShortcutsDialogProps) => {
  const shortcuts = [
    {
      category: 'Tools',
      items: [
        { key: 'V', description: 'Select tool' },
        { key: 'R', description: 'Rectangle tool' },
        { key: 'E', description: 'Ellipse tool' },
        { key: 'D', description: 'Diamond tool' },
        { key: 'A', description: 'Arrow tool' },
        { key: 'L', description: 'Line tool' },
        { key: 'T', description: 'Text tool' },
        { key: 'P', description: 'Pen/Freedraw tool' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { key: 'Delete / Backspace', description: 'Delete selected shapes' },
        { key: 'Ctrl + Z', description: 'Undo' },
        { key: 'Ctrl + Shift + Z', description: 'Redo' },
        { key: 'Ctrl + C', description: 'Copy selected shapes' },
        { key: 'Ctrl + V', description: 'Paste shapes' },
        { key: 'Ctrl + X', description: 'Cut selected shapes' },
      ],
    },
    {
      category: 'Navigation',
      items: [
        { key: 'Ctrl + +', description: 'Zoom in' },
        { key: 'Ctrl + -', description: 'Zoom out' },
        { key: 'Ctrl + 0', description: 'Reset zoom and pan' },
        { key: 'Space + drag', description: 'Pan canvas' },
        { key: 'Middle mouse + drag', description: 'Pan canvas' },
        { key: 'Ctrl + scroll', description: 'Zoom canvas' },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex items-center justify-between">
          <div>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these shortcuts to speed up your workflow
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 max-h-[60vh] overflow-y-auto pr-4">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold text-lg mb-3">{category.category}</h3>
              <div className="space-y-3">
                {category.items.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{shortcut.description}</span>
                    <kbd className="ml-3 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded shadow">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pro tip: Press "?" anytime to show this shortcuts dialog.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;
