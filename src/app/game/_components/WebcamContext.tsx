// WebcamContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WebcamContextProps {
  isWebcamOn: boolean;
  toggleWebcam: () => void;
}

const WebcamContext = createContext<WebcamContextProps | undefined>(undefined);

export const WebcamProvider = ({ children }: { children: ReactNode }) => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  const toggleWebcam = () => setIsWebcamOn((prev) => !prev);

  return (
    <WebcamContext.Provider value={{ isWebcamOn, toggleWebcam }}>
      {children}
    </WebcamContext.Provider>
  );
};

export const useWebcam = () => {
  const context = useContext(WebcamContext);
  if (!context) throw new Error('useWebcam must be used within a WebcamProvider');
  return context;
};
