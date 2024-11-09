import React, { createContext, useContext, useState, useCallback } from 'react';

interface MousePositionContextType {
    x: number;
    y: number;
    mouseX: number;
    mouseY: number;
    updateMousePosition: (deltaX: number, deltaY: number) => void;
}

// Hardcoded limits for mouse position
const maxX = 500;
const maxY = 300;

// Create the context
const MousePositionContext = createContext<MousePositionContextType | undefined>(undefined);

export const MousePositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State to track limited x and y positions
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // State to track raw mouse x and y positions
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    // Function to update mouse position by deltas, with limits applied
    const updateMousePosition = useCallback((deltaX: number, deltaY: number) => {
        // Calculate new raw mouse positions
        const newMouseX = mouseX + deltaX;
        const newMouseY = mouseY + deltaY;

        // Update raw mouse position state
        setMouseX(newMouseX);
        setMouseY(newMouseY);

        // Apply limits for x and y positions
        const limitedX = Math.min(Math.max(newMouseX, 0), maxX);
        const limitedY = Math.min(Math.max(newMouseY, 0), maxY);

        // Update limited position state
        setX(limitedX);
        setY(limitedY);
    }, [mouseX, mouseY]);

    return (
        <MousePositionContext.Provider value={{ x, y, mouseX, mouseY, updateMousePosition }}>
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
