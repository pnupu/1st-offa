'use client';

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Position {
    id: string;
    x: number;
    y: number;
}

interface DragAndDropContextType {
    positions: Record<string, Position>;
    globalIsDragging: boolean;
    updatePosition: (id: string, x: number, y: number) => void;
    setGlobalIsDragging: (isDragging: boolean) => void;
}

const DragAndDropContext = createContext<DragAndDropContextType | undefined>(undefined);

export const DragAndDropProvider = ({ children }: { children: ReactNode }) => {
    const [positions, setPositions] = useState<Record<string, Position>>({});
    const [globalIsDragging, setGlobalIsDragging] = useState(false);

    const updatePosition = (id: string, x: number, y: number) => {
        setPositions((prev) => ({
            ...prev,
            [id]: { id, x, y },
        }));
    };


    return (
        <DragAndDropContext.Provider value={{ positions, updatePosition, globalIsDragging, setGlobalIsDragging }}>
            {children}
        </DragAndDropContext.Provider>
    );
};

export const useDragAndDropContext = () => {
    const context = useContext(DragAndDropContext);
    if (!context) {
        throw new Error("useDragAndDropContext must be used within a DragAndDropProvider");
    }
    return context;
};
