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
    const { positions, updatePosition, globalIsDragging, setGlobalIsDragging } = useDragAndDropContext();
    const ref = useRef<HTMLDivElement>(null);
    const globalIsDraggingRef = useRef(globalIsDragging); // Ref to hold the latest globalIsDragging value
    const isDraggingRef = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const baseZIndex = 50;
    const [isOpen, setIsOpen] = useState(false); 
    const [warpStyle, setWarpStyle] = useState({});
    const isHoveringRef = useRef(false);

    const maxDistance = 630;
    const maxSkewX = 50;
    const minScale = 0.8;

    // Sync the ref whenever globalIsDragging changes
    useEffect(() => {
        globalIsDraggingRef.current = globalIsDragging;
    }, [globalIsDragging]);

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
    }, [id, initialX, initialY, updatePosition, positions, isOpen]);

    useEffect(() => {
        if (!globalIsDraggingRef.current && isDraggingRef.current) {
            stopDragging();
        }
    }, [globalIsDraggingRef.current]);

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

        isDraggingRef.current = true;
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

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setWarpStyle({
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) scale(3.4)',
                zIndex: baseZIndex + 1000,
                transition: 'left 0.5s ease, top 0.5s ease, transform 0.5s ease',
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
            const currentX = positions[id]?.x ?? initialX;
            const currentY = positions[id]?.y ?? initialY;
            const parentRect = ref.current?.parentElement?.getBoundingClientRect();

            if (parentRect) {
                const screenCenter = parentRect.width / 2;
                const horizontalDistance = currentX + width / 2 - screenCenter;
                applySkewAndScaleEffect(horizontalDistance);
            }

            setWarpStyle({
                position: 'absolute',
                left: `${currentX}px`,
                top: `${currentY}px`,
                zIndex: baseZIndex + currentY,
                transition: 'left 0.1s ease, top 0.1s ease, transform 0.1s ease',
            });
        } 
    };

    const applySkewAndScaleEffect = (horizontalDistance: number) => {
        if (isOpen) return;

        const skewX = (horizontalDistance / maxDistance) * maxSkewX;
        const scaleFactor = 1 - (Math.abs(horizontalDistance) / maxDistance) * (1 - minScale);

        setWarpStyle({
            transform: `skewX(${skewX}deg) scale(${scaleFactor})`,
            transition: 'left 0.1s ease, top 0.1s ease, transform 0.1s ease',
        });
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !ref.current?.parentElement) return;

        const parentRect = ref.current.parentElement.getBoundingClientRect();
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;

        newX = Math.max(0, Math.min(newX, parentRect.width - width));
        newY = Math.max(0, Math.min(newY, parentRect.height - height));

        updatePosition(id, newX, newY);

        if (!isOpen) {
            const screenCenter = parentRect.width / 2;
            const horizontalDistance = newX + width / 2 - screenCenter;
            applySkewAndScaleEffect(horizontalDistance);
        }
    };

    const currentX = positions[id]?.x ?? initialX;
    const currentY = positions[id]?.y ?? initialY;

    const paperElement = (
        <div
            ref={ref}
            onClick={toggleOpen}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute"
            style={{
                left: isOpen ? '50%' : `${currentX}px`,
                top: isOpen ? '50%' : `${currentY}px`,
                border: isOpen ? 'none' : '1px solid #00000030',
                width: `${width}px`,
                height: `${height}px`,
                cursor: isDraggingRef.current ? 'grabbing' : 'grab',
                zIndex: isOpen ? baseZIndex + 1000 : baseZIndex + currentY,
                ...warpStyle,
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
