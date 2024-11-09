'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

interface GameTimeContextProps {
    timeAsNumber: number;
    timeAsString: string;
    startGameTime: () => void;
    pauseGameTime: () => void;
}

const GameTimeContext = createContext<GameTimeContextProps | undefined>(undefined);

const initialHour = 7;
const initialMinute = 45;
const secondsPerGameMinute = 1; // Added missing constant

export const GameTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timeInMinutes, setTimeInMinutes] = useState(initialHour * 60 + initialMinute);
    const [isRunning, setIsRunning] = useState(false);

    const formatTime = useCallback((time: number): string => {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }, []);

    const timeAsString = useMemo(() => formatTime(timeInMinutes), [timeInMinutes, formatTime]);

    const startGameTime = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pauseGameTime = useCallback(() => {
        setIsRunning(false);
    }, []);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeInMinutes(prev => prev + 1);
        }, secondsPerGameMinute * 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const value = useMemo(() => ({
        timeAsNumber: timeInMinutes,
        timeAsString,
        startGameTime,
        pauseGameTime,
    }), [timeInMinutes, timeAsString, startGameTime, pauseGameTime]);

    return (
        <GameTimeContext.Provider value={value}>
            {children}
        </GameTimeContext.Provider>
    );
};

export const useGameTime = (): GameTimeContextProps => {
    const context = useContext(GameTimeContext);
    if (!context) {
        throw new Error('useGameTime must be used within a GameTimeProvider');
    }
    return context;
};
