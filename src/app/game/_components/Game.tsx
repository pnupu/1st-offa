'use client';

import React, { useEffect, useState } from "react";
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
import { api } from "@/trpc/react";
import { WebcamProvider } from "./WebcamContext";
import Webcam from "./static_components/Webcam";
import {
    DoorOpen,
  } from "lucide-react";
import { playSound } from "./services";
import { set } from "date-fns";

const Game = () => {

    const { startGameTime, timeAsNumber } = useGameTime();
    const [openTask, setOpenTask] = useState<number | null>(null);
    const [computerOn, setComputerOn] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);
    const [computerCanSound, setComputerCanSound] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const calculateFinalScores = api.gameEvent.calculateFinalScores.useMutation();
    const createGameEvent = api.gameEvent.create.useMutation();

    useEffect(() => {
        if (computerOn && computerCanSound) {
            playSound('assets/sounds/computeron.mp3');
        } else if (computerCanSound) {
            playSound('assets/sounds/computeroff.mp3');
        }
    }, [computerOn, computerCanSound]);

    useEffect(() => {
        setTimeout(() => {
            setComputerCanSound(true);
        } , 500);
    }, []);

    const handleToggleOpenTask = (id: number) => {
        if (openTask === id) {
            setOpenTask(null);
        } else {
            setOpenTask(id);
        }
    }

    const handleGotIt = () => {
        setShowInstructions(false);
        startGameTime();
    }

    const handlePowerButtonClick = () => {
        setComputerOn(!computerOn);
    }

    const handleLeaveWork = async () => {
        setIsLeaving(true);
        
        // Check if leaving early (before 8 hours)
        const workDayInSeconds = 8 * 60 * 60 + 8 * 60 * 60;
        if (timeAsNumber < workDayInSeconds) {
            // Create event for leaving early
            createGameEvent.mutate({
                type: "LEFT_WORK_EARLY",
                oceanScores: {
                    conscientiousness: -0.1,  // Penalty for leaving early
                    neuroticism: 0.05        // Slight increase in neuroticism
                }
            });
        }

        // Calculate final scores
        await calculateFinalScores.mutateAsync();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = '/dashboard/profile';
        }, 2000);
    };

    return (
        <div className="bg-white w-[1280px] h-[720px] relative overflow-hidden">
        <WebcamProvider>
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
            <StaticItem
                x={610}
                y={10}
                width={65}
                height={65}
                zIndex={50}
            >
                <Webcam />
            </StaticItem>

            <div className="absolute top-4 right-4 z-[100]">
                <button
                    onClick={handleLeaveWork}
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
                    disabled={isLeaving}
                >
                    <DoorOpen />
                    Leave Work
                </button>
            </div>

            {/* Loading overlay */}
            {isLeaving && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-[101]">
                    <div className="text-white text-2xl mb-4">Calculating Performance...</div>
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </MousePositionProvider>  
        </WebcamProvider>
        {showInstructions && (
            <div className="fixed width-[400px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#42669B] p-4 rounded-lg z-[1000] text-left" style={{ opacity: 0.9 }}>
                <div className="text-white text-2xl mb-4">Instructions</div>
                <div className="text-white text-lg mb-4">Hello! It&apos;s your 1st day at the Offa, so I left you some notes about tasks that need to be completed. </div>
                <div className="text-white text-lg mb-4">Make sure to also look at your email. Remember that you should not be running from responsibilities.</div>
                <div className="text-white text-lg mb-4">Good luck!</div>
                <br />
                <div className="text-white text-lg mb-4">Interact with items using left click</div>
                <div className="text-white text-lg mb-4">Some items can be dragged around by holding the D-key</div>
                <div className="text-white text-lg mb-4">You can use the computer with your own mosue</div>
                <button onClick={() => handleGotIt()} className="bg-white text-[#42669B] font-semibold py-2 px-4 rounded-md">Got it!</button>
            </div>
        )}
        </div>
    );
}

export default Game;
