'use client';
import { useGameTime } from "../GameTimeContext";
import { useState } from "react";
import { useMousePosition } from "../MousePositionContext";

interface OperatingSystemProps {
  isOn: boolean;
}

const OperatingSystem = ({ isOn }: OperatingSystemProps) => {

  const { timeAsString } = useGameTime();
  const [openApp, setOpenApp] = useState<string | undefined>(undefined);

  if (!isOn) {
    return <div className="relative w-[655px] h-[367px] bg-black z-[80] top-[-438px] left-[312px] flex flex-col"></div>
  }

  return (
    <div className="relative w-[655px] h-[367px] bg-white z-[80] top-[-438px] left-[312px] flex flex-col" id="computer-screen">
      <div className="bg-black w-full h-[15px] text-white text-[11px]">
        <div className="justify-self-end mx-2">{timeAsString}</div>
      </div>      
      <div className="bg-black w-full h-[353px] bg-[url('/assets/computer_backgrounds/kisse.png')]">
      {/* <div> MAIN CONTENT HERE */}
      {
        openApp ? (
          <div className="bg-white w-[655px] h-[315px] absolute top-[15px] rounded-md">
            <div className="bg-gray-400 w-full h-[30px] flex justify-between items-center px-2">
              <div>{openApp} App</div>
              <div className="h-[20px] w-[20px] bg-red-500 rounded-md" onClick={() => setOpenApp(undefined)}></div>
            </div>
            <div className="w-full h-[285px]">
              <div className="w-full h-[285px] flex flex-col justify-between items-center">
                <div className="w-full
                h-[280px] bg-gray-200 flex justify-center items-center">
                  Content
                  </div>
              </div>
            </div>
          </div>
        ) : null
      }
      </div>
      <div className="absolute top-[333px] left-[180px] p-[4px] h-[28px] w-[300px] bg-white/40 backdrop-blur-sm border-white/40 border rounded-md flex gap-1">
      {/* <div> APP BAR */}
        <div className="h-[20px] w-[20px] bg-emerald-500 rounded-md" onClick={() => setOpenApp("Emerald")}>
        </div>
        <div className="h-[20px] w-[20px] bg-cyan-500 rounded-md" onClick={() => setOpenApp("Cyan")}>
        </div>
        <div className="h-[20px] w-[20px] bg-purple-500 rounded-md" onClick={() => setOpenApp("Purple")} onScroll={() => console.log("Scrolling at Purple")}>
        </div>
      </div>
      <MouseCursor />
    </div>
  );
}

const MouseCursor = () => {
    const { x, y } = useMousePosition();

    return (
        <div
            style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                width: '15px',
                height: '15px',
                pointerEvents: 'none',
                backgroundImage: 'url(/assets/computer_backgrounds/mouse.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
            }}
        />
    );
};

export default OperatingSystem;