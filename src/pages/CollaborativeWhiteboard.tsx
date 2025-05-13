
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CanvasProvider } from '@/contexts/CanvasContext';
import Whiteboard from '@/components/Whiteboard';
import { Button } from '@/components/ui/button';
import { Share2, Download, Upload, FileImage, Presentation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShareDialog from '@/components/ShareDialog';
import ImportExportControls from '@/components/ImportExportControls';
import CollaborationStatus from '@/components/CollaborationStatus';

interface WhiteboardProject {
  id: string;
  title: string;
  createdAt: Date;
  lastModified: Date;
  thumbnail?: string;
  isStarred?: boolean;
}

const CollaborativeWhiteboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<WhiteboardProject | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isImportExportMenuOpen, setIsImportExportMenuOpen] = useState(false);

  // Mock user for collaboration display
  const [connectedUsers] = useState([
    { id: 'user1', name: 'You', color: '#3b82f6' },
    { id: 'user2', name: 'Guest User', color: '#10b981' }
  ]);

  useEffect(() => {
    if (!id) return;

    // In a real app, fetch from API or database
    const savedProjects = localStorage.getItem('whiteboard-projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        const foundProject = parsedProjects.find((p: any) => p.id === id);
        
        if (foundProject) {
          setProject({
            ...foundProject,
            createdAt: new Date(foundProject.createdAt),
            lastModified: new Date(foundProject.lastModified)
          });
        } else {
          // Handle project not found
          toast({
            title: 'Project Not Found',
            description: 'The requested whiteboard could not be found.',
            variant: 'destructive'
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to parse saved projects', error);
      }
    } else {
      // If no projects exist, we could create one on the fly
      const newProject: WhiteboardProject = {
        id: id,
        title: 'New Whiteboard',
        createdAt: new Date(),
        lastModified: new Date(),
      };
      
      setProject(newProject);
      
      // Save to localStorage
      localStorage.setItem('whiteboard-projects', JSON.stringify([newProject]));
    }
  }, [id, navigate, toast]);

  // Update project title
  const updateTitle = (newTitle: string) => {
    if (!project) return;

    const updatedProject = { ...project, title: newTitle, lastModified: new Date() };
    setProject(updatedProject);

    // Update in localStorage
    const savedProjects = localStorage.getItem('whiteboard-projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        const updatedProjects = parsedProjects.map((p: any) => 
          p.id === project.id ? { ...p, title: newTitle, lastModified: new Date() } : p
        );
        localStorage.setItem('whiteboard-projects', JSON.stringify(updatedProjects));
      } catch (error) {
        console.error('Failed to update project', error);
      }
    }
  };

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
  };

  const handlePresentMode = () => {
    if (id) {
      navigate(`/board/${id}/present`);
    }
  };

  if (!project) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-80 backdrop-blur-sm dark:bg-gray-800 dark:bg-opacity-80 shadow-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back
          </Button>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="ml-4 text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <CollaborationStatus users={connectedUsers} />
          
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setIsImportExportMenuOpen(!isImportExportMenuOpen)}
            >
              <FileImage className="mr-2 h-4 w-4" />
              Import/Export
            </Button>
            
            {isImportExportMenuOpen && (
              <ImportExportControls 
                onClose={() => setIsImportExportMenuOpen(false)}
              />
            )}
          </div>
          
          <Button onClick={handlePresentMode}>
            <Presentation className="mr-2 h-4 w-4" />
            Present
          </Button>
          
          <Button onClick={handleShareClick}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <CanvasProvider>
        <Whiteboard />
      </CanvasProvider>

      <ShareDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)} 
        projectId={project.id}
      />
    </div>
  );
};

export default CollaborativeWhiteboard;
