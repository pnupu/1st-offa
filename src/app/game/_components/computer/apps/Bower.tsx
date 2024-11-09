import Image from "next/image";
import { useEffect, useState } from "react";
import { useTasks } from "../../TaskContext";

const Bower = () => {

  const [slidesChecked, setSlidesChecked] = useState<number[]>([1]);
  const [ openSlideIndex, setOpenSlideIndex ] = useState<number>(1);
  const { completeAction } = useTasks();

  useEffect(() => {
    completeAction(5, "openBowerBoint");
  }, []);

  useEffect(() => {
    if (slidesChecked.length === 7) {
      completeAction(5, "checkAllSlides");
    }
  } , [slidesChecked]);

  const handleSlideClick = (slideIndex: number) => {
    if (!slidesChecked.includes(slideIndex)) {
      setSlidesChecked([...slidesChecked, slideIndex]);
      setOpenSlideIndex(slideIndex);
    } else {
      setOpenSlideIndex(slideIndex);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[30px] bg-[#AD3D2D] flex justify-between items-center px-2 pr-[300px] text-xs">
        <button className="text-white">File</button>
        <button className="text-[#AD3D2D] bg-white p-2 mx-[-20px]">Slide</button>
        <button className="text-white">Edit</button>
        <button className="text-white">View</button>
        <button className="text-white">Insert</button>
        <button className="text-white">Format</button>
        <button className="text-white">Help</button>
      </div>
      <div className="h-[25px] bg-gray-300 text-gray-900 flex justify-between items-center px-2 pr-[300px] text-xs">
        <button>Undo</button>
        <button>Redo</button>
        <button>DoDo</button>
        <button>Cut</button>
        <button>Copy</button>
        <button>Paste</button>
        <button>Delete</button>
        <button>Find</button>
        <button>Replace</button>
      </div>
      <div className="w-full h-[230px] bg-gray-100 flex">
        <div className="w-[140px] bg-gray-200 border-r border-gray-200 overflow-y-auto"> 
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(1)}>
            <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">1.</p>
            <Image src={`/assets/img/Presentation/ProjectX_1.png`} width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(2)}>
            <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">2.</p>
            <Image src={`/assets/img/Presentation/ProjectX_2.png`} width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(3)}>
           <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">3.</p>
            <Image src={`/assets/img/Presentation/ProjectX_3.png`} width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(4)}>
            <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">4.</p>
            <Image src={`/assets/img/Presentation/ProjectX_4.png`} width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(5)}>
            <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">5.</p>
            <Image src={`/assets/img/Presentation/ProjectX_5.png`} width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(6)}>
            <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">6.</p>
            <Image src={`/assets/img/Presentation/ProjectX_6.png`} width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSlideClick(7)}>
            <p className="text-gray-900 text-xs ml-[-5px] mr-[5px]">7.</p>
            <Image src={`/assets/img/Presentation/ProjectX_7.png`} width={100} height={50} alt="Slide" />
          </div>
        </div>
        <div className="w-[515px] h-full bg-white flex justify-center items-center">
          <Image src={`/assets/img/Presentation/ProjectX_${openSlideIndex}.png`} width={400} height={200} alt="Slide" />
        </div>
      </div>
    </div>
  )
}

export default Bower;