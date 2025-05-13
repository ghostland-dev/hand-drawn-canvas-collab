
import React from 'react';
import CanvasElement from './canvas/CanvasElement';
import { useCanvas } from '@/contexts/CanvasContext';
import useGestures from '@/hooks/useGestures';

const Canvas = () => {
  const { activeAction, setActiveAction } = useCanvas();
  
  // Use our new hook to handle pan and zoom gestures
  useGestures({ activeAction, setActiveAction });

  return <CanvasElement />;
};

export default Canvas;
