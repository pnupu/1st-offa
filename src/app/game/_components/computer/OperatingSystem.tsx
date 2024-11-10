'use client';
import { useGameTime } from "../GameTimeContext";
import { useState } from "react";
import { useMousePosition } from "../MousePositionContext";
import Image from "next/image";
import Koolout from "./apps/Koolout";
import Mooz from "./apps/Mooz";
import Checkout from "./apps/Checkout";
import { AppStateProvider } from "./AppStateContext";
import { BackgroundProvider, useBackground } from "./BackgroundContext";
import Bower from "./apps/Bower";
import Browser from "./apps/Browser";
import DinoGame from "./apps/DinoGame";
import Goal from "./apps/Goal";
import Folder from "./apps/X-files";

interface OperatingSystemProps {
  isOn: boolean;
}

const OperatingSystemContent = ({ isOn }: OperatingSystemProps) => {
  const { timeAsString } = useGameTime();
  const [openApp, setOpenApp] = useState<string | undefined>(undefined);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const { x, y } = useMousePosition();
  const { background } = useBackground();

  if (!isOn) {
    return <div className="relative w-[655px] h-[367px] bg-black z-[80] top-[-438px] left-[312px] flex flex-col rounded-t-[15px]"></div>
  }

  const renderApp = () => {
    switch (openApp) {
      case "Koolout":
        return <Koolout />;
      case "BowerBoint":
        return <Bower />;
      case "Mooz":
        return <Mooz />;
      case "Interwebs Adventurer":
        return <Browser />;
      case "CheckedOut":
        return <Checkout />;
      case "Running from responsibilities":
        return <DinoGame />;
      case "Goal":
        return <Goal />;
      case "Folder":
        return <Folder />;
      default:
        return <div className="w-full h-[285px] flex flex-col justify-between items-center">
          <div className="w-full h-[280px] bg-gray-200 flex justify-center items-center">
            Content
          </div>
        </div>;
    }
  };

  return (
    <div 
      className="relative w-[655px] h-[367px] bg-white z-[80] top-[-438px] left-[312px] flex flex-col rounded-t-[15px] overflow-hidden"
      id="computer-screen"
      onMouseEnter={() => setIsMouseInside(true)}
      onMouseLeave={() => setIsMouseInside(false)}
      style={{
        cursor: isMouseInside ? `url('/assets/computer_backgrounds/mouse.svg'), auto` : 'auto',
      }}
    >
      <div className="bg-black w-full h-[15px] text-white text-[11px]">
        <div className="justify-self-end mx-2">{timeAsString}</div>
      </div>      
      <div 
        className="bg-black w-full h-[353px] text-black" 
        style={{
          backgroundImage: background 
            ? `url('${background}')`
            : "url('/assets/computer_backgrounds/kisse.png')",
          backgroundPositionY: "-15px",
          backgroundSize: "cover"
        }}
      >
        {openApp ? (
          <div className="bg-white w-[655px] h-[315px] absolute top-[15px] rounded-md">
            <div className="bg-gray-400 w-full h-[30px] flex justify-between items-center px-2">
              <div>{openApp}</div>
              <div 
                className="h-[20px] w-[20px] bg-red-500 rounded-md cursor-pointer" 
                onClick={() => setOpenApp(undefined)}
              >
                <div className="absolute top-[3px] ml-[5px]">
                  ×
                </div>
              </div>
            </div>
            <div className="w-full h-[285px]">
              {renderApp()}
            </div>
          </div>
        ) : null}
      </div>
      <div className="absolute top-[333px] left-[230px] p-[4px] h-[30px] w-[195px] bg-white/40 backdrop-blur-sm border-white/40 border rounded-md flex gap-3">
        <div 
          onClick={() => setOpenApp("Koolout")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/KooloutApp.svg" 
            alt="Koolout" 
            width={20} 
            height={20}
            unoptimized
          />
        </div>
        <div 
          onClick={() => setOpenApp("BowerBoint")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/BowerApp.svg" 
            alt="Koolout"
            width={20} 
            height={20}
            unoptimized
          />
        </div>
        <div 
          onClick={() => setOpenApp("Interwebs Adventurer")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/Adventurer.svg" 
            alt="Koolout"
            width={20} 
            height={20}
            unoptimized
          />
        </div>
        <div 
          onClick={() => setOpenApp("Running from responsibilities")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/Bunny.svg" 
            alt="Koolout"
            width={12} 
            height={12}
            unoptimized
          />
        </div>
        <div
          onClick={() => setOpenApp("Mooz")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/MoozApp.svg" 
            className="top-[3px]"
            alt="Mooz" 
            width={20} 
            height={20}
            unoptimized
          />
        </div>
        <div 
          onClick={() => setOpenApp("CheckedOut")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/CheckOut.svg" 
            className="top-[3px]"
            alt="Checkout" 
            width={20} 
            height={20}
            unoptimized
          />
        </div>
        <div 
          onClick={() => setOpenApp("Goal")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/Goal.svg" 
            alt="Goal"
            width={20} 
            height={20}
            unoptimized
          />
        </div>
        <div 
          onClick={() => setOpenApp("Folder")}
          className="cursor-pointer"
        >
          <Image 
            src="/assets/apps/Files.svg" 
            alt="Folder"
            width={20} 
            height={20}
            unoptimized
          />
        </div>
      </div>
      {!isMouseInside && (
        <div 
          className="absolute size-[10px]"
          style={{ 
            top: y,
            left: x,
            width: '15px',
            height: '15px',
            pointerEvents: 'none',
            backgroundImage: 'url(/assets/computer_backgrounds/mouse.svg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }} 
        />
      )}
    </div>
  );
}

const OperatingSystem = (props: OperatingSystemProps) => {
  return (
    <AppStateProvider>
      <BackgroundProvider>
        <OperatingSystemContent {...props} />
      </BackgroundProvider>
    </AppStateProvider>
  );
}

export default OperatingSystem;
