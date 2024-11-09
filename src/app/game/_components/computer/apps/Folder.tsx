'use client';
import { useState } from 'react';
import { api } from "@/trpc/react";
import Image from 'next/image';
import { useAppState } from '../AppStateContext';

interface DrawingFile {
  id: string;
  dataUrl: string;
}

const Folder = () => {
  const [selectedImage, setSelectedImage] = useState<DrawingFile | null>(null);
  const { data: images = [] } = api.gameEvent.getDrawings.useQuery(undefined, {
    refetchOnWindowFocus: false
  });
  const { setBackground } = useAppState();
  const createPost = api.post.create.useMutation();

  const handleSetBackground = (dataUrl: string) => {
    console.log("Setting background");
    // Convert base64 to blob
    setBackground(dataUrl);
  };

  const handleShareToCheckedout = async (dataUrl: string) => {
    try {
      await createPost.mutateAsync({
        content: "Check out my latest artwork! 🎨",
        imageData: dataUrl
      });
    } catch (error) {
      console.error('Error sharing to CheckedOut:', error);
    }
  };

  return (
    <div className="h-full flex">
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
                handleSetBackground(image.dataUrl);
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
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Share to CheckedOut
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Folder;