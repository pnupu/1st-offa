import Image from "next/image";

const Floor = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("FLOOR")}>
      <Image src="/assets/desktop/Floor.svg" alt="Floor" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Floor;