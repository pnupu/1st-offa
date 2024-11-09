'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface GameTimeContextProps {
    timeAsNumber: number;
    timeAsString: string;
    timeHours: number;
    timeMinutes: number;
    startGameTime: () => void;
    pauseGameTime: () => void;
}

const GameTimeContext = createContext<GameTimeContextProps | undefined>(undefined);

const initialHour = 7;
const initialMinute = 45;
const secondsPerGameMinute = 1; // 1 real second = 1 game minute

export const GameTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timeInMinutes, setTimeInMinutes] = useState(initialHour * 60 + initialMinute);
    const [isRunning, setIsRunning] = useState(false);

    // Convert time in minutes to a formatted hh:mm string
    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const timeAsString = formatTime(timeInMinutes);
    const timeHours = Math.floor(timeInMinutes / 60);
    const timeMinutes = timeInMinutes % 60;

    // Start the timer
    const startGameTime = useCallback(() => {
        setIsRunning(true);
    }, []);

    // Pause the timer
    const pauseGameTime = useCallback(() => {
        setIsRunning(false);
    }, []);

    // Update game time every second if running
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeInMinutes((prevTime) => prevTime + 1);
        }, secondsPerGameMinute * 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <GameTimeContext.Provider
            value={{
                timeAsNumber: timeInMinutes,
                timeAsString,
                timeHours,
                timeMinutes,
                startGameTime,
                pauseGameTime,
            }}
        >
            {children}
        </GameTimeContext.Provider>
    );
};

// Custom hook for using game time
export const useGameTime = (): GameTimeContextProps => {
    const context = useContext(GameTimeContext);
    if (!context) {
        throw new Error('useGameTime must be used within a GameTimeProvider');
    }
    return context;
};
