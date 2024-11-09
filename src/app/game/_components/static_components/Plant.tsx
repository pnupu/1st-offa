import Image from "next/image";

const Plant = () => {

  return (
    <div className="w-full h-full flex items-center justify-center" onClick={() => console.log("PLANT")}>
      <Image src="/assets/desktop/Plant.svg" alt="Plant" className="w-full h-full object-contain" draggable="false" layout="fill" />
    </div>
  );
}

export default Plant;