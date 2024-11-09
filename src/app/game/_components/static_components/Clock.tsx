import Image from "next/image";

const Clock = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("CLOCK")}>
      <Image src="/assets/desktop/Clock.svg" alt="Clock" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Clock;