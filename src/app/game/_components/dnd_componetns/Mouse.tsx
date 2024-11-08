'use client';

import Image from 'next/image';

const Mouse = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Image src="/assets/desktop/Mouse.svg" alt="Mouse" className="w-full h-full object-contain" draggable="false" layout="fill" />
        </div>
    );
};

export default Mouse;
