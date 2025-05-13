
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCanvas, CanvasProvider, Shape } from '@/contexts/CanvasContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Maximize, Minimize, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PresentationCanvasProps {
  shapes: Shape[];
}

const PresentationCanvas = ({ shapes }: PresentationCanvasProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const roughCanvasRef = React.useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize RoughJS canvas
    if (canvasRef.current) {
      const rough = require('roughjs');
      roughCanvasRef.current = rough.canvas(canvasRef.current);
      
      // Render shapes
      renderShapes();
    }
  }, [shapes]);

  const renderShapes = () => {
    if (!canvasRef.current || !roughCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all shapes from the current frame
    shapes.forEach((shape) => {
      // Draw shape logic similar to Canvas.tsx but simplified for presentation
      switch (shape.type) {
        case 'rectangle':
          roughCanvasRef.current.rectangle(
            shape.x, shape.y, shape.width, shape.height, 
            { 
              roughness: shape.roughness,
              stroke: shape.strokeColor,
              fill: shape.fillColor !== 'transparent' ? shape.fillColor : undefined,
              strokeWidth: shape.strokeWidth 
            }
          );
          break;
          
        case 'ellipse':
          roughCanvasRef.current.ellipse(
            shape.x + shape.width/2, shape.y + shape.height/2, shape.width, shape.height,
            { 
              roughness: shape.roughness,
              stroke: shape.strokeColor,
              fill: shape.fillColor !== 'transparent' ? shape.fillColor : undefined,
              strokeWidth: shape.strokeWidth 
            }
          );
          break;
          
        // Add cases for other shape types
        // ... (similar to Canvas.tsx)
      }
    });
  };

  // Update canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      renderShapes();
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 bg-canvas dark:bg-canvas-dark"
    />
  );
};

// Main Presentation Component
const PresentationMode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // For actual implementation, you'd divide shapes into frames/slides
  // Here we're simplifying by having just one frame
  const [frames, setFrames] = useState<Shape[][]>([[]]);
  
  useEffect(() => {
    // In a real app, fetch the whiteboard data and organize by frames
    // For demo, we'll just use the shapes from CanvasContext
    const fetchWhiteboardData = async () => {
      try {
        // Simulate loading frames
        setFrames([[]]);
        
        toast({
          title: 'Presentation Ready',
          description: 'Use arrow keys or buttons to navigate slides.',
        });
      } catch (error) {
        toast({
          title: 'Error Loading Presentation',
          description: 'Failed to load presentation data.',
          variant: 'destructive',
        });
      }
    };
    
    fetchWhiteboardData();
  }, [id, toast]);
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          title: 'Fullscreen Error',
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: 'destructive',
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };
  
  const nextSlide = () => {
    if (currentSlide < frames.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullScreen(false);
          }
          break;
        case 'f':
          toggleFullScreen();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, frames.length]);

  return (
    <CanvasProvider>
      <div className="relative h-screen w-screen bg-black overflow-hidden">
        {/* Presentation Canvas */}
        <PresentationCanvas 
          shapes={frames[currentSlide] || []} 
        />
        
        {/* Controls */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white ${isFullScreen ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            className="text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-sm">
            Slide {currentSlide + 1} of {frames.length}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === frames.length - 1}
            className="text-white"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Top Controls */}
        <div className={`absolute top-4 right-4 flex items-center space-x-2 ${isFullScreen ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullScreen}
            className="text-white bg-black/30 backdrop-blur-sm hover:bg-black/50"
          >
            {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/board/${id}`)}
            className="text-white bg-black/30 backdrop-blur-sm hover:bg-black/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </CanvasProvider>
  );
};

export default PresentationMode;
