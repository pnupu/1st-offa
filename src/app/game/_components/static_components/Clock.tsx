import Image from "next/image";
import { useGameTime } from "../GameTimeContext";
import { useState } from "react";
import { playSound } from "../services";
import { api } from "@/trpc/react";

const Clock = () => {
  const { timeHours, timeMinutes } = useGameTime();
  const createGameEvent = api.gameEvent.create.useMutation();

  const [timeOffset, setTimeOffset] = useState({ h: 0, m: 0 });

  const addTimeOffset = () => {
    setTimeOffset(prevOffset => {
      const newMinutes = prevOffset.m + 15;
      const additionalHours = Math.floor(newMinutes / 60);
      
      // Create game event for changing time
      createGameEvent.mutate({
        type: "CLOCK_CHANGED",
        oceanScores: {
          conscientiousness: -0.1,  // Significant negative impact on conscientiousness
          neuroticism: 0.05,       // Slight increase in neuroticism (anxiety about cheating)
          agreeableness: -0.05     // Small decrease in agreeableness (being dishonest)
        }
      });

      return {
        h: prevOffset.h + additionalHours,
        m: newMinutes % 60
      };
    });
    playSound("assets/sounds/moveclock.mp3");
  };

  const hourDegrees = ((timeHours + timeOffset.h) % 12) * 30 + ((timeMinutes + timeOffset.m)/ 60) * 30; // 360 degrees / 12 hours
  const minuteDegrees = (timeMinutes + timeOffset.m) * 6; // 360 degrees / 60 minutes

  return (
    <div className="w-full h-full flex items-center justify-center cursor-pointer" onClick={() => addTimeOffset()}>
      <Image src="/assets/desktop/Clock.svg" alt="Clock" className="w-full h-full object-contain" draggable="false" layout="fill" />
      <div
        id="hourHand"
        className="absolute !w-[3px] !h-[35px] !top-[40px] !left-[74px] bg-black"
        style={{ transform: `rotate(${hourDegrees}deg)`, transformOrigin: 'bottom center' }}
      />
      <div
        id="minuteHand"
        className="absolute !w-[3px] !h-[58px] !top-[17px] !left-[74px] bg-black"
        style={{ transform: `rotate(${minuteDegrees}deg)`, transformOrigin: 'bottom center' }}
      />
    </div>
  );
}

export default Clock;
