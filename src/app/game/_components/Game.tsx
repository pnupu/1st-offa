'use client';

import { useEffect, useState } from "react";
import OperatingSystem from "./computer/OperatingSystem";
import { useGameTime } from "./GameTimeContext";
import Clock from "./static_components/Clock";
import ComputerObject from "./static_components/ComputerObject";
import Desk from "./static_components/Desk";
import DeskImage from "./static_components/DeskImage";
import Floor from "./static_components/Floor";
import Plant from "./static_components/Plant";
import PostIt from "./static_components/PostIt";
import StaticItem from "./static_components/StaticItem";
import Wall from "./static_components/Wall";
import Whiteboard from "./static_components/Whiteboard";
import PowerButton from "./static_components/PowerButton";
import { MousePositionProvider } from "./MousePositionContext";

const Game = () => {

    const { startGameTime, pauseGameTime } = useGameTime();
    const [computerOn, setComputerOn] = useState(false);

    useEffect(() => {
        startGameTime();
        return () => {
            pauseGameTime();
        }
    }
    , []);

    const handlePowerButtonClick = () => {
        setComputerOn(!computerOn);
    }

    return (
        <div className="bg-white w-[1280px] h-[720px] relative overflow-hidden">
        <MousePositionProvider>
            <Desk />
            <StaticItem
                x={300}
                y={48}
                width={680}
                height={520}
                zIndex={30}
            >
                <ComputerObject />
            </StaticItem>
            <StaticItem
                x={345}
                y={435}
                width={65}
                height={65}
                zIndex={31}
            >
                <PostIt />
            </StaticItem>
            <StaticItem
                x={1030}
                y={160}
                width={185}
                height={415}
                zIndex={12}
            >
                <Plant />
            </StaticItem>
            <StaticItem
                x={75}
                y={50}
                width={150}
                height={150}
                zIndex={5}
            >
                <Clock />
            </StaticItem>
            <StaticItem
                x={800}
                y={76}
                width={387}
                height={275}
                zIndex={5}
            >
                <Whiteboard />
            </StaticItem>
            <StaticItem
                x={-10}
                y={-55}
                width={1300}
                height={600}
                zIndex={0}
            >
                <Wall />
            </StaticItem>
            <StaticItem
                x={-10}
                y={520}
                width={1300}
                height={200}
                zIndex={0}
            >
                <Floor />
            </StaticItem>
            <StaticItem
                x={942}
                y={439}
                width={10}
                height={10}
                zIndex={500}
            >
                <PowerButton onClick={handlePowerButtonClick} />
            </StaticItem>
            <DeskImage />
            <OperatingSystem isOn={computerOn} />
        </MousePositionProvider>  
        </div>
    );
}

export default Game;
