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
    onClick?: () => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
    id,
    initialX,
    initialY,
    width,
    height,
    children,
    manualZ,
    onClick,
}) => {
    const { positions, updatePosition } = useDragAndDropContext();
    const ref = useRef<HTMLDivElement>(null);
    const { x, y, updateMousePosition } = useMousePosition();

    const isMouseComponent = React.isValidElement(children) && children.type === Mouse;

    const baseZIndex = 200;
    const isDraggingRef = useRef(false);
    const startPositionRef = useRef({ x: initialX, y: initialY });
    const offsetRef = useRef({ x: 0, y: 0 });
    const isClickRef = useRef(true);

    useEffect(() => {
        if (!positions[id]) {
            updatePosition(id, initialX, initialY);
        }
    }, [id, initialX, initialY, updatePosition, positions]);

    const onMouseDown = (e: React.MouseEvent) => {
        // Handle left-click (button === 0) for click simulation
        if (e.button === 0 && isMouseComponent) {
            e.preventDefault();
            simulateClickAtMousePosition(x, y);
        } 
        // Right-click (button === 2) to initiate dragging
        else if (e.button === 2) { 
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
        }
    };

    const simulateClickAtMousePosition = (mouseX: number, mouseY: number) => {
        // Find the div with id "div-computer-screen-edge" to calculate relative position
        const screenEdgeDiv = document.getElementById('computer-screen');
        if (!screenEdgeDiv) {
            console.warn('Screen edge div not found');
            return;
        }

        // Get the bounding rectangle of the screen edge div
        const screenRect = screenEdgeDiv.getBoundingClientRect();

        // Calculate the absolute on-screen position based on the computer screen offset
        const absoluteX = screenRect.left + mouseX;
        const absoluteY = screenRect.top + mouseY;

        // Ensure the coordinates are within the bounds of the screen
        if (
            absoluteX < screenRect.left ||
            absoluteX > screenRect.right ||
            absoluteY < screenRect.top ||
            absoluteY > screenRect.bottom
        ) {
            console.warn('Click outside screen bounds');
            return;
        }

        // Find the element at the absolute cursor position on the real screen
        const elementAtCursor = document.elementFromPoint(absoluteX, absoluteY);

        if (elementAtCursor) {
            elementAtCursor.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
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
            const deltaX = newX - startPositionRef.current.x;
            const deltaY = newY - startPositionRef.current.y;
            updateMousePosition(deltaX * 4, deltaY * 4);
        }

        updatePosition(id, newX, newY);
    };

    const onMouseUp = (e: MouseEvent) => {
        // Only stop dragging if the right mouse button (button === 2) is released
        if (e.button === 2) {
            isDraggingRef.current = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Allow left-click (button === 0) interaction with child components
        if (isClickRef.current && e.button === 0 && ref.current) {
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
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
            className="absolute"
            style={{
                left: `${currentX}px`,
                top: `${currentY}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: manualZ ? manualZ : baseZIndex + currentY, // Dynamic z-index based on y-coordinate
                cursor: isDraggingRef.current ? 'grabbing' : 'grab',
            }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default DraggableItem;
