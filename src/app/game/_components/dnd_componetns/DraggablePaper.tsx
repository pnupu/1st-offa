'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useDragAndDropContext } from '../DragAndDropContext';
import Image from 'next/image';
import ReactDOM from 'react-dom';
import { useTasks } from '../TaskContext';

interface DraggablePaperProps {
    id: string;
    initialX: number;
    initialY: number;
    imagePath: string;
    width: number;
    height: number;
}

const DraggablePaper = ({ id, initialX, initialY, imagePath, width, height }: DraggablePaperProps) => {

    const { completeAction } = useTasks();

    const { positions, updatePosition } = useDragAndDropContext();
    const ref = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const baseZIndex = 50;
    const [isOpen, setIsOpen] = useState(false); // Track open/close state
    const [warpStyle, setWarpStyle] = useState({});

    const maxDistance = 630; // Maximum horizontal distance for full skew and scale effect
    const maxSkewX = 50; // Maximum skew in degrees
    const minScale = 0.8; // Minimum scale factor at max distance

    // Initialize position and apply initial skew/scale effect only if closed
    useEffect(() => {
        if (!positions[id]) {
            updatePosition(id, initialX, initialY);
        }
        if (!isOpen) {
            const initialPositionX = positions[id]?.x ?? initialX;
            const parentRect = ref.current?.parentElement?.getBoundingClientRect();
            if (parentRect) {
                const screenCenter = parentRect.width / 2;
                const initialHorizontalDistance = initialPositionX + width / 2 - screenCenter;
                applySkewAndScaleEffect(initialHorizontalDistance);
            }
        }
    }, [id, initialX, initialY, updatePosition, positions, isOpen]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (isOpen) return; // Prevent dragging when the document is open

        if (e.button !== 2) return; // Only proceed if right-click (button === 2)
        e.preventDefault();
        isDraggingRef.current = true;

        const currentX = positions[id]?.x ?? initialX;
        const currentY = positions[id]?.y ?? initialY;

        offsetRef.current = {
            x: e.clientX - currentX,
            y: e.clientY - currentY,
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !ref.current?.parentElement) return;

        const parentRect = ref.current.parentElement.getBoundingClientRect();
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;

        // Boundaries within parent container (desk area)
        newX = Math.max(0, Math.min(newX, parentRect.width - width));
        newY = Math.max(0, Math.min(newY, parentRect.height - height));

        updatePosition(id, newX, newY);

        // Calculate distance from center and apply skew/scale effect only when closed
        if (!isOpen) {
            const screenCenter = parentRect.width / 2;
            const horizontalDistance = newX + width / 2 - screenCenter;
            applySkewAndScaleEffect(horizontalDistance);
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (e.button === 2) { // Only stop dragging on right mouse button release
            isDraggingRef.current = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Open document: Center, scale up, and remove skew
            setWarpStyle({
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) scale(3.4)', // Scale up to 2x for readability
                zIndex: baseZIndex + 1000, // Bring to front
                transition: 'left 0.5s ease, top 0.5s ease, transform 0.5s ease', // Smooth transition for opening
            });

            if (id === 'namingconv') {
                completeAction(8, 'openNamingConventions');
            } else if (id === 'invoice') {
                completeAction(7, 'openInvoice');
            } else if (id === 'querterly') {
                completeAction(3, 'openQ3Report');
            } else if (id === 'styleguide') {
                completeAction(5, 'openStyleGuide');
            }
            
        } else {
            // Close document: Reset position, apply skew and scale based on current position
            const currentX = positions[id]?.x ?? initialX;
            const currentY = positions[id]?.y ?? initialY;
            const parentRect = ref.current?.parentElement?.getBoundingClientRect();

            if (parentRect) {
                const screenCenter = parentRect.width / 2;
                const horizontalDistance = currentX + width / 2 - screenCenter;
                applySkewAndScaleEffect(horizontalDistance);
            }

            // Set warp style back to absolute for draggable state
            setWarpStyle({
                position: 'absolute',
                left: `${currentX}px`,
                top: `${currentY}px`,
                zIndex: baseZIndex + currentY,
                transition: 'left 0.1s ease, top 0.1s ease, transform 0.1s ease',
            });
        } 
    };

    // Apply skew and scale effect proportional to distance from center
    const applySkewAndScaleEffect = (horizontalDistance: number) => {
        // Only apply skew if document is not open
        if (isOpen) return;

        // Calculate skew based on max skew and max distance
        const skewX = (horizontalDistance / maxDistance) * maxSkewX;

        // Calculate scale factor based on the absolute distance
        const scaleFactor = 1 - (Math.abs(horizontalDistance) / maxDistance) * (1 - minScale);

        setWarpStyle({
            transform: `skewX(${skewX}deg) scale(${scaleFactor})`,
            transition: 'left 0.1s ease, top 0.1s ease, transform 0.1s ease', // Smooth transition for skew and scale
        });
    };

    // Current position for rendering
    const currentX = positions[id]?.x ?? initialX;
    const currentY = positions[id]?.y ?? initialY;

    const paperElement = (
        <div
            ref={ref}
            onMouseDown={onMouseDown}
            onClick={toggleOpen} // Toggle open/close on click
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
            className="absolute cursor-pointer"
            style={{
                left: isOpen ? '50%' : `${currentX}px`,
                top: isOpen ? '50%' : `${currentY}px`,
                border: isOpen ? 'none' : '1px solid #00000030',
                width: `${width}px`,
                height: `${height}px`,
                zIndex: isOpen ? baseZIndex + 1000 : baseZIndex + currentY,
                ...warpStyle, // Apply skew and scale or center style based on state
            }}
        >
            <Image
                src={imagePath}
                alt="Draggable Paper"
                layout="fill"
                objectFit="cover"
                draggable={false}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
        </div>
    );

    return isOpen
        ? ReactDOM.createPortal(paperElement, document.getElementById('portal-root')!)
        : paperElement;
};

export default DraggablePaper;
