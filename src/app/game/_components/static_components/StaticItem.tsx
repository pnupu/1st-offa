'use client';

import React from 'react';

interface StaticItemProps {
    x: number;         // X position of the item
    y: number;         // Y position of the item
    width: number;     // Width of the item
    height: number;    // Height of the item
    zIndex: number;    // Z-index for layering
    children: React.ReactNode;
}

const StaticItem = ({ x, y, width, height, zIndex, children }: StaticItemProps) => {
    return (
        <div
            className="absolute"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: zIndex,
            }}
        >
            {children}
        </div>
    );
};

export default StaticItem;
