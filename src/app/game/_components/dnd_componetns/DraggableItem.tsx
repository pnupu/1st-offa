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
    const { positions, updatePosition, globalIsDragging, setGlobalIsDragging } = useDragAndDropContext();
    const ref = useRef<HTMLDivElement>(null);
    const { x, y, updateMousePosition } = useMousePosition();

    const baseZIndex = 200;
    const isDraggingRef = useRef(false);
    const globalIsDraggingRef = useRef(globalIsDragging); // Ref to hold the latest globalIsDragging value
    const startPositionRef = useRef({ x: initialX, y: initialY });
    const offsetRef = useRef({ x: 0, y: 0 });
    const isHoveringRef = useRef(false);
    const isClickRef = useRef(true);

    useEffect(() => {
        globalIsDraggingRef.current = globalIsDragging; // Update ref whenever globalIsDragging changes
    }, [globalIsDragging]);

    useEffect(() => {
        if (!positions[id]) {
            updatePosition(id, initialX, initialY);
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'D' || e.key === 'd') && isHoveringRef.current && !isDraggingRef.current && !globalIsDraggingRef.current) {
                startDragging();
                setGlobalIsDragging(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'D' || e.key === 'd') {
                stopDragging();
                setGlobalIsDragging(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [positions, id, initialX, initialY]);

    useEffect(() => {
        if (!globalIsDraggingRef.current && isDraggingRef.current) {
            stopDragging();
        }
    }, [globalIsDraggingRef.current]); // Dependency on the ref's current value

    const startDragging = () => {
        document.addEventListener('mousemove', captureInitialMousePosition, { once: true });
    };

    const captureInitialMousePosition = (e: MouseEvent) => {
        const currentX = positions[id]?.x ?? initialX;
        const currentY = positions[id]?.y ?? initialY;

        offsetRef.current = {
            x: e.clientX - currentX,
            y: e.clientY - currentY,
        };

        isClickRef.current = true;
        isDraggingRef.current = true;
        startPositionRef.current = { x: currentX, y: currentY };

        document.addEventListener('mousemove', onMouseMove);
    };

    const stopDragging = () => {
        isDraggingRef.current = false;
        document.removeEventListener('mousemove', onMouseMove);
    };

    const onMouseEnter = () => {
        isHoveringRef.current = true;
    };

    const onMouseLeave = () => {
        isHoveringRef.current = false;
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && React.isValidElement(children) && children.type === Mouse) {
            e.preventDefault();
            simulateClickAtMousePosition(x, y);
        }
    };

    const simulateClickAtMousePosition = (mouseX: number, mouseY: number) => {
        const screenEdgeDiv = document.getElementById('computer-screen');
        if (!screenEdgeDiv) {
            console.warn('Screen edge div not found');
            return;
        }

        const screenRect = screenEdgeDiv.getBoundingClientRect();
        const absoluteX = screenRect.left + mouseX;
        const absoluteY = screenRect.top + mouseY;

        if (
            absoluteX < screenRect.left ||
            absoluteX > screenRect.right ||
            absoluteY < screenRect.top ||
            absoluteY > screenRect.bottom
        ) {
            console.warn('Click outside screen bounds');
            return;
        }

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

        newX = Math.max(0, Math.min(newX, parentRect.width - width));
        newY = Math.max(0, Math.min(newY, parentRect.height - height));

        updatePosition(id, newX, newY);

        if (React.isValidElement(children) && children.type === Mouse) {
            const deltaX = newX - startPositionRef.current.x;
            const deltaY = newY - startPositionRef.current.y;
            updateMousePosition(deltaX * 4, deltaY * 4);
        }
    };

    const currentX = positions[id]?.x ?? initialX;
    const currentY = positions[id]?.y ?? initialY;

    return (
        <div
            ref={ref}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute"
            style={{
                left: `${currentX}px`,
                top: `${currentY}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: manualZ ? manualZ : baseZIndex + currentY,
                cursor: isDraggingRef.current ? 'grabbing' : 'grab',
            }}
        >
            {children}
        </div>
    );
};

export default DraggableItem;
