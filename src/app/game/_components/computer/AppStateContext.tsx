'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface AppState {
  background: string | null;
  setBackground: (imageUrl: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    console.log("Background set to", background);
  }, [background]);

  return (
    <AppStateContext.Provider
      value={{
        background,
        setBackground,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
} 