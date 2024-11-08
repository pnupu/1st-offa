'use client';

import Image from 'next/image';

const CoffeeCup = () => {
    return (
        <div className="w-full h-full flex items-center justify-center z-40">
            <Image src="/assets/desktop/Mug.svg" alt="Coffee Cup" className="w-full h-full object-contain" draggable="false" layout="fill" />
        </div>
    );
};

export default CoffeeCup;
