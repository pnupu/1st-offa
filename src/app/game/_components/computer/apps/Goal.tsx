'use client';
import { useState, useRef, useEffect } from 'react';
import { api } from "@/trpc/react";
import { useTasks } from "../../TaskContext";

interface Point {
  x: number;
  y: number;
}

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification = ({ message, onClose }: NotificationProps) => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg w-[200px]">
      <h3 className="text-sm font-bold mb-2">{message}</h3>
      <button
        onClick={onClose}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        Close
      </button>
    </div>
  </div>
);

const Goal = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { completeAction } = useTasks();
  
  const saveDrawing = api.gameEvent.saveDrawing.useMutation({
    onSuccess: () => {
      setShowNotification(true);
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Error saving drawing:', error);
      setIsSaving(false);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set white background with correct dimensions
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 623, 360);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPoint({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(x, y);
    context.stroke();

    setLastPoint({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isSaving) return;

    try {
      setIsSaving(true);
      const base64Data = canvas.toDataURL('image/png');
      await saveDrawing.mutateAsync({
        imageData: base64Data,
        type: "GOAL_DRAWING"
      });

      completeAction(1, "createArtwork");
    } catch (error) {
      console.error('Error saving drawing:', error);
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full h-[285px] flex flex-col relative">
      <div className="flex gap-4 p-2 bg-gray-100">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className={`px-2 py-1 bg-blue-500 text-white rounded ${
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handleClear}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>
      <div className="overflow-auto">
        <canvas
          ref={canvasRef}
          width={623}
          height={360}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair"
        />
      </div>
      {showNotification && (
        <Notification 
          message="Drawing saved successfully!"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Goal;