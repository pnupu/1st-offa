'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface AppState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  selectedEmailId?: string;
}

interface AppStates {
  Calculator: AppState;
  Koolout: AppState;
  // Add other app states here as needed
}

interface AppStateContextType {
  appStates: AppStates;
  updateAppState: (appName: keyof AppStates, newState: Partial<AppState>) => void;
}

const initialState: AppStates = {
  Calculator: {
    isOpen: false,
    isMinimized: false,
    zIndex: 0,
  },
  Koolout: {
    isOpen: false,
    isMinimized: false,
    zIndex: 0,
  },
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [appStates, setAppStates] = useState<AppStates>(initialState);

  const updateAppState = useCallback((
    appName: keyof AppStates,
    newState: Partial<AppState>
  ) => {
    setAppStates(prev => ({
      ...prev,
      [appName]: {
        ...prev[appName],
        ...newState,
      },
    }));
  }, []);

  return (
    <AppStateContext.Provider value={{ appStates, updateAppState }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}; 