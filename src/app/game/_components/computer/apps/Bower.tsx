import Image from "next/image";
import { useState } from "react";

const Bower = () => {

  const [ openSlideIndex, setOpenSlideIndex ] = useState<number>(0);

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
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(0)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(1)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(2)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(3)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(4)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(5)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
          <div className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => setOpenSlideIndex(6)}>
            <Image src="/assets/computer_backgrounds/kisse.png" width={100} height={50} alt="Slide" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bower;