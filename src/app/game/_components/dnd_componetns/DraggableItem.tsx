'use client';

import React, { useRef, useEffect } from 'react';
import { useDragAndDropContext } from '../DragAndDropContext';
import Mouse from './Mouse';
import { useMousePosition } from '../MousePositionContext';

interface DraggableItemProps {
    id: string;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
    children: React.ReactNode;
    manualZ?: number;
}

const DraggableItem = ({ id, initialX, initialY, width, height, children, manualZ }: DraggableItemProps) => {
    const { positions, updatePosition } = useDragAndDropContext();
    const ref = useRef<HTMLDivElement>(null);

    const { updateMousePosition } = useMousePosition();

    const isMouseComponent = React.isValidElement(children) && children.type === Mouse;

    const baseZIndex = 200;
    const isDraggingRef = useRef(false);
    const startPositionRef = useRef({ x: initialX, y: initialY });
    const offsetRef = useRef({ x: 0, y: 0 });
    const isClickRef = useRef(true);

    // Initialize position if not set
    useEffect(() => {
        if (!positions[id]) {
            updatePosition(id, initialX, initialY);
        }
    }, [id, initialX, initialY, updatePosition, positions]);

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        const currentX = positions[id]?.x ?? initialX;
        const currentY = positions[id]?.y ?? initialY;

        isClickRef.current = true;
        isDraggingRef.current = true;
        startPositionRef.current = { x: currentX, y: currentY };
        offsetRef.current = {
            x: e.clientX - currentX,
            y: e.clientY - currentY,
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !ref.current?.parentElement) return;

        isClickRef.current = false;
        
        
        const parentRect = ref.current.parentElement.getBoundingClientRect();
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;
        
        
        // Boundaries within parent container
        newX = Math.max(0, Math.min(newX, parentRect.width - width));
        newY = Math.max(0, Math.min(newY, parentRect.height - height));
        
        if (isMouseComponent) {
            updateMousePosition(newX, newY);
        }

        updatePosition(id, newX, newY);
    };
    
    const onMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (isClickRef.current && ref.current) {
            const child = ref.current.querySelector('*');
            if (child && typeof child.dispatchEvent === 'function') {
                child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
        }
    };

    const currentX = positions[id]?.x ?? initialX;
    const currentY = positions[id]?.y ?? initialY;

    return (
        <div
            ref={ref}
            onMouseDown={onMouseDown}
            className="absolute"
            style={{
                left: `${currentX}px`,
                top: `${currentY}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: manualZ ? manualZ : baseZIndex + currentY, // Dynamic z-index based on y-coordinate
            }}
        >
            {children}
        </div>
    );
};

export default DraggableItem;
