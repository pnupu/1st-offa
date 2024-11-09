import Image from "next/image";

const Wall = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("WALL")}>
      <Image src="/assets/desktop/Wall.svg" alt="Wall" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Wall;