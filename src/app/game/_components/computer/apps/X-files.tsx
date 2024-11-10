'use client';
import { useState } from 'react';
import { api } from "@/trpc/react";
import Image from 'next/image';
import { useBackground } from '../BackgroundContext';

interface DrawingFile {
  id: string;
  dataUrl: string;
}

interface NotificationModalProps {
  message: string;
  onClose: () => void;
}

const NotificationModal = ({ message, onClose }: NotificationModalProps) => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-4">{message}</h3>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
      >
        Close
      </button>
    </div>
  </div>
);

const XFiles = () => {
  const [selectedImage, setSelectedImage] = useState<DrawingFile | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { data: images = [] } = api.gameEvent.getDrawings.useQuery(undefined, {
    refetchOnWindowFocus: false
  });
  const { setBackground } = useBackground();
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      setIsSharing(false);
      setNotification("Image shared to CheckedOut successfully!");
    },
    onError: (error) => {
      console.error('Error sharing to CheckedOut:', error);
      setNotification("Failed to share image to CheckedOut. Please try again.");
    }
  });
  const createGameEvent = api.gameEvent.create.useMutation();
  const [isSharing, setIsSharing] = useState(false);

  const handleSetBackground = async (dataUrl: string) => {
    setBackground(dataUrl);
    
    // Create game event for personalizing workspace
    await createGameEvent.mutateAsync({
      type: "SET_BACKGROUND",
      oceanScores: {
        openness: 0.05,      // Small increase for customization
        extraversion: 0.02   // Tiny increase for self-expression
      }
    });
    
    setNotification("Background updated successfully!");
  };

  const handleShareToCheckedout = async (dataUrl: string) => {
    if (isSharing) return;

    try {
      setIsSharing(true);
      await createPost.mutateAsync({
        content: "Check out my latest artwork! 🎨",
        imageData: dataUrl
      });

      // Create game event for sharing artwork
      await createGameEvent.mutateAsync({
        type: "SHARED_ARTWORK",
        oceanScores: {
          extraversion: 0.1,  // Increase extraversion for social sharing
          openness: 0.05      // Small increase for artistic expression
        }
      });
    } catch (error) {
      console.error('Error sharing to CheckedOut:', error);
      setNotification("Failed to share image to CheckedOut. Please try again.");
      setIsSharing(false);
    }
  };

  return (
    <div className="h-full flex relative">
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">My Drawings</h2>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image) => (
            <div 
              key={image.id}
              className="relative group cursor-pointer border rounded-lg overflow-hidden"
              onClick={() => setSelectedImage(image)}
              onContextMenu={(e) => {
                e.preventDefault();
                void handleSetBackground(image.dataUrl);
              }}
            >
              <Image
                src={image.dataUrl}
                alt="Drawing"
                width={200}
                height={150}
                className="object-cover w-full h-[100px]"
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white">Click to view</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedImage && (
        <div className="w-1/3 p-4 border-l">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Selected Drawing</h3>
            <Image
              src={selectedImage.dataUrl}
              alt="Selected drawing"
              width={300}
              height={200}
              className="w-full rounded-lg"
              unoptimized
            />
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleSetBackground(selectedImage.dataUrl)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Set as Background
            </button>
            <button
              onClick={() => handleShareToCheckedout(selectedImage.dataUrl)}
              disabled={isSharing}
              className={`w-full px-4 py-2 bg-green-500 text-white rounded-lg ${
                isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
            >
              {isSharing ? 'Sharing...' : 'Share to CheckedOut'}
            </button>
          </div>
        </div>
      )}

      {notification && (
        <NotificationModal
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default XFiles;
