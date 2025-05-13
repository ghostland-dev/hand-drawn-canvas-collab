
import { CanvasProvider } from '@/contexts/CanvasContext';
import Whiteboard from '@/components/Whiteboard';

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-canvas dark:bg-canvas-dark">
      <CanvasProvider>
        <Whiteboard />
      </CanvasProvider>
    </div>
  );
};

export default Index;
