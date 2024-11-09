'use client';

import Image from 'next/image';

const Keyboard = () => {
    return (
        <div className="w-full h-full flex items-center justify-center z-40">
            <Image src="/assets/desktop/Keyboard.svg" alt="Keyboard" className="w-full h-full object-contain" draggable="false" layout="fill" />
        </div>
    );
};

export default Keyboard;
