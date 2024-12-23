import React, { createContext, useContext, useState, useCallback } from 'react';

interface MousePositionContextType {
    x: number;
    y: number;
    updateMousePosition: (deltaX: number, deltaY: number) => void;
}

// Hardcoded limits for mouse position
const maxX = 642;
const maxY = 352;

// Create the context
const MousePositionContext = createContext<MousePositionContextType | undefined>(undefined);

export const MousePositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State to track limited x and y positions
    const [x, setX] = useState(230);
    const [y, setY] = useState(200);

    // Function to update mouse position by deltas, with limits applied
    const updateMousePosition = useCallback((deltaX: number, deltaY: number) => {
        // Calculate new raw mouse positions
        const newX = x + deltaX;
        const newY = y + deltaY;

        // Apply limits for x and y positions
        const limitedX = Math.min(Math.max(newX, 0), maxX);
        const limitedY = Math.min(Math.max(newY, 0), maxY);

        // Update limited position state
        setX(limitedX);
        setY(limitedY);
    }, [x, y]);

    return (
        <MousePositionContext.Provider value={{ x, y, updateMousePosition }}>
            {children}
        </MousePositionContext.Provider>
    );
};

// Custom hook to use mouse position context
export const useMousePosition = () => {
    const context = useContext(MousePositionContext);
    if (!context) {
        throw new Error('useMousePosition must be used within a MousePositionProvider');
    }
    return context;
};
