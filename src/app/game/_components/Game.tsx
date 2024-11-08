'use client';

import { useGameTime } from "./GameTimeContext";
import Desk from "./static_components/Desk";

const Game = () => {
    const { timeAsString, timeAsNumber, startGameTime, pauseGameTime } = useGameTime();

    return (
        <div className="bg-white w-[1280px] h-[720px] relative overflow-hidden">
            {/* Game Time Display */}
            <div className="absolute top-2 right-2 text-gray-700 font-semibold">
                Game Time: {timeAsString}
            </div>
            
            {/* Desk Component */}
            <Desk />
        </div>
    );
}

export default Game;
