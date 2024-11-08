'use client';

import { useGameTime } from "./GameTimeContext";
import ComputerObject from "./static_components/ComputerObject";
import Desk from "./static_components/Desk";
import StaticItem from "./static_components/StaticItem";

const Game = () => {
    const { timeAsString, timeAsNumber, startGameTime, pauseGameTime } = useGameTime();

    return (
        <div className="bg-white w-[1280px] h-[720px] relative overflow-hidden">
            {/* Game Time Display */}
            <div className="absolute top-2 right-2 text-gray-700 font-semibold">
                Game Time: {timeAsString}
            </div>
            
            <Desk />
            <StaticItem
                x={386}
                y={205}
                width={500}
                height={385}
                zIndex={30}
            >
                <ComputerObject />
            </StaticItem>
            
        </div>
    );
}

export default Game;
