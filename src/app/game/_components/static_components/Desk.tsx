'use client';

import CoffeeCup from "../dnd_componetns/CoffeeCup";
import DraggableItem from "../dnd_componetns/DraggableItem";
import Keyboard from "../dnd_componetns/Keyboard";
import Mouse from "../dnd_componetns/Mouse";
import { DragAndDropProvider } from "../DragAndDropContext";

const Desk = () => {
    return (
        <DragAndDropProvider>
            <div className="relative top-[530px] left-[-60px] w-[1400px] h-[300px] bg-no-repeat bg-contain z-20"style={{ backgroundImage: 'url(/assets/desktop/Table.svg)' }}>
                <DraggableItem id="coffee" initialX={370} initialY={63} width={60} height={60}>
                    <CoffeeCup />
                </DraggableItem>
                <DraggableItem id="keyboard" initialX={526} initialY={84} width={300} height={60}>
                    <Keyboard />
                </DraggableItem>
                <DraggableItem id="mouse" initialX={874} initialY={67} width={60} height={60}>
                    <Mouse />
                </DraggableItem>
            </div>
        </DragAndDropProvider>
    );
};

export default Desk;
