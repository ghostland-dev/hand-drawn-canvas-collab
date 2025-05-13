
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, Clock, Star, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface WhiteboardProject {
  id: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
  thumbnail?: string;
  isStarred?: boolean;
}

const Home = () => {
  const [projects, setProjects] = useState<WhiteboardProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    const savedProjects = localStorage.getItem('whiteboard-projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects.map((p: any) => ({
          ...p, 
          createdAt: new Date(p.createdAt),
          lastModified: new Date(p.lastModified)
        })));
      } catch (error) {
        console.error('Failed to parse saved projects', error);
      }
    }
  }, []);

  const createNewProject = () => {
    const newProject: WhiteboardProject = {
      id: crypto.randomUUID(),
      title: `Untitled Whiteboard ${projects.length + 1}`,
      createdAt: new Date(),
      lastModified: new Date(),
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    // Save to localStorage
    localStorage.setItem('whiteboard-projects', JSON.stringify(updatedProjects));
    
    toast({
      title: 'Project Created',
      description: 'Your new whiteboard has been created.',
    });
    
    // In a real app, we would redirect to the new project
    // history.push(`/board/${newProject.id}`);
  };

  const toggleStar = (id: string) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, isStarred: !project.isStarred } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('whiteboard-projects', JSON.stringify(updatedProjects));
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Whiteboard App
          </h1>
          <div className="flex items-center space-x-3">
            <Link to="/tutorial">
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" /> Tutorial
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="outline" size="sm">
                Library
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">My Whiteboards</h2>
          <div className="flex space-x-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search projects..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={createNewProject}>
              <Plus className="h-4 w-4 mr-2" /> New Whiteboard
            </Button>
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4 text-gray-400">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No projects found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No projects match your search.' : 'Create a new whiteboard to get started!'}
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <Button onClick={createNewProject}>
                  <Plus className="h-4 w-4 mr-2" /> New Whiteboard
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/board/${project.id}`} className="block">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                  {project.thumbnail ? (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 dark:text-gray-500">No preview</span>
                    </div>
                  )}
                  <button 
                    className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-black/50 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleStar(project.id);
                    }}
                  >
                    <Star className={`h-5 w-5 ${project.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/board/${project.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{project.title}</h3>
                </Link>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated {new Intl.DateTimeFormat('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }).format(project.lastModified)}</span>
                </div>
              </div>
            </div>
          ))}

          <div 
            onClick={createNewProject}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Plus className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="mt-2 text-gray-600 dark:text-gray-300 font-medium">New Whiteboard</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
