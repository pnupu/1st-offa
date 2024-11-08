'use client';

import { useGameTime } from "./GameTimeContext";

const Game = () => {

    const { timeAsString, timeAsNumber, startGameTime, pauseGameTime } = useGameTime();

    return (
        <div className="bg-white w-[1280px] h-[720px]">
            <h1 className="text-4xl font-bold text-center p-4">Game Time</h1>
            <p className="text-2xl text-center">Current Time: {timeAsString}</p>
            <p className="text-2xl text-center">Time in Minutes: {timeAsNumber}</p>
            <div className="flex justify-center gap-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={startGameTime}
                >
                    Start
                </button>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={pauseGameTime}
                >
                    Pause
                </button>
            </div>
        </div>
    )
}

export default Game;