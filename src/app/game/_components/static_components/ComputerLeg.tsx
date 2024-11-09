import Image from "next/image";

const ComputerLeg = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("PLANT")}>
      <Image src="/assets/desktop/Leg.svg" alt="ComputerLeg" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default ComputerLeg;