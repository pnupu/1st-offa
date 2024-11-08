'use client';

import React, { useRef, useEffect } from 'react';
import { useDragAndDropContext } from '../DragAndDropContext';

interface DraggableItemProps {
    id: string;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
    children: React.ReactNode;
}

const DraggableItem = ({ id, initialX, initialY, width, height, children }: DraggableItemProps) => {
    const { positions, updatePosition } = useDragAndDropContext();
    const ref = useRef<HTMLDivElement>(null);

    // Use refs to track dragging and offset, avoiding state-related async issues
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
        e.preventDefault(); // Prevent text selection and other default actions

        const currentX = positions[id]?.x ?? initialX;
        const currentY = positions[id]?.y ?? initialY;

        isClickRef.current = true;
        isDraggingRef.current = true; // Set ref to indicate dragging has started
        startPositionRef.current = { x: currentX, y: currentY };
        offsetRef.current = {
            x: e.clientX - currentX,
            y: e.clientY - currentY,
        };

        // Attach global event listeners to track mouse movements
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !ref.current?.parentElement) return;

        isClickRef.current = false; // Indicates it's a drag, not just a click

        const parentRect = ref.current.parentElement.getBoundingClientRect();
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;

        // Boundaries within parent container
        newX = Math.max(0, Math.min(newX, parentRect.width - width));
        newY = Math.max(0, Math.min(newY, parentRect.height - height));

        updatePosition(id, newX, newY);
    };

    const onMouseUp = () => {
        isDraggingRef.current = false; // Set ref to indicate dragging has ended
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (isClickRef.current && ref.current) {
            // Call the child's onClick if it was a click without drag
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
            }}
        >
            {children}
        </div>
    );
};

export default DraggableItem;
