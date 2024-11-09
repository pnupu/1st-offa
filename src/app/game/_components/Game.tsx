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
import ComputerLeg from "./static_components/ComputerLeg";

const Game = () => {

    const { startGameTime, pauseGameTime } = useGameTime();
    const [openTask, setOpenTask] = useState<number | null>(null);
    const [computerOn, setComputerOn] = useState(true);

    useEffect(() => {
        startGameTime();
        return () => {
            pauseGameTime();
        }
    }
    , []);

    const handleToggleOpenTask = (id: number) => {
        if (openTask === id) {
            setOpenTask(null);
        } else {
            setOpenTask(id);
        }
    }

    const handlePowerButtonClick = () => {
        setComputerOn(!computerOn);
    }

    return (
        <div className="bg-white w-[1280px] h-[720px] relative overflow-hidden">
        <MousePositionProvider>
            <Desk />
            <StaticItem
                x={300}
                y={-7}
                width={680}
                height={520}
                zIndex={30}
            >
                <ComputerObject />
            </StaticItem>
            <StaticItem
                x={528}
                y={408}
                width={231}
                height={137}
                zIndex={25}
            >
                <ComputerLeg />
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
                zIndex={65}
            >
                <PowerButton onClick={handlePowerButtonClick} />
            </StaticItem>
            <DeskImage />
            <OperatingSystem isOn={computerOn} />
            <div id="portal-root" style={{ position: 'relative', zIndex: 9999 }}></div>
            <StaticItem
                x={345}
                y={435}
                width={65}
                height={65}
                zIndex={openTask === 1 ? 70 : 60}
            >
                <PostIt taskId={1} toggle={() => handleToggleOpenTask(1)} isOpen={openTask === 1} />
            </StaticItem>
            <StaticItem
                x={439}
                y={430}
                width={65}
                height={65}
                zIndex={openTask === 2 ? 70 : 60}
            >
                <PostIt taskId={2} toggle={() => handleToggleOpenTask(2)} isOpen={openTask === 2} />
            </StaticItem>
            <StaticItem
                x={757}
                y={435}
                width={65}
                height={65}
                zIndex={openTask === 3 ? 70 : 60}
            >
                <PostIt taskId={3} toggle={() => handleToggleOpenTask(3)} isOpen={openTask === 3} />
            </StaticItem>
            <StaticItem
                x={828}
                y={435}
                width={65}
                height={65}
                zIndex={openTask === 4 ? 70 : 60}
            >
                <PostIt taskId={4} toggle={() => handleToggleOpenTask(4)} isOpen={openTask === 4} />
            </StaticItem>
        </MousePositionProvider>  
        </div>
    );
}

export default Game;
