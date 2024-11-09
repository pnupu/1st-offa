'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const BossAnimation = () => {
  const [headPosition, setHeadPosition] = useState(0);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const animate = () => {
      // Random interval between 1 and 3 seconds
      const interval = Math.random() * 150 + 100;
      
      // Random movement amount between 5 and 15 pixels
      const movement = Math.random() * 15 + 5;
      
      setHeadPosition(prev => {
        // If head is down, move up, otherwise move down
        return prev === 0 ? -movement : 0;
      });

      timeoutId = setTimeout(animate, interval);
    };

    // Start the animation
    animate();
    
    return () => {
      clearTimeout(timeoutId);
      setHeadPosition(0);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Image
        src="/assets/img/Bossman-body.png"
        alt="Boss Man Body"
        width={640}
        height={480}
        className="w-full h-full object-cover"
        priority
      />
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(${headPosition}px)` }}
      >
        <Image
          src="/assets/img/Bossman-head.png"
          alt="Boss Man Head"
          width={640}
          height={480}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default BossAnimation;