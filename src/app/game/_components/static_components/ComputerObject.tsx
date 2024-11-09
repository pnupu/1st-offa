import Image from "next/image";

const ComputerObject = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("COMPUTER")}>
      <Image src="/assets/desktop/Screen.svg" alt="Screen" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default ComputerObject;