'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { playSound } from '../services';

const CoffeeCup = () => {

    const [coffeeLevel, setCoffeeLevel] = useState(5);

    useEffect(() => {
        if (coffeeLevel < 5 && coffeeLevel >= 0) {
            playSound(`/assets/sounds/coffee/sip${coffeeLevel}.mp3`);
        }
    },[coffeeLevel]);

    return (
        <div className="w-full h-full flex items-center justify-center z-40" onClick={() => setCoffeeLevel(coffeeLevel - 1)}>
            <Image src="/assets/desktop/Mug.svg" alt="Coffee Cup" className="w-full h-full object-contain" draggable="false" layout="fill" />
        </div>
    );
};

export default CoffeeCup;
