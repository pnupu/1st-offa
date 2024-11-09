'use client';

import CoffeeCup from "../dnd_componetns/CoffeeCup";
import DraggableItem from "../dnd_componetns/DraggableItem";
import DraggablePaper from "../dnd_componetns/DraggablePaper";
import Keyboard from "../dnd_componetns/Keyboard";
import Mouse from "../dnd_componetns/Mouse";
import { DragAndDropProvider } from "../DragAndDropContext";

const Desk = () => {
    return (
        <DragAndDropProvider>
            <div className="relative top-[480px] left-[-260px] w-[1800px] h-[250px] bg-no-repeat bg-contain z-50">
                <DraggableItem id="coffee" initialX={418} initialY={1} width={120} height={120}>
                    <CoffeeCup />
                </DraggableItem>
                <DraggableItem id="keyboard" initialX={670} initialY={96} width={450} height={90} manualZ={1}>
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
