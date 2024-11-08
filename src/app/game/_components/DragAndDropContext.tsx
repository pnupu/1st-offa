'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Position {
    id: string;
    x: number;
    y: number;
}

interface DragAndDropContextType {
    positions: Record<string, Position>;
    updatePosition: (id: string, x: number, y: number) => void;
}

const DragAndDropContext = createContext<DragAndDropContextType | undefined>(undefined);

export const DragAndDropProvider = ({ children }: { children: ReactNode }) => {
    const [positions, setPositions] = useState<Record<string, Position>>({});

    const updatePosition = (id: string, x: number, y: number) => {
        setPositions((prev) => ({
            ...prev,
            [id]: { id, x, y },
        }));
    };

    return (
        <DragAndDropContext.Provider value={{ positions, updatePosition }}>
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
