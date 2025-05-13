
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dummy library shapes - in a real app these would come from a database or API
const shapeLibraries = [
  {
    id: 'basic',
    name: 'Basic Shapes',
    items: [
      { id: 'rect', name: 'Rectangle', type: 'rectangle' },
      { id: 'circle', name: 'Circle', type: 'ellipse' },
      { id: 'diamond', name: 'Diamond', type: 'diamond' },
      { id: 'arrow', name: 'Arrow', type: 'arrow' },
    ]
  },
  {
    id: 'flowchart',
    name: 'Flowchart',
    items: [
      { id: 'process', name: 'Process', type: 'rectangle' },
      { id: 'decision', name: 'Decision', type: 'diamond' },
      { id: 'connector', name: 'Connector', type: 'ellipse' },
    ]
  },
  {
    id: 'uml',
    name: 'UML Diagrams',
    items: [
      { id: 'class', name: 'Class', type: 'rectangle' },
      { id: 'actor', name: 'Actor', type: 'custom-actor' },
      { id: 'usecase', name: 'Use Case', type: 'ellipse' },
    ]
  },
];

const LibraryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  
  const filteredLibraries = selectedLibrary === 'all'
    ? shapeLibraries
    : shapeLibraries.filter(lib => lib.id === selectedLibrary);
  
  const filteredItems = filteredLibraries.flatMap(lib => lib.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleItemClick = (item: any) => {
    toast({
      title: 'Shape Selected',
      description: `${item.name} added to your clipboard. You can now paste it in any whiteboard.`,
    });
    
    // In a real app, we would save this to the user's clipboard
    localStorage.setItem('whiteboard-clipboard', JSON.stringify({
      type: item.type,
      name: item.name,
      timestamp: new Date().toISOString(),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shape Library
          </h1>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <Button 
              variant={selectedLibrary === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLibrary('all')}
            >
              All
            </Button>
            
            {shapeLibraries.map(lib => (
              <Button
                key={lib.id}
                variant={selectedLibrary === lib.id ? 'default' : 'outline'}
                onClick={() => setSelectedLibrary(lib.id)}
              >
                {lib.name}
              </Button>
            ))}
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search shapes..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 text-gray-400">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No shapes found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try a different search term.' : 'Select a library category to view shapes.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map(item => (
              <div 
                key={`${item.name}-${Math.random()}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 cursor-pointer flex flex-col items-center justify-center"
                onClick={() => handleItemClick(item)}
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  {item.type === 'rectangle' && (
                    <div className="w-12 h-8 border-2 border-gray-800 dark:border-gray-200 rounded-sm"></div>
                  )}
                  {item.type === 'ellipse' && (
                    <div className="w-10 h-10 border-2 border-gray-800 dark:border-gray-200 rounded-full"></div>
                  )}
                  {item.type === 'diamond' && (
                    <div className="w-10 h-10 border-2 border-gray-800 dark:border-gray-200 transform rotate-45"></div>
                  )}
                  {item.type === 'arrow' && (
                    <div className="w-12 h-1 bg-gray-800 dark:bg-gray-200 relative">
                      <div className="absolute right-0 top-0 border-t-[4px] border-r-[4px] border-b-[4px] border-t-transparent border-r-gray-800 dark:border-r-gray-200 border-b-transparent"></div>
                    </div>
                  )}
                  {item.type === 'custom-actor' && (
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-gray-800 dark:border-gray-200 rounded-full"></div>
                      <div className="w-1 h-6 bg-gray-800 dark:bg-gray-200 mt-1"></div>
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-gray-800 dark:bg-gray-200 transform -rotate-45"></div>
                        <div className="w-4 h-1 bg-gray-800 dark:bg-gray-200 transform rotate-45"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LibraryPage;
