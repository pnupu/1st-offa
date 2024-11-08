'use client';

import CoffeeCup from "../dnd_componetns/CoffeeCup";
import DraggableItem from "../dnd_componetns/DraggableItem";
import { DragAndDropProvider } from "../DragAndDropContext";

const Desk = () => {
    return (
        <DragAndDropProvider>
            <div className="relative top-[530px] left-[-60px] w-[1400px] h-[300px] bg-no-repeat bg-contain"style={{ backgroundImage: 'url(/assets/desktop/Table.svg)' }}>
                <DraggableItem id="coffee" initialX={300} initialY={150} width={60} height={60}>
                    <CoffeeCup />
                </DraggableItem>
            </div>
        </DragAndDropProvider>
    );
};

export default Desk;
