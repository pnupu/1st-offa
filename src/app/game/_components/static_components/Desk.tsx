'use client';

import { useState } from 'react';
import CoffeeCup from "../dnd_componetns/CoffeeCup";
import DraggableItem from "../dnd_componetns/DraggableItem";
import DraggablePaper from "../dnd_componetns/DraggablePaper";
import Keyboard from "../dnd_componetns/Keyboard";
import Mouse from "../dnd_componetns/Mouse";
import { DragAndDropProvider } from "../DragAndDropContext";
import { api } from "@/trpc/react";

const Desk = () => {
    const [lastCoffeeClick, setLastCoffeeClick] = useState<Date | null>(null);
    const createGameEvent = api.gameEvent.create.useMutation();

    const handleCoffeeClick = () => {
        // Prevent spam clicking by adding a 5-minute cooldown
        if (lastCoffeeClick && new Date().getTime() - lastCoffeeClick.getTime() < 300000) {
            return;
        }

        createGameEvent.mutate({
            type: "COFFEE_CLICK",
            oceanScores: {
                conscientiousness: 0.1,  // Slight boost to conscientiousness
                neuroticism: -0.1,      // Slight decrease in neuroticism (more stable)
            }
        });

        setLastCoffeeClick(new Date());
    };

    const handleKeyboardClick = () => {
        createGameEvent.mutate({
            type: "KEYBOARD_CLICK",
            oceanScores: {
                conscientiousness: 0.05,  // Small boost to conscientiousness
            }
        });
    };

    return (
        <DragAndDropProvider>
            <div className="relative top-[480px] left-[-260px] w-[1800px] h-[250px] bg-no-repeat bg-contain z-50">
                <DraggableItem 
                    id="coffee" 
                    initialX={418} 
                    initialY={1} 
                    width={120} 
                    height={120}
                    onClick={handleCoffeeClick}
                >
                    <CoffeeCup />
                </DraggableItem>
                <DraggableItem 
                    id="keyboard" 
                    initialX={670} 
                    initialY={96} 
                    width={450} 
                    height={90} 
                    manualZ={1}
                    onClick={handleKeyboardClick}
                >
                    <Keyboard />
                </DraggableItem>
                <DraggableItem id="mouse" initialX={1180} initialY={97} width={70} height={70}>
                    <Mouse />
                </DraggableItem>
                <DraggablePaper id="namingconv" initialX={512} initialY={0} width={150} height={212} imagePath="/assets/tasks/file-naming-conventions.svg" />
                <DraggablePaper id="invoice" initialX={1142} initialY={18} width={150} height={212} imagePath="/assets/tasks/invoice.svg" />
                <DraggablePaper id="querterly" initialX={298} initialY={29} width={150} height={212} imagePath="/assets/tasks/quarterly-data.svg" />
                <DraggablePaper id="styleguide" initialX={1315} initialY={1} width={150} height={212} imagePath="/assets/tasks/style-guide.svg" />
            </div>
        </DragAndDropProvider>
    );
};

export default Desk;
