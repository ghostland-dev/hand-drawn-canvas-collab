
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Keyboard, 
  MousePointer, 
  Circle, 
  Square, 
  ArrowRight,
  Diamond,
  Type,
  Pencil,
} from 'lucide-react';

const TutorialPage = () => {
  const navigate = useNavigate();

  const keyboardShortcuts = [
    { key: 'v', description: 'Select tool' },
    { key: 'r', description: 'Rectangle tool' },
    { key: 'e', description: 'Ellipse tool' },
    { key: 'd', description: 'Diamond tool' },
    { key: 'a', description: 'Arrow tool' },
    { key: 'l', description: 'Line tool' },
    { key: 't', description: 'Text tool' },
    { key: 'p', description: 'Pen/freedraw tool' },
    { key: 'Del/Backspace', description: 'Delete selected shapes' },
    { key: 'Ctrl+Z', description: 'Undo' },
    { key: 'Ctrl+Shift+Z', description: 'Redo' },
    { key: 'Ctrl++', description: 'Zoom in' },
    { key: 'Ctrl+-', description: 'Zoom out' },
    { key: 'Ctrl+0', description: 'Reset zoom' },
    { key: 'Space+Drag', description: 'Pan canvas' },
    { key: 'Middle mouse button+Drag', description: 'Pan canvas' },
    { key: 'Shift+select', description: 'Multi-select' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tutorial & Help
          </h1>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <Tabs defaultValue="basics">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Getting Started with Whiteboard</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Creating a New Whiteboard</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  From the home page, click on the "New Whiteboard" button or the "+" card to create a new whiteboard. 
                  You'll be taken to a blank canvas where you can start drawing and creating.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Navigation</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  - <strong>Pan:</strong> Hold the Space key or middle mouse button and drag to pan around the canvas.<br />
                  - <strong>Zoom:</strong> Use Ctrl + Mouse Wheel to zoom in and out, or use the zoom controls in the bottom right corner.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Selecting & Manipulating Objects</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  - Click on an object to select it.<br />
                  - Hold Shift and click to select multiple objects.<br />
                  - Drag selected objects to move them.<br />
                  - Use the handles around selected objects to resize them.<br />
                  - Press Delete or Backspace to remove selected objects.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Sharing & Collaborating</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  - Click the "Share" button in the top right corner to generate a shareable link.<br />
                  - You can choose whether others can edit or just view your whiteboard.<br />
                  - Multiple people can work on the same whiteboard simultaneously.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Use keyboard shortcuts to speed up your workflow. Press the "?" key or visit the Shortcuts tab to see all available shortcuts.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Drawing & Editing Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <MousePointer className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Select (V)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click to select, move, and resize objects. Hold Shift to select multiple elements.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <Square className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Rectangle (R)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click and drag to draw rectangles and squares. Hold Shift for perfect squares.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <Circle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ellipse (E)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click and drag to draw ellipses and circles. Hold Shift for perfect circles.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <Diamond className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Diamond (D)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click and drag to draw diamond shapes. Great for flowcharts.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Arrow (A)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click and drag to draw arrows. Perfect for showing connections and flows.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <Type className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Text (T)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click anywhere to add text. Click on existing text to edit it.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mr-4">
                  <Pencil className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Freedraw (P)</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click and drag to draw freely. Great for annotations and sketches.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Style Controls</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Use the style controls at the top of the screen to customize the appearance of your shapes:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300">
                <li>Change stroke and fill colors</li>
                <li>Adjust line thickness</li>
                <li>Control the roughness for that hand-drawn look</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="shortcuts" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <Keyboard className="h-6 w-6 mr-2" />
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0 w-24">
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                      {shortcut.key}
                    </kbd>
                  </div>
                  <div className="ml-3 text-gray-700 dark:text-gray-300">
                    {shortcut.description}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Mouse & Gesture Controls</h3>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                <li><strong>Middle mouse button + drag:</strong> Pan the canvas</li>
                <li><strong>Ctrl + scroll wheel:</strong> Zoom in and out</li>
                <li><strong>Click and drag:</strong> Draw shape or select area depending on active tool</li>
                <li><strong>Shift + click:</strong> Add to selection</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TutorialPage;
