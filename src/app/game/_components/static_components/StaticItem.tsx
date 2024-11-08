'use client';


interface StaticItemProps {
    x: number;         // X position of the item
    y: number;         // Y position of the item
    width: number;     // Width of the item
    height: number;    // Height of the item
    zIndex: number;    // Z-index for layering
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const StaticItem = ({ x, y, width, height, zIndex, children, onClick }: StaticItemProps) => {
    return (
        <div
            className="absolute"
            onClick={onClick}
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
