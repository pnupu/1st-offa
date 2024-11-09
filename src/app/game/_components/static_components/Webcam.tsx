import Image from "next/image";
import { useWebcam } from "../WebcamContext";

const Webcam = () => {

  const { isWebcamOn } = useWebcam();

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("Webcam")}>
      <Image src={`/assets/desktop/${isWebcamOn ? "Webcam" : "WebcamOff"}.svg`} alt="ComputerLeg" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Webcam;