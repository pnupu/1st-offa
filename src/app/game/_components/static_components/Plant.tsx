import Image from "next/image";
import { playSound } from "../services";

const Plant = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => playSound("assets/sounds/bushrattle.mp3")}>
      <Image src="/assets/desktop/Plant.svg" alt="Plant" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Plant;