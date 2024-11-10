// PostIt.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTasks } from '../TaskContext';
import Image from 'next/image';
import { playSound } from '../services';

interface PostItProps {
  taskId: number;
  isOpen: boolean;
  toggle: () => void;
}

const PostIt = ({ taskId, isOpen, toggle}: PostItProps) => {
  const { tasks, startTask } = useTasks();
  const [isTaskStarted, setIsTaskStarted] = useState(false);
  const task = tasks.find((t) => t.id === taskId);
  const [discarded, setDiscarded] = useState(false);

  useEffect(() => {
    if (task?.status === 'completed') {
      playSound('assets/sounds/success.mp3');
    }
  }, [task]);

  if (!task) {
    return <div className="p-4 bg-yellow-300">Task not found</div>;
  }

  const handleStartTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (task.status === 'not_started') {
      startTask(task.id);
      setIsTaskStarted(true);
    }
  };

  if (discarded) {
    return null;
  } else if (isOpen) return (
    <div
      className="relative w-40 h-40 shadow-md rounded-md flex flex-col items-center justify-center bg-cover bg-center text-center cursor-pointer text-black"
      style={{ backgroundImage: 'url(/assets/desktop/Post-it.svg)' }}
      onClick={() => toggle()}
    >
      <div className="flex flex-col items-center h-[100%] p-2">
        <h3 className="text-lg self-start m-[-4px]" style={task.status === "completed" ? {textDecoration: 'line-through'} : {}}>{task.title}</h3>
        <div className='flex flex-col h-[80px] w-[144px] text-left mt-[4px]'>
          <p className="text-sm">{task.description}</p>
          <p className="text-sm">Status: {task.status}</p>
        </div>
        {!isTaskStarted && (
          <button
            onClick={(e) => handleStartTask(e)}
            className="mt-1 px-2 py-[2px] bg-gray-800 text-white rounded"
          >
            Start
          </button>
        )}
        {task.status === "completed" && <Image src="/assets/computer_backgrounds/check.svg" alt="Completed" width={30} height={30} style={{position: "absolute", top: 118, left: 101}}/>}
        {task.status === "completed" && <Image src="/assets/computer_backgrounds/trash.svg" alt="Completed" onClick={() => setDiscarded(true)} width={22} height={22} style={{position: "absolute", top: 5, left: 110, cursor: "pointer"}}/>}
        <div className='absolute bottom-0'>
          <p className='text-xs text-black'>Click to close</p>
        </div>
      </div>
    </div>
  );
  
  return (
  <div className="w-full h-full flex-col flex p-1 cursor-pointer" onClick={() => toggle()} style={{ backgroundImage: 'url(/assets/desktop/Post-it.svg)' }}>
      <div className="flex p-1">
        <p className="text-[10px] text-black" style={task.status === "completed" ? {textDecoration: 'line-through'} : {}}>{task.title}</p>
        {task.status === "completed" && <Image src="/assets/computer_backgrounds/check.svg" alt="Completed" width={18} height={18} style={{position: "absolute", top: 48, left: 46}}/>}
      </div>
      <div>
        <p className='text-xs text-black'>Click to open</p>
      </div>
  </div>);
};

export default PostIt;
