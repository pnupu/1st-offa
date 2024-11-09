import Image from "next/image";
import { useGameTime } from "../GameTimeContext";

const Clock = () => {
  const { timeHours, timeMinutes } = useGameTime();

  const hourDegrees = (timeHours % 12) * 30 + (timeMinutes / 60) * 30; // 360 degrees / 12 hours
  const minuteDegrees = timeMinutes * 6; // 360 degrees / 60 minutes

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("CLOCK")}>
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