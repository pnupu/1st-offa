'use client';

import React, { useRef, useState, useEffect } from 'react';
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
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: initialX, y: initialY });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isClick, setIsClick] = useState(true);

    // Initialize position if not set
    useEffect(() => {
        if (!positions[id]) {
            updatePosition(id, initialX, initialY);
        }
    }, [id, initialX, initialY, updatePosition, positions]);

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any default action, such as text selection

        const currentX = positions[id]?.x ?? initialX;
        const currentY = positions[id]?.y ?? initialY;

        // console.log('onMouseDown', currentX, currentY);

        setIsClick(true);
        setIsDragging(true);
        setStartPosition({ x: currentX, y: currentY });
        setOffset({
            x: e.clientX - currentX,
            y: e.clientY - currentY,
        });

        // Attach global event listeners to track mouse movements
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!ref.current?.parentElement) return;

        //console.log('onMouseMove', e.clientX, e.clientY);

        setIsClick(false); // Indicates it's a drag, not just a click

        const parentRect = ref.current.parentElement.getBoundingClientRect();
        let newX = e.clientX - offset.x;
        let newY = e.clientY - offset.y;

        // Boundaries within parent container
        newX = Math.max(0, Math.min(newX, parentRect.width - width));
        newY = Math.max(0, Math.min(newY, parentRect.height - height));

        updatePosition(id, newX, newY);
    };

    const onMouseUp = (e: MouseEvent) => {
        // console.log('onMouseUp');

        setIsDragging(false);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (isClick && ref.current) {
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
                opacity: isDragging ? 0.8 : 1,
            }}
        >
            {children}
        </div>
    );
};

export default DraggableItem;
