import Image from "next/image";

const Whiteboard = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("WHITEBOARD")}>
      <Image src="/assets/desktop/Whiteboard.svg" alt="Whiteboard" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Whiteboard;